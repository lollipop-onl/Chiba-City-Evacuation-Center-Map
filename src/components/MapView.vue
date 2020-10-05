<template>
  <div class="map-view">
    <div
      ref="mapView"
      class="map"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, PropType } from 'vue';
import sheltersData from '../assets/shelters.json';
import { ShelterMarker } from '../utils/ShelterMarker';
import { nonNullable } from '../utils/nonNullable';
import { Shelter, MapPosition } from '../types';
import { noop } from '../utils/noop';

export default defineComponent({
  name: 'MapView',
  props: {
    /** 避難所一覧 */
    shelters: {
      type: Array as PropType<Shelter[]>,
      required: true,
    },
    /** 選択されている避難所Id */
    shelterId: {
      type: Number as PropType<number | null>,
      default: null,
    },
  },
  emits: {
    /**
     * 避難所がクリックされた
     * @param shelterId 施設ID
     */
    clickFacility: (shelterId: number): boolean => {
      return shelterId != null;
    },
  },
  setup(props, { emit }) {
    const mapView = ref<HTMLDivElement>();
    const map = ref<google.maps.Map<HTMLDivElement>>();
    const markers = ref<ShelterMarker[]>([]);
    const centerPosition = ref<MapPosition | null>(null);
    const shelter = computed(() => props.shelters.find((shelter) => shelter.id === props.shelterId));

    /** マーカーを初期化する */
    const initializeMarkers = (): void => {
      if (markers.value.length > 0) {
        return;
      }

      markers.value = props.shelters
        .map((shelter) => {
          if (!map.value) {
            return;
          }

          return new ShelterMarker(shelter, map.value, onClickMarker);
        })
        .filter(nonNullable);
    }

    /** ライフサイクルフック */
    onMounted(async (): Promise<void> => {
      if (!mapView.value) {
        return;
      }

      map.value = new google.maps.Map(mapView.value, {
        zoom: 17,
        minZoom: 15,
        center: { lat: 35.607272, lng: 140.106500 },
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        clickableIcons: false,
        zoomControl: false,
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
      });

      initializeMarkers();
    });

    // 再描画の依存注入
    watch(() => props.shelters, () => {
      initializeMarkers();
    });

    watch(() => shelter.value, async (shelter) => {
      if (!map.value) {
        return;
      }

      map.value.setOptions({
        draggable: !shelter,
        scrollwheel: !shelter,
      });

      if (shelter) {
        const center = map.value.getCenter();

        centerPosition.value = {
          latitude: center.lat(),
          longitude: center.lng(),
          zoom: map.value.getZoom(),
        }

        map.value.setCenter(new google.maps.LatLng(shelter.latitude, shelter.longitude));
        map.value.setZoom(18);

        markers.value.forEach((marker) => marker.setActivation(props.shelterId === marker.shelter.id));
      } else if (centerPosition.value) {
        const { latitude, longitude, zoom } = centerPosition.value;

        centerPosition.value = null;

        map.value.setCenter(new google.maps.LatLng(latitude, longitude));
        map.value.setZoom(zoom);

        markers.value.forEach((marker) => marker.setActivation(false));
      }
    });

    const onClickMarker = (shelter: Shelter) => {
      emit('clickFacility', shelter.id);
    };

    return {
      mapView,
    }
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate3d(0, 0, 0);
  }

  100% {
    transform: translate(-50%, -50%) rotate3d(0, 0, 1, 360deg);
  }
}

.map-view {
  & > .map {
    width: 100%;
    height: 300px;
  }

  /* stylelint-disable rscss/no-descendant-combinator, rscss/class-format */
  ::v-deep(.shelter-marker) {
    $marker-size: 40px;

    position: absolute;
    transform: translate(-50%, -50%);

    & > .marker {
      position: relative;
      width: $marker-size;
      height: $marker-size;
      color: #fff;
      cursor: pointer;
      background: #ff005b;
      filter: drop-shadow(0 3px 5px rgba(#000, 0.2));
      border: 0;
      border-radius: 50%;
    }

    & > .marker::before {
      position: absolute;
      top: 50%;
      left: 50%;
      content: '★';
      transform: translate(-50%, -50%);
    }

    & > .marker::after {
      position: absolute;
      top: 50%;
      left: 50%;
      box-sizing: border-box;
      width: $marker-size;
      height: $marker-size;
      content: '';
      border: 2px dashed #ff005b;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    &.-active > .marker {
      width: 50px;
      height: 50px;
      font-size: 2em;
      color: #ff005b;
      background: transparent;
    }

    &.-active > .marker::before {
      font-size: 24px;
    }

    &.-active > .marker::after {
      animation: spin 10s linear infinite;
    }
  }
  /* stylelint-enable rscss/no-descendant-combinator, rscss/class-format */
}
</style>
