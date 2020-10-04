<template>
  <RouterView v-if="isMapInitialized" />
  <transition name="fade">
    <p v-show="!isMapInitialized">loading...</p>
  </transition>
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

      window.initMap = async (): Promise<void> => {
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

.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 0.2s 1s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
