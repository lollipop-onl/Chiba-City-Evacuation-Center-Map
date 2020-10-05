<template>
  <div class="map-menu">
    <div class="menu">
      <b>現在地付近の避難所</b>
      <div
        v-for="({ distance, shelter }) in nearbySheltersFromPresentLocation"
        :key="shelter.id"
      >
        <p>{{ shelter.name }}<br />{{ distance }}m</p>
        <RouterLink :to="url('MAP_SHELTER', { shelterId: shelter.id })">施設を表示</RouterLink>
        <hr />
      </div>
      <br />
    </div>
    <button
      class="close"
      @click.stop="closeMenu"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { PresentLocation, Shelter } from '../types';
import { checkCoordinateAvailability } from '../utils/checkCoordinateAvailability';
import { getDistanceFromLatLng } from '../utils/getDistanceFromLatLng';
import { nonNullable } from '../utils/nonNullable';
import { url } from '../utils/url';

type ShelterWithDistance = {
  distance: number;
  shelter: Shelter;
};

export default defineComponent({
  name: 'MapMenu',
  props: {
    /** 避難所一覧 */
    shelters: {
      type: Array as PropType<Shelter[]>,
      required: true,
    },
    /** ユーザーの現在位置 */
    presentLocation: {
      type: Object as PropType<PresentLocation | null>,
      default: null,
    },
  },
  emits: {
    close: null,
  },
  setup(props, { emit }) {
    const nearbySheltersFromPresentLocation = computed((): ShelterWithDistance[] => {
      return props.shelters
        .map((shelter) => props.presentLocation ? ({
          distance: getDistanceFromLatLng([shelter.latitude, shelter.longitude], [props.presentLocation.latitude, props.presentLocation.longitude]),
          shelter,
        }) : null)
        .filter(nonNullable)
        .sort((a, b) => a > b ? 1 : -1);
    });

    console.log(nearbySheltersFromPresentLocation.value);

    const closeMenu = () => {
      emit('close');
    };

    return {
      nearbySheltersFromPresentLocation,
      closeMenu,
      url,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-menu {
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  color: #fff;
  background: #041122;
  box-shadow:
    0 0 5.3px rgba(0, 0, 0, 0.028),
    0 0 17.9px rgba(0, 0, 0, 0.042),
    0 0 80px rgba(0, 0, 0, 0.07);

  & > .menu {
    flex-grow: 1;
    overflow-y: auto;
  }

  & > .close {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 64px;
    height: 64px;
    margin-left: auto;
    cursor: pointer;
    background: #041122;
    border: 0;
  }

  & > .close::before,
  & > .close::after {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 24px;
    height: 2px;
    content: '';
    background: #fff;
    border-radius: 1px;
    transition: width 0.2s ease;
  }

  & > .close::before {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  & > .close::after {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  & > .close:hover::before,
  & > .close:hover::after {
    width: 32px;
  }
}
</style>
