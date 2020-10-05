<template>
  <RouterView v-if="isMapInitialized" />
  <transition name="fade">
    <div
      v-show="!isMapInitialized"
      class="loading-screen"
    >
      <div class="text">千葉市避難所マップ</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { debounce } from 'throttle-debounce';
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const isMapInitialized = ref(true);
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
  height: 100%;
  background: #e5e5e5;

  & > .text {
    font-size: 18px;
    color: #aaa;
  }
}
</style>
