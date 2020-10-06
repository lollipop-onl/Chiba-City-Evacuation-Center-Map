<template>
  <div class="map-scale-range">
    scale ranges {{ value }}
    <button @click="value = 0">Reset zoom level</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'MapScaleRange',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
  },
  emits: {
    'update:modelValue': (value: number) => !Number.isNaN(value),
  },
  setup(props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    return {
      value,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';
</style>
