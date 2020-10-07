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
              <div class="categories">
                <div
                  class="tag"
                  :class="{ '-active': shelter.category.evacuationArea }"
                >
                  避難場所
                </div>
                <div
                  class="tag"
                  :class="{ '-active': shelter.category.shelter }"
                >
                  避難所
                </div>
                <div
                  class="tag"
                  :class="{ '-active': shelter.category.wideAreaShelter }"
                >
                  広域避難場所
                </div>
                <div
                  class="tag"
                  :class="{ '-active': shelter.category.earthquakeRefugeBuilding }"
                >
                  津波避難ビル
                </div>
              </div>
              <pre>{{ shelter }}</pre>
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
import { defineComponent, PropType } from 'vue';
import { Shelter } from '../types';

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
});
</script>

<style lang="scss" scoped>
@import 'resources';

$breakpoint: 600px;

@mixin separation {
  & {
    position: relative;
  }

  &::after {
    position: absolute;
    bottom: 0;
    left: -16px;
    display: block;
    width: calc(100% + 16px);
    height: 1px;
    content: '';
    background: #ccc;
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
    @include separation;

    padding-bottom: 16px;
    margin-bottom: 16px;
    font-size: 12px;
    line-height: 1.8;
    color: #555;
  }

  & > .shelter > .categories {
    display: flex;
    flex-wrap: wrap;
  }

  & > .shelter > .categories > .tag {
    padding: 4px 12px;
    margin: 0 8px 4px 0;
    color: #aaa;
    border: 2px solid #aaa;
    border-radius: 8px;
  }

  & > .shelter > .categories > .tag.-active {
    color: #fff;
    background: #041122;
    border-color: #041122;
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

