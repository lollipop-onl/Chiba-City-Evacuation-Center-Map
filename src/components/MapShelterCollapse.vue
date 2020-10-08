<template>
  <div class="map-shelter-collapse">
    <button
      class="button"
      :class="{ '-open': isOpen }"
      @click.stop="toggleCollapse"
    >
      {{ label }}<span class="icon" />
    </button>
    <div
      v-show="isOpen"
      class="main"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MapShelterCollapse',
  props: {
    label: {
      type: String,
      required: true,
    }
  },
  setup() {
    const isOpen = ref(false);

    const toggleCollapse = () => {
      isOpen.value = !isOpen.value;
    };

    return {
      isOpen,
      toggleCollapse,
    }
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-shelter-collapse {
  & > .button {
    padding: 0;
    font-size: 14px;
    line-height: 1.8;
    text-decoration: underline;
    cursor: pointer;
    background: transparent;
    border: 0;
  }

  & > .button:hover {
    text-decoration: none;
  }

  & > .button > .icon {
    position: relative;
    top: 2px;
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-left: 4px;
  }

  & > .button > .icon::before {
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    display: block;
    width: 8px;
    height: 8px;
    content: '';
    border-right: 2px solid #595959;
    border-bottom: 2px solid #595959;
    transform: rotate(-45deg) translate(0, -6px);
  }

  & > .button.-open > .icon {
    transform: rotate(90deg) translate(-3px, 0);
  }

  & > .main {
    margin-top: 4px;
  }
}
</style>
