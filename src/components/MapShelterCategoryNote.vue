<template>
  <MapShelterCollapse
    label="施設のカテゴリについて"
  >
    <ul class="map-shelter-category-note">
      <li class="item">
        <p class="note">
          <span class="title">指定緊急避難場所</span>：公園、学校の屋内運動場または校庭等、一時的に身の安全が確保できる施設又は場所
        </p>
      </li>
      <li class="item">
        <p class="note">
          <span class="title">指定避難所</span>：被災者の住宅に危険が予想される場合や住宅が損壊した場合等、生活の場が失われた場合に、一時的な生活の本拠地として宿泊滞在するための施設
        </p>
      </li>
      <li class="item">
        <p class="note">
          <span class="title">広域避難場所</span>：大規模な火災が発生したとき、輻射熱や煙などから身を守り、安全を確保する場所で相当程度のオープンスペースが確保された公園等の施設
        </p>
      </li>
      <li class="item">
        <p class="note">
          <span class="title">津波避難ビル</span>：津波災害発生時、高台への避難が間に合わない場合に緊急的に一時避難する施設
        </p>
      </li>
    </ul>
  </MapShelterCollapse>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MapShelterCollapse from './MapShelterCollapse.vue';

export default defineComponent({
  name: 'MapShelterCategoryNote',
  components: {
    MapShelterCollapse,
  },
});
</script>

<style lang="scss" scoped>
@import 'resources';

.map-shelter-category-note {
  & > .item:not(:last-child) {
    margin-bottom: 8px;
  }

  & > .item > .note > .title {
    font-weight: bold;
  }
}
</style>
