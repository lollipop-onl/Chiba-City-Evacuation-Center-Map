<template>
  <span
    class="map-support-icon"
    :class="iconVariant"
    :style="wrapperStyle"
  >
    <span
      class="icon"
      :style="iconStyle"
    >
      <span class="pseudo1" />
      <span class="pseudo2" />
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'MapSupportIcon',
  props: {
    support: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      default: 18,
    },
  },
  setup(props) {
    const iconVariant = computed(() => {
      switch (props.support) {
        case 0: return '-ng';
        case 1: return '-ok';
        case 2: return '-ok';
        case 3: return '-upto3';
        default: return '-unsupported';
      }
    });
    const wrapperStyle = computed(() => {
      return {
        width: `${props.size}px`,
        height: `${props.size}px`,
      };
    });
    const iconStyle = computed(() => {
      return {
        transformOrigin: 'top left',
        transform: `scale(${props.size / 18})`,
      };
    });

    return {
      wrapperStyle,
      iconStyle,
      iconVariant,
    }
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-support-icon {
  display: block;

  & > .icon {
    position: relative;
    display: block;
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }

  &.-ok > .icon::before {
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    display: block;
    width: 6px;
    height: 12px;
    content: '';
    border-right: 2px solid green;
    border-bottom: 2px solid green;
    transform: rotate(45deg) translate(-7px, -3px);
  }

  &.-ng > .label {
    color: #595959;
    text-decoration: line-through;
  }

  &.-ng > .icon::before,
  &.-ng > .icon::after {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 14px;
    height: 2px;
    content: '';
    background: red;
    border-radius: 2px;
    transform-origin: center center;
    transform-origin: top left;
  }

  &.-ng > .icon::before {
    transform: rotate(45deg) translate(-50%, -50%);
  }

  &.-ng > .icon::after {
    transform: rotate(-45deg) translate(-50%, -50%);
  }

  &.-upto3 > .icon > .pseudo1 {
    position: absolute;
    top: 50%;
    right: 2px;
    box-sizing: border-box;
    display: block;
    width: 7px;
    height: 12px;
    border-top: 2px solid blue;
    border-right: 2px solid blue;
    border-bottom: 2px solid blue;
    transform: translateY(-50%);
  }

  &.-upto3 > .icon > .pseudo1::before {
    position: absolute;
    top: 50%;
    left: 0;
    display: block;
    width: 6px;
    height: 2px;
    content: '';
    background: blue;
    transform: translateY(-50%);
  }

  &.-upto3 > .icon > .pseudo2 {
    position: absolute;
    top: 50%;
    left: 4px;
    display: block;
    width: 2px;
    height: 12px;
    background: blue;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    transform: translateY(-50%);
  }

  &.-upto3 > .icon > .pseudo2::before {
    position: absolute;
    top: 0;
    left: 50%;
    box-sizing: border-box;
    display: block;
    width: 6px;
    height: 6px;
    content: '';
    border-top: 2px solid blue;
    border-left: 2px solid blue;
    transform: rotate(45deg) translate(-1.4px, 3px);
  }

  &.-unsupported > .label {
    color: #595959;
    text-decoration: line-through;
  }

  &.-unsupported > .icon::before {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 12px;
    height: 2px;
    content: '';
    background: #595959;
    transform: translate(-50%, -50%);
  }
}
</style>
