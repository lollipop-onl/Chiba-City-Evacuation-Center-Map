<template>
  <transition name="card">
    <div
      v-show="shelterId != null"
      class="map-shelter-wrapper"
    >
      <div class="card map-shelter-card">
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
                〒{{ shelter.postalCode }} 千葉県{{ shelter.address }}
              </div>
              <div class="separator" />
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
                    class="button"
                    @click.stop="changeShelter(nearbyShelter.shelter.id)"
                  >
                    <span class="name">{{ nearbyShelter.shelter.name }}</span>
                    <span class="distance">{{ Math.round(nearbyShelter.distance) }}m</span>
                  </button>
                </li>
              </ol>
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
import { defineComponent, computed, PropType } from 'vue';
import { Shelter } from '../types';
import { getDistanceFromLatLng } from '../utils/getDistanceFromLatLng';
import { nonNullable } from '../utils/nonNullable';

export default defineComponent({
  name: 'MapShelter',
  props: {
    shelters: {
      type: Array as PropType<Shelter[]>,
      required: true,
    },
    shelterId: {
      type: Number as PropType<number | null>,
      default: null,
    }
  },
  emits: {
    changeShelter: (shelterId: number) => !Number.isNaN(shelterId),
  },
  setup(props, { emit }) {
    const shelter = computed(() => props.shelters.find((shelter) => shelter.id === props.shelterId));
    const nearbyShelters = computed(() => {
      return props.shelters
        .map((targetShelter) => shelter.value ? ({
          distance: getDistanceFromLatLng([shelter.value.latitude, shelter.value.longitude], [targetShelter.latitude, targetShelter.longitude]),
          shelter: targetShelter,
        }) : null)
        .filter(nonNullable)
        .sort((a, b) => a.distance > b.distance ? 1 : -1)
        .slice(1, 6);
    });

    const changeShelter = (shelterId: number) => {
      emit('changeShelter', shelterId);
    };

    return {
      nearbyShelters,
      changeShelter,
    };
  }
});
</script>

<style lang="scss" scoped>
@import 'resources';

$breakpoint: 600px;

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

.nearby-shelter {
  width: calc(100% + 32px);
  margin-left: -16px;

  & > .item:not(:first-child)::before {
    display: block;
    width: calc(100% - 32px);
    height: 1px;
    margin: 0 auto;
    content: '';
    background: #ccc;
  }

  & > .item > .button {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 16px 32px 16px 16px;
    text-align: left;
    background: transparent;
    border: 0;
  }

  & > .item > .button::before {
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

  & > .item > .button > .name {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    line-height: 1.5;
  }

  & > .item > .button > .distance {
    display: block;
    font-size: 12px;
    color: #595959;
  }
}

.card-enter-active,
.card-leave-active {
  transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease;

  & > .card {
    transition: transform 0.3s ease;
  }
}

.card-enter-from,
.card-leave-to {
  width: 370px;
  opacity: 0;

  @media (max-width: $breakpoint) {
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 210px);
  }

  & > .card {
    transform: translate3d(-30px, 0, 0);

    @media (max-width: $breakpoint) {
      transform: none;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

