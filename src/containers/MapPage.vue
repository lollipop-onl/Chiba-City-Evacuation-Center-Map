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
import { defineComponent, ref, computed, onMounted } from 'vue';
import MapView from '../components/MapView.vue';
import { Shelter } from '../types';
import { nonNullable } from '../utils/nonNullable';

export default defineComponent({
  name: 'MapPage',
  components: {
    MapView,
  },
  setup() {
    const shelters = ref<Shelter[]>([]);
    const shelterId = ref<number | null>(null);
    const shelter = computed(() => shelters.value.find((shelter) => shelter.id === shelterId.value));
    const nearbyShelters = computed(() => shelters.value
      .map((item) => {
        if (!shelter.value) {
          return;
        }

        const lat1 = shelter.value.latitude * Math.PI / 180;
        const lng1 = shelter.value.longitude * Math.PI / 180;
        const lat2 = item.latitude * Math.PI / 180;
        const lng2 = item.longitude * Math.PI / 180;
        const distance = 6371000 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));

        return {
          shelter: item,
          distance,
        };
      })
      .filter(nonNullable)
      .sort((item1, item2) => item1.distance > item2.distance ? 1 : -1)
    );

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
      shelter,
      nearbyShelters,
      onClickFacility,
      backToMap,
    }
  }
});
</script>

<style lang="scss" scoped>
@import 'resources';
</style>
