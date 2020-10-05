<template>
  <MapView />
  <RouterLink to="/map/facility/123">To facility</RouterLink>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MapView from '../components/MapView.vue';

export default defineComponent({
  name: 'MapPage',
  components: {
    MapView,
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';
</style>
