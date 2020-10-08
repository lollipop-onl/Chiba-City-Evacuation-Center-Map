<template>
  <ul class="map-shelter-supports">
    <li
      class="item"
      :class="getIconVariant(support.flood)"
    >
      <span class="icon">
        <span class="pseudo1" />
        <span class="pseudo2" />
      </span>
      <span class="label">洪水</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.sedimentDisaster)"
    >
      <span class="icon">
        <span class="pseudo1" />
        <span class="pseudo2" />
      </span>
      <span class="label">土砂災害</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.stormSurge)"
    >
      <span class="icon">
        <span class="pseudo1" />
        <span class="pseudo2" />
      </span>
      <span class="label">高潮</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.earthquake)"
    >
      <span class="icon">
        <span class="presdo1" />
        <span class="presdo2" />
      </span>
      <span class="label">地震</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.tsunami)"
    >
      <span class="icon">
        <span class="pseudo1" />
        <span class="pseudo2" />
      </span>
      <span class="label">津波</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.largeScaleFire)"
    >
      <span class="icon">
        <span class="pseudo1" />
        <span class="pseudo2" />
      </span>
      <span class="label">大規模な火事</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.internalWaterFlood)"
    >
      <span class="icon">
        <span class="pseudo1" />
        <span class="pseudo2" />
      </span>
      <span class="label">内水氾濫</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.volcano)"
    >
      <span class="icon">
        <span class="pseudo1" />
        <span class="pseudo2" />
      </span>
      <span class="label">火山現象</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { Shelter } from '../types';

export default defineComponent({
  name: 'MapShelterSupport',
  props: {
    /** 避難所情報 */
    shelter: {
      type: Object as PropType<Shelter>,
      required: true,
    },
  },
  setup(props) {
    const support = computed(() => props.shelter.support);

    const getIconVariant = (supportType: number): string => {
      switch (supportType) {
        case 0: return '-ng';
        case 1: return '-ok';
        case 2: return '-ok';
        case 3: return '-upto3';
        default: return '-unsupported';
      }
    };

    return {
      support,
      getIconVariant,
    };
  }
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-shelter-supports {
  display: flex;
  flex-wrap: wrap;
  margin-top: -8px;

  & > .item {
    display: flex;
    align-items: center;
    margin-top: 8px;
    font-size: 14px;
    color: #252521;
  }

  & > .item:not(:last-child)::after {
    content: '・';
  }

  & > .item > .icon {
    position: relative;
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }

  & > .item.-ok > .icon::before {
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

  & > .item.-ng > .label {
    color: #595959;
    text-decoration: line-through;
  }

  & > .item.-ng > .icon::before,
  & > .item.-ng > .icon::after {
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

  & > .item.-ng > .icon::before {
    transform: rotate(45deg) translate(-50%, -50%);
  }

  & > .item.-ng > .icon::after {
    transform: rotate(-45deg) translate(-50%, -50%);
  }

  & > .item.-upto3 > .icon > .pseudo1 {
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

  & > .item.-upto3 > .icon > .pseudo1::before {
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

  & > .item.-upto3 > .icon > .pseudo2 {
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

  & > .item.-upto3 > .icon > .pseudo2::before {
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

  & > .item.-unsupported > .label {
    color: #595959;
    text-decoration: line-through;
  }

  & > .item.-unsupported > .icon::before {
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
