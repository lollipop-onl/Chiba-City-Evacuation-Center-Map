<template>
  <div>application.</div>
  <RouterLink to="/map">goto Map</RouterLink>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'LandingPage',
  setup() {
    // do nothing.

    onMounted(() => {
      console.log('page mounted');
    });
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';
</style>
