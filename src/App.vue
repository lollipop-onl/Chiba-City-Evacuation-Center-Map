<template>
  <RouterView v-if="isMapInitialized" />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { debounce } from 'throttle-debounce';

export default defineComponent({
  name: 'App',
  setup() {
    const setBaseVh = debounce(100, (): void => {
      const vh = window.innerHeight * 0.01;
      const { documentElement } = document;

      if (documentElement instanceof HTMLElement) {
        documentElement.style.setProperty('--vh', `${vh}px`);
      }
    });

    onMounted(() => {
      window.addEventListener('resize', setBaseVh);
      setBaseVh();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', setBaseVh);
    });
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 0.2s 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  width: 100%;

  background: #e5e5e5;

  & > .text {
    font-size: 18px;
    color: #aaa;
  }
}
</style>
