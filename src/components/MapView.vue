<template>
  <div class="map-view">
    <div
      ref="mapView"
      class="map"
      :data-shelter-id="shelterId"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, PropType, computed } from 'vue';
import { AVAILABLE_COORDINATE_RANGE } from '../const';
import { nonNullable } from '../utils/nonNullable';
import { getShelterMarkerAttributes } from '../utils/getShelterMarkerAttributes';
import { PresentLocation, Shelter } from '../types';

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
    /** ユーザーの現在位置 */
    presentLocation: {
      type: Object as PropType<PresentLocation | null>,
      default: null,
    },
  },
  emits: {
    /**
     * 避難所がクリックされた
     * @param shelterId 施設ID
     */
    clickShelter: (shelterId: number): boolean => {
      return shelterId != null;
    },
  },
  setup(props, { emit }) {
    const mapView = ref<HTMLDivElement>();
    const map = ref<L.Map>();
    const markers = ref<L.Marker[]>([]);
    const zoomLevel = ref<number>(0);
    const presentMarker = ref<L.Marker | null>(null);
    const accuracyCircle = ref<L.Circle | null>(null);
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

          const { id, name, latitude, longitude } = shelter;

          const shelterIcon = window.L.divIcon({
            iconSize: undefined,
            html: `<div class="marker" ${getShelterMarkerAttributes(shelter)}></div>`,
            className: `shelter-marker -shelter-${id}`,
          });

          return window.L
            .marker([latitude, longitude], {
              title: name,
              alt: `${latitude},${longitude}`,
              icon: shelterIcon,
              riseOnHover: true,
            })
            .addTo(map.value)
            .on('click', () => {
              onClickMarker(shelter);
            });
        })
        .filter(nonNullable);
    }

    const flyToShelter = (animate = true): void => {
      if (!shelter.value || !map.value) {
        return;
      }

      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
      const isMobile = windowWidth <= 600;

      const targetCoordinate: [number, number] = isMobile
        ? [
          shelter.value.latitude - ((windowHeight - 64) / 2 - 80) * 0.000004278,
          shelter.value.longitude,
        ]
        : [
          shelter.value.latitude,
          shelter.value.longitude - (windowWidth / 2 - (windowWidth - 400) / 2) * 0.000005405,
        ];

      map.value.flyTo(
        targetCoordinate,
        18,
        { animate },
      );
    };

    const onClickMarker = (shelter: Shelter) => {
      emit('clickShelter', shelter.id);
    };

    /** ライフサイクルフック */
    onMounted(async (): Promise<void> => {
      if (!mapView.value) {
        return;
      }

      const tileLayer = window.L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright" target="_blank" rel=”noopener noreferrer”>OpenStreetMap</a> contributors'
      });

      const { presentLocation } = props;
      const center: [number, number] = presentLocation ?
        [presentLocation.latitude, presentLocation.longitude]:
        [35.607272, 140.106500];

      map.value = window.L.map(mapView.value, {
        center,
        zoom: 17,
        maxZoom: 18,
        minZoom: 14,
        maxBounds: AVAILABLE_COORDINATE_RANGE,
        layers: [tileLayer],
        zoomControl: false,
      });

      zoomLevel.value = map.value.getZoom() - 14;

      map.value.on('zoomend', ({ target }) => {
        zoomLevel.value = target.getZoom() - 14;
      });

      initializeMarkers();
      flyToShelter(false);
    });

    // 再描画の依存注入
    watch(() => props.shelters, () => {
      initializeMarkers();
    });

    watch(() => zoomLevel.value, (zoomLevel) => {
      if (!map.value) {
        return;
      }

      map.value.setZoom(zoomLevel + 14);
    });

    watch(() => props.presentLocation, (presentLocation): void => {
      if (!map.value || !presentLocation) {
        presentMarker.value = null;
        accuracyCircle.value = null;

        return;
      }

      const { accuracy, latitude, longitude } = presentLocation;

      if (presentMarker.value) {
        presentMarker.value.setLatLng([latitude, longitude]);
      } else {
        presentMarker.value = window.L.marker([latitude, longitude]).addTo(map.value);
      }

      if (accuracyCircle.value) {
        accuracyCircle.value.setLatLng([latitude, longitude]);
        accuracyCircle.value.setRadius(accuracy);
      } else {
        accuracyCircle.value = window.L.circle([latitude, longitude], { radius: accuracy }).addTo(map.value);
      }
    }, {
      immediate: true,
    });

    watch(shelter, () => { flyToShelter(); }, { immediate: true });

    return {
      mapView,
      zoomLevel,
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
  position: relative;

  & > .map {
    width: 100%;
    height: 100%;
    -webkit-user-select: none;
    user-select: none;
  }

  & > .scalerange {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 400;
  }

  /* stylelint-disable rscss/no-descendant-combinator, rscss/class-format */
  ::v-deep(.shelter-marker) {
    $marker-size: 40px;

    position: absolute;

    & > .marker {
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      width: 30px;
      height: 30px;
      background-image: url(../assets/images/shelter-marker.png);
      background-size: contain;
      transform: translate(-50%, -50%);
    }
  }

  @for $i from 0 through 500 {
    & > .map[data-shelter-id="#{$i}"] ::v-deep(.shelter-marker) {
      &.-shelter-#{$i} {
        z-index: 791 !important;
      }

      & > .marker[data-id="#{$i}"] {
        width: 50px;
        height: 50px;
        background-image: url(../assets/images/shelter-marker-active.png);
      }
    }
  }
  /* stylelint-enable rscss/no-descendant-combinator, rscss/class-format */
}
</style>
