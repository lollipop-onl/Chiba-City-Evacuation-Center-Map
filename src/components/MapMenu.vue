<template>
  <div class="map-menu">
    メニュー
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { url } from '../utils/url';

export default defineComponent({
  name: 'MapMenu',
  setup() {
    return {
      url,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-menu {
  width: 320px;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background: #041122;
  box-shadow:
    0 0 5.3px rgba(0, 0, 0, 0.028),
    0 0 17.9px rgba(0, 0, 0, 0.042),
    0 0 80px rgba(0, 0, 0, 0.07);
}
</style>
