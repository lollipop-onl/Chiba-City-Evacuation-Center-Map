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
          <transition name="list">
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
              {{ shelter.name }}
              <br />
              〒{{ shelter.postalCode }} 千葉県{{ shelter.address }}
            </div>
          </transition>
        </template>
        <RouterLink
          class="close"
          to="/map"
        />
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
  background: #f5f5f5;

  @media (max-width: $breakpoint) {
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 180px);
  }

  & > .shelter {
    box-sizing: border-box;
    width: 400px;
    padding: 0 16px;

    @media (max-width: $breakpoint) {
      width: 100%;
    }
  }

  & > .shelter > .picture {
    width: calc(100% + 32px);
    height: 240px;
    margin-left: -16px;
  }

  & > .shelter > .picture.-no-image {
    display: grid;
    place-items: center;
    background: #ccc;
  }

  & > .close {
    position: absolute;
    top: 0;
    right: 0;
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 0 10px rgba(#252521, 0.8));
  }

  & > .close::before,
  & > .close::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 2px;
    content: '';
    background: #fff;
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

.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
