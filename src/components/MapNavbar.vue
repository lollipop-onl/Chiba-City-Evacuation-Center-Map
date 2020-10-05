<template>
  <div class="map-navbar">
    <img
      class="logo"
      src="../assets/logo.svg"
      alt="千葉市避難所マップ"
    />
    <button
      class="menu"
      @click.stop="openMenu"
    >
      <span class="bars" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MapNavbar',
  emits: {
    openMenu: null,
  },
  setup(props, { emit }) {
    const openMenu = (): void => {
      emit('openMenu');
    };

    return {
      openMenu,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-navbar {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 0 16px;
  color: #fff;
  background: #041122;

  & > .logo {
    height: 24px;
  }

  & > .menu {
    position: relative;
    width: 64px;
    height: 64px;
    margin-left: auto;
    cursor: pointer;
    background: transparent;
    border: 0;
  }

  & > .menu > .bars {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 2px;
    background: #fff;
    border-radius: 1px;
    transform: translate(-50%, -50%);
  }

  & > .menu > .bars::before,
  & > .menu > .bars::after {
    position: absolute;
    left: 50%;
    width: 24px;
    height: 2px;
    content: '';
    background: #fff;
    border-radius: 1px;
    transition: width 0.12s ease, top 0.12s ease, bottom 0.12s ease;
    transform: translate(-50%, 0);
  }

  & > .menu > .bars::before {
    top: -8px;
  }

  & > .menu > .bars::after {
    bottom: -8px;
  }

  & > .menu:hover > .bars::before,
  & > .menu:hover > .bars::after {
    width: 32px;
  }

  & > .menu:hover > .bars::before {
    top: -10px;
  }

  & > .menu:hover > .bars::after {
    bottom: -10px;
  }
}
</style>
