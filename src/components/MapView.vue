<template>
  <div class="map-view">
    <div
      ref="mapView"
      class="map"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, PropType, computed } from 'vue';
import sheltersData from '../assets/shelters.json';
import { AVAILABLE_COORDINATE_RANGE } from '../const';
import { nonNullable } from '../utils/nonNullable';
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

          const { name, latitude, longitude } = shelter;

          return window.L
            .marker([latitude, longitude], {
              title: name,
              alt: `${latitude},${longitude}`,
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
          shelter.value.longitude - ((windowWidth - 400) / 2) * 0.000005405,
        ]
        : [
          shelter.value.latitude,
          shelter.value.longitude - 0.001,
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
