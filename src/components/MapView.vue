<template>
  <div class="map-view">
    <div
      ref="mapView"
      class="map"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { throttle } from 'throttle-debounce';
import { ShelterMarker } from '../utils/ShelterMarker';
import { nonNullable } from '../utils/nonNullable';

export default defineComponent({
  name: 'MapView',
  setup() {
    const mapView = ref<HTMLDivElement>();
    const map = ref<google.maps.Map<HTMLDivElement>>();
    const markers = ref<ShelterMarker[]>([]);
    const hideHiddenMarker = throttle(500, (): void => {
      const bounds = map.value?.getBounds();

      if (!bounds) {
        return;
      }

      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();
      const top = northEast.lng();
      const right = southWest.lat();
      const bottom = southWest.lng();
      const left = northEast.lat();

      markers.value.forEach((marker) => {
        const { latitude: x, longitude: y } = marker.shelter;

        marker.setVisibility(
          top >= y &&
          right <= x &&
          bottom <= y &&
          left >= x
        );
      });
    });

    onMounted(async (): Promise<void> => {
      if (!mapView.value) {
        return;
      }

      map.value = new google.maps.Map(mapView.value, {
        zoom: 17,
        center: { lat: 35.607272, lng: 140.106500 },
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true,
      });

      const { default: data } = await import('../assets/shelters.json');

      markers.value = data.shelters
        .map((shelter) => {
          if (!map.value) {
            return;
          }

          new google.maps.Marker({
            position: new google.maps.LatLng(shelter.latitude, shelter.longitude),
            label: `${shelter.id}`,
            map: map.value,
          });

          return new ShelterMarker(shelter, map.value);
        })
        .filter(nonNullable);

      map.value.addListener('bounds_changed', () => {
        hideHiddenMarker();
      });

      hideHiddenMarker();
    });

    return {
      mapView,
    }
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-view {
  & > .map {
    width: 100%;
    height: 300px;
  }

  /* stylelint-disable rscss/no-descendant-combinator, rscss/class-format */
  ::v-deep .shelter-marker {
    position: absolute;
    transition: transform 2s ease;
    transform: translate3d(-50%, -100%, 0);
    transform-origin: bottom center;

    &.-hidden {
      transform: translate3d(-50%, -100%, 0) scale(0);
    }
  }
  /* stylelint-enable rscss/no-descendant-combinator, rscss/class-format */
}
</style>
