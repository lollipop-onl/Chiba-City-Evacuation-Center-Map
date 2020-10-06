<template>
  <div
    v-show="shelterId != null"
    class="map-shelter-card"
  >
    <template
      v-for="shelter in shelters"
      :key="shelter.id"
    >
      <div
        v-if="shelter.id === shelterId"
        class="shelter"
      >
        {{ shelter.name }}
        <br />
        〒{{ shelter.postalCode }} 千葉県{{ shelter.address }}
      </div>
    </template>
    <RouterLink to="/map">閉じる</RouterLink>
  </div>
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
  setup(props) {
    console.log(props.shelterId, props.shelters.find((shelter) => shelter.id === props.shelterId));
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-shelter-card {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 400px;
  height: calc(var(--vh, 1vh) * 100 - 64px);
  background: #f5f5f5;
  box-shadow:
    0 0 2.2px rgba(0, 0, 0, 0.034),
    0 0 5.3px rgba(0, 0, 0, 0.048),
    0 0 10px rgba(0, 0, 0, 0.06),
    0 0 17.9px rgba(0, 0, 0, 0.072),
    0 0 33.4px rgba(0, 0, 0, 0.086),
    0 0 80px rgba(0, 0, 0, 0.12);

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 180px);
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    box-shadow:
      0 1px 1.9px rgba(0, 0, 0, 0.025),
      0 2.5px 4.5px rgba(0, 0, 0, 0.036),
      0 4.6px 8.4px rgba(0, 0, 0, 0.045),
      0 8.3px 15px rgba(0, 0, 0, 0.054),
      0 15.5px 28px rgba(0, 0, 0, 0.065),
      0 37px 67px rgba(0, 0, 0, 0.09);
  }
}
</style>
