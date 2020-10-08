<template>
  <MapShelterCollapse
    label="アイコンについて"
  >
    <ul class="map-support-icon-note">
      <li class="item">
        <MapSupportIcon
          :support="0"
          class="icon"
        />
        <p class="note">避難不可</p>
      </li>
      <li class="item">
        <MapSupportIcon
          :support="1"
          class="icon"
        />
        <p class="note">避難可</p>
      </li>
      <li class="item">
        <MapSupportIcon
          :support="3"
          class="icon"
        />
        <p class="note">高潮・津波発生時、３階以上への避難で避難可</p>
      </li>
      <li class="item">
        <MapSupportIcon
          :support="4"
          class="icon"
        />
        <p class="note">当該災害による避難を想定しない</p>
      </li>
    </ul>
  </MapShelterCollapse>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MapShelterCollapse from './MapShelterCollapse.vue';
import MapSupportIcon from './MapSupportIcon.vue';

export default defineComponent({
  name: 'MapSupportIconNote',
  components: {
    MapShelterCollapse,
    MapSupportIcon,
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-support-icon-note {
  & > .item {
    display: flex;
    margin-bottom: 4px;
  }

  & > .item > .icon {
    flex-shrink: 0;
  }

  & > .item > .note {
    margin-left: 2em;
    line-height: 18px;
    color: #595959;
    text-indent: -2em;
  }

  & > .item > .note::before {
    padding: 0 0.5em;
    content: '...';
  }
}
</style>
