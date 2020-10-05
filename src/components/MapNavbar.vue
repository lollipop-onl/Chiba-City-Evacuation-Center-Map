<template>
  <div class="map-navbar">
    <img
      class="logo"
      src="../assets/logo.svg"
      alt="千葉市避難所マップ"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MapNavbar',
  setup() {},
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
}
</style>
