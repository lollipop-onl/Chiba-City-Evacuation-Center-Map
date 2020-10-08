<template>
  <ul class="map-shelter-supports">
    <li
      class="item"
      :class="getIconVariant(support.flood)"
    >
      <MapSupportIcon
        class="icon"
        :support="support.flood"
      />
      <span class="label">洪水</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.sedimentDisaster)"
    >
      <MapSupportIcon
        class="icon"
        :support="support.sedimentDisaster"
      />
      <span class="label">土砂災害</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.stormSurge)"
    >
      <MapSupportIcon
        class="icon"
        :support="support.stormSurge"
      />
      <span class="label">高潮</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.earthquake)"
    >
      <MapSupportIcon
        class="icon"
        :support="support.earthquake"
      />
      <span class="label">地震</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.tsunami)"
    >
      <MapSupportIcon
        class="icon"
        :support="support.tsunami"
      />
      <span class="label">津波</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.largeScaleFire)"
    >
      <MapSupportIcon
        class="icon"
        :support="support.largeScaleFire"
      />
      <span class="label">大規模な火事</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.internalWaterFlood)"
    >
      <MapSupportIcon
        class="icon"
        :support="support.internalWaterFlood"
      />
      <span class="label">内水氾濫</span>
    </li>
    <li
      class="item"
      :class="getIconVariant(support.volcano)"
    >
      <MapSupportIcon
        class="icon"
        :support="support.volcano"
      />
      <span class="label">火山現象</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import MapSupportIcon from './MapSupportIcon.vue';
import { Shelter } from '../types';

export default defineComponent({
  name: 'MapShelterSupport',
  components: {
    MapSupportIcon,
  },
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
    margin-right: 4px;
  }
}
</style>
