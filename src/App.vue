<template>
  <template v-if="isMapInitialized">
    <RouterView />
  </template>
  <template v-else>
    <p>loading...</p>
  </template>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { loadMapsAPI } from './utils/loadMapsAPI';

export default defineComponent({
  name: 'App',
  setup() {
    const isMapInitialized = ref(false);

    onMounted(() => {
      if ('google' in window && 'maps' in window.google) {
        return;
      }

      window.initMap = () => {
        isMapInitialized.value = true;
      };

      loadMapsAPI('initMap');
    });

    return {
      isMapInitialized,
    }
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';
</style>
