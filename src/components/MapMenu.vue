<template>
  <div class="map-menu">
    <ul class="menu map-menu-list">
      <li class="item">
        <RouterLink
          class="link"
          :to="url('MAP_NEARBY')"
        >
          <img
            src="../assets/icons/map-pin-alt.svg"
            alt=""
          />
          <span class="label">現在地周辺の避難所</span>
        </RouterLink>
      </li>
    </ul>
    <button
      class="close"
      @click.stop="closeMenu"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { url } from '../utils/url';

export default defineComponent({
  name: 'MapMenu',
  emits: {
    close: null,
  },
  setup(props, { emit }) {
    const closeMenu = () => {
      emit('close');
    };

    return {
      closeMenu,
      url,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-menu {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 320px;
  max-width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  padding: 24px 16px;
  color: #fff;
  background: #041122;

  & > .menu {
    flex-grow: 1;
    overflow-y: auto;
  }

  & > .menu::-webkit-scrollbar {
    width: 5px;
  }

  & > .menu::-webkit-scrollbar-track {
    margin: 8px 0 64px 0;
    background: #041122;
  }

  & > .menu::-webkit-scrollbar-thumb {
    background: rgba(#fff, 0.2);
    border-radius: 2px;
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
