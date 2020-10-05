<template>
  <MapView
    :shelters="shelters"
    :shelterId="shelterId"
    @clickFacility="onClickFacility"
  />
  <template v-if="shelterId != null">
    <button @click.stop="backToMap">マップへ戻る</button>
  </template>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import MapView from '../components/MapView.vue';
import { Shelter } from '../types';

export default defineComponent({
  name: 'MapPage',
  components: {
    MapView,
  },
  setup() {
    const shelters = ref<Shelter[]>([]);
    const shelterId = ref<number | null>(null);

    onMounted(async (): Promise<void> => {
      const { default: data } = await import('../assets/shelters.json');

      shelters.value = data.shelters;
    });

    const onClickFacility = (id: number): void => {
      if (shelterId.value != null) {
        return;
      }

      shelterId.value = id;
    }

    const backToMap = (): void => {
      shelterId.value = null;
    }

    return {
      shelters,
      shelterId,
      onClickFacility,
      backToMap,
    }
  }
});
</script>

<style lang="scss" scoped>
@import 'resources';
</style>
