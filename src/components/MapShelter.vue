<template>
  <transition name="card">
    <div
      v-show="shelterId != null"
      class="map-shelter-wrapper"
    >
      <div
        ref="shelterView"
        class="card map-shelter-card"
      >
        <template
          v-for="shelter in shelters"
          :key="shelter.id"
        >
          <transition name="fade">
            <div
              v-if="shelter.id === shelterId"
              class="shelter"
            >
              <div class="picture -no-image">
                <img
                  src="../assets/no-image.svg"
                  alt="No Image"
                  height="32"
                />
              </div>
              <div class="name">{{ shelter.name }}</div>
              <div
                v-if="shelter.isBuildingIgnored || true"
                class="namenote"
              >
                ※建物を含まない
              </div>
              <div class="address">
                〒{{ shelter.postalCode }} {{ shelter.address }}
              </div>
              <div class="separator" />
              <div class="heading">施設の情報</div>
              <p class="categories">{{ categories }}</p>
              <MapShelterCollapse
                class="collapse"
                label="施設のカテゴリについて"
              >
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi eius asperiores optio ullam dolorum laboriosam nam harum. Iusto sequi aliquid nostrum odit laboriosam reiciendis voluptate quaerat veritatis eveniet, voluptas velit.</p>
              </MapShelterCollapse>
              <div class="separator -thin" />
              <MapShelterSupport
                class="support"
                :shelter="shelter"
              />
              <MapShelterCollapse
                class="collapse"
                label="アイコンについて"
              >
                <ul class="note-icon">
                  <li class="item">
                    <MapSupportIcon
                      :support="0"
                      class="icon"
                    />
                    <p class="note">避難不可</p>
                  </li>
                  <li class="item">
                    <MapSupportIcon
                      :support="1"
                      class="icon"
                    />
                    <p class="note">避難可</p>
                  </li>
                  <li class="item">
                    <MapSupportIcon
                      :support="3"
                      class="icon"
                    />
                    <p class="note">高潮・津波発生時、３階以上への避難で避難可</p>
                  </li>
                  <li class="item">
                    <MapSupportIcon
                      :support="4"
                      class="icon"
                    />
                    <p class="note">当該災害による避難を想定しない</p>
                  </li>
                </ul>
              </MapShelterCollapse>
              <div class="separator -thin" />
              <pre>{{ shelter }}</pre>
              <div class="separator" />
              <div class="heading">付近の避難所</div>
              <ol class="nearby-shelter">
                <li
                  v-for="nearbyShelter in nearbyShelters"
                  :key="nearbyShelter.shelter.id"
                  class="item"
                >
                  <button
                    class="section clickable-section"
                    @click.stop="changeShelter(nearbyShelter.shelter.id)"
                  >
                    <span class="main">{{ nearbyShelter.shelter.name }}</span>
                    <span class="sub">{{ formatNumber(nearbyShelter.distance) }}m</span>
                  </button>
                </li>
              </ol>
              <template v-if="distanceFromPresentLocation != null">
                <div class="separator" />
                <div class="heading">現在地からの距離</div>
                <div class="distance">{{ formatNumber(distanceFromPresentLocation) }}m</div>
              </template>
              <div class="separator" />
              <div class="heading">Googleマップで開く</div>
              <a
                v-if="googleMapsUrl"
                :href="googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="clickable-section"
              >
                <span class="main">{{ shelter.name }}</span>
                <span class="sub">{{ shelter.latitude }},{{ shelter.longitude }}</span>
              </a>
              <div class="separator" />
            </div>
          </transition>
        </template>
        <div class="map-shelter-card-header">
          <template
            v-for="shelter in shelters"
            :key="shelter.id"
          >
            <transition name="fade">
              <div
                v-if="shelter.id === shelterId"
                class="title"
              >
                {{ shelter.name }}
              </div>
            </transition>
          </template>
          <RouterLink
            class="close"
            to="/map"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, PropType } from 'vue';
import urlJoin from 'url-join';
import MapShelterSupport from './MapShelterSupport.vue';
import MapShelterCollapse from './MapShelterCollapse.vue';
import MapSupportIcon from './MapSupportIcon.vue';
import { PresentLocation, Shelter } from '../types';
import { formatNumber } from '../utils/formatNumber';
import { getDistanceFromLatLng } from '../utils/getDistanceFromLatLng';
import { nonNullable } from '../utils/nonNullable';

export default defineComponent({
  name: 'MapShelter',
  components: {
    MapShelterSupport,
    MapShelterCollapse,
    MapSupportIcon,
  },
  props: {
    /** 避難所情報 */
    shelters: {
      type: Array as PropType<Shelter[]>,
      required: true,
    },
    /** 選択している避難所 */
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
    changeShelter: (shelterId: number) => !Number.isNaN(shelterId),
  },
  setup(props, { emit }) {
    const shelterView = ref<HTMLDivElement>();
    const shelter = computed(() => props.shelters.find((shelter) => shelter.id === props.shelterId));
    const nearbyShelters = computed(() => {
      return props.shelters
        .map((targetShelter) => shelter.value ? ({
          distance: getDistanceFromLatLng(
            [shelter.value.latitude, shelter.value.longitude],
            [targetShelter.latitude, targetShelter.longitude]
          ),
          shelter: targetShelter,
        }) : null)
        .filter(nonNullable)
        .filter(({ distance }) => distance > 0)
        .sort((a, b) => a.distance > b.distance ? 1 : -1)
        .slice(0, 5);
    });
    const distanceFromPresentLocation = computed((): number | null =>
      props.presentLocation && shelter.value
        ? getDistanceFromLatLng(
            [props.presentLocation.latitude, props.presentLocation.longitude],
            [shelter.value.latitude, shelter.value.longitude]
          )
        : null
    );
    const googleMapsUrl = computed((): string | null => shelter.value
      ? urlJoin('https://www.google.co.jp/maps', `@${shelter.value.latitude},${shelter.value.longitude},19z`)
      : null
    );
    const categories = computed((): string => {
      if (!shelter.value) {
        return '';
      }

      const { category } = shelter.value;

      return [
        category.evacuationArea && '指定緊急避難場所',
        category.shelter && '指定避難所',
        category.wideAreaShelter && '広域避難場所',
        category.tsunamiRefugeBuilding && '地震避難ビル',
      ]
        .filter((category): category is string => typeof category === 'string')
        .join('・');
    });

    const changeShelter = (shelterId: number) => {
      emit('changeShelter', shelterId);
    };

    watch(shelter, () => {
      if (!shelterView.value) {
        return;
      }

      shelterView.value.scrollTo(0, 0);
    });

    return {
      shelterView,
      nearbyShelters,
      distanceFromPresentLocation,
      googleMapsUrl,
      categories,
      changeShelter,
      formatNumber,
    };
  }
});
</script>

<style lang="scss" scoped>
@import 'resources';

$breakpoint: 600px;

.clickable-section {
  & {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: calc(100% + 32px);
    padding: 16px 32px 16px 16px;
    margin-left: -16px;
    color: #252521;
    text-align: left;
    text-decoration: none;
    background: transparent;
    border: 0;
  }

  &::before {
    $size: 10px;

    position: absolute;
    top: 50%;
    right: 18px;
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    content: '';
    border-top: 2px solid #ccc;
    border-right: 2px solid #ccc;
    transform: rotate(45deg) translate(-$size / 1.41421356 / 2, -$size / 1.41421356 / 2);
  }

  & > .main {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    line-height: 1.5;
  }

  & > .sub {
    display: block;
    font-size: 12px;
    color: #595959;
  }
}

.map-shelter-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 400px;
  height: calc(var(--vh, 1vh) * 100 - 64px);
  overflow: hidden;
  box-shadow:
    0 0 2.2px rgba(0, 0, 0, 0.034),
    0 0 5.3px rgba(0, 0, 0, 0.048),
    0 0 10px rgba(0, 0, 0, 0.06),
    0 0 17.9px rgba(0, 0, 0, 0.072),
    0 0 33.4px rgba(0, 0, 0, 0.086),
    0 0 80px rgba(0, 0, 0, 0.12);

  @media (max-width: $breakpoint) {
    top: auto;
    bottom: 0;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 180px);
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    box-shadow:
      0 0 2.2px rgba(0, 0, 0, 0.034),
      0 0 5.3px rgba(0, 0, 0, 0.048),
      0 0 10px rgba(0, 0, 0, 0.06),
      0 0 17.9px rgba(0, 0, 0, 0.072),
      0 0 33.4px rgba(0, 0, 0, 0.086),
      0 0 80px rgba(0, 0, 0, 0.12);
  }
}

.map-shelter-card {
  width: 400px;
  height: calc(var(--vh, 1vh) * 100 - 64px);
  overflow-x: hidden;
  overflow-y: scroll;
  background: #f5f5f5;

  @media (max-width: $breakpoint) {
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 180px);
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    margin-top: 64px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(#041122, 0.2);
    border-radius: 2px;
  }

  & > .shelter {
    box-sizing: border-box;
    width: 400px;
    padding: 64px 16px 0 16px;

    @media (max-width: $breakpoint) {
      width: 100%;
    }
  }

  & > .shelter > .separator {
    display: block;
    width: calc(100% + 16px);
    height: 1px;
    margin: 16px 0 16px -16px;
    content: '';
    background: #ccc;
  }

  & > .shelter > .separator.-thin {
    width: 100%;
    margin: 8px 0;
  }

  & > .shelter > .heading {
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.5;
    color: #595959;
  }

  & > .shelter > .picture {
    width: calc(100% + 32px);
    height: 160px;
    margin: 0 0 32px -16px;
  }

  & > .shelter > .picture.-no-image {
    display: grid;
    place-items: center;
    background: #ccc;
  }

  & > .shelter > .name {
    margin-bottom: 8px;
    font-size: 20px;
    line-height: 1.8;
  }

  & > .shelter > .namenote {
    margin: -8px 0 8px;
    font-size: 12px;
    line-height: 1.5;
    color: #041122;
  }

  & > .shelter > .address {
    font-size: 12px;
    line-height: 1.8;
    color: #555;
  }

  & > .shelter > .distance {
    font-size: 14px;
    line-height: 1.5;
    color: #041122;
  }

  & > .shelter > .collapse {
    margin: 8px 0;
  }

  & > .shelter > .support {
    margin-top: 8px;
  }

  & > .shelter > .categories {
    margin: 16px 0 8px;
    font-size: 16px;
    color: #252521;
  }
}

.map-shelter-card-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: #f5f5f5;

  & > .title {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 64px);
    height: 64px;
    padding-left: 16px;
    overflow: hidden;
    font-size: 14px;
    line-height: 64px;
    color: #595959;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > .close {
    position: absolute;
    top: 0;
    right: 0;
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    margin-left: auto;
  }

  & > .close::before,
  & > .close::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 2px;
    content: '';
    background: #595959;
    border-radius: 2px;
    transition: width 0.12s ease;
    transform: translate(-50%, -50%);
  }

  & > .close::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  & > .close::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  & > .close:hover::before,
  & > .close:hover::after {
    width: 32px;
  }
}

.note-icon {
  & > .item {
    display: flex;
    margin-bottom: 8px;
  }

  & > .item > .icon {
    flex-shrink: 0;
  }

  & > .item > .note {
    margin-left: 2em;
    line-height: 18px;
    color: #595959;
    text-indent: -2em;
  }

  & > .item > .note::before {
    padding: 0 0.5em;
    content: '...';
  }
}

.nearby-shelter {
  & > .item:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

