<template>
  <div class="map-loading">
    <div class="logo">
      <img
        class="image -main"
        src="../assets/logo.svg"
        alt="千葉市避難所マップ"
      />
      <img
        class="image -sub"
        src="../assets/logo-sub.svg"
        alt="Chiba Shelter Map"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MapLoading',
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1001;
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #21d4fd;
  background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);

  & > .logo {
    filter: drop-shadow(0 2px 5px rgba(#000, 0.5));
  }

  & > .logo > .image {
    display: block;
    opacity: 0.5;
  }

  & > .logo > .image.-main {
    width: 240px;
    margin: 0 auto 16px;
  }

  & > .logo > .image.-sub {
    width: 130px;
    margin: 0 auto;
  }
}
</style>
