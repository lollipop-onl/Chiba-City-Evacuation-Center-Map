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
import { nonNullable } from '../utils/nonNullable';
import { Shelter, MapPosition } from '../types';

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
    const map = ref<L.Map>();
    const markers = ref<L.Marker[]>([]);
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

    /** ライフサイクルフック */
    onMounted(async (): Promise<void> => {
      if (!mapView.value) {
        return;
      }

      const tileLayer = window.L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      });

      map.value = window.L.map(mapView.value, {
        center: [35.607272, 140.106500],
        zoom: 17,
        maxZoom: 18,
        minZoom: 14,
        maxBounds: [
          [35.716883, 140.017721],
          [35.488466, 140.308555],
        ],
        layers: [tileLayer],
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

      if (shelter) {
        const center = map.value.getCenter();

        centerPosition.value = {
          latitude: center.lat,
          longitude: center.lng,
          zoom: map.value.getZoom(),
        }

        const { latitude, longitude } = shelter;

        map.value.dragging.disable();
        map.value.touchZoom.disable();
        map.value.doubleClickZoom.disable();
        map.value.scrollWheelZoom.disable();

        map.value.flyTo(new window.L.LatLng(latitude, longitude), 18, { animate: false });
      } else if (centerPosition.value) {
        const { latitude, longitude, zoom } = centerPosition.value;

        centerPosition.value = null;

        map.value.flyTo(new window.L.LatLng(latitude, longitude), zoom, { animate: false });

        map.value.dragging.enable();
        map.value.touchZoom.enable();
        map.value.doubleClickZoom.enable();
        map.value.scrollWheelZoom.enable();
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
    height: 100%;
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
      background: #FF005B;
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
      border: 2px dashed #FF005B;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    &.-active > .marker {
      width: 50px;
      height: 50px;
      font-size: 2em;
      color: #FF005B;
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
