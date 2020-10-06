<template>
  <div
    v-if="isInitialized"
    class="page-view"
  >
    <MapView
      class="map"
      :shelters="shelters"
      :shelterId="shelterId"
      :presentLocation="presentLocation"
      @clickShelter="onClickShelter"
    />
    <MapNavbar
      class="navbar"
      @openMenu="openMenu"
    />
  </div>
  <MapShelter
    :shelters="shelters"
    :shelterId="shelterId"
  />
  <transition name="fade">
    <MapLoading v-if="!isInitialized" />
  </transition>
  <transition name="menu-fade">
    <div
      v-show="isMenuOpen"
      class="menu-foundation"
      @click.stop="closeMenu"
    />
  </transition>
  <transition name="menu-slide">
    <div
      v-show="isMenuOpen"
      class="map-menu"
    >
      <MapMenu
        class="menu"
        :shelters="shelters"
        :presentLocation="presentLocation"
        @close="closeMenu"
      />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MapView from '../components/MapView.vue';
import MapNavbar from '../components/MapNavbar.vue';
import MapLoading from '../components/MapLoading.vue';
import MapMenu from '../components/MapMenu.vue';
import MapShelter from '../components/MapShelter.vue';
import { PresentLocation, Shelter } from '../types';
import { url } from '../utils/url';

export default defineComponent({
  components: {
    MapView,
    MapNavbar,
    MapLoading,
    MapMenu,
    MapShelter,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isInitialized = ref(false);
    const shelters = ref<Shelter[]>([]);
    const presentLocation = ref<PresentLocation | null>(null);
    const isMenuOpen = computed((): boolean => route.path === url('MAP_MENU'));
    const shelterId = computed(() => {
      const { shelterId } = route.params;

      return typeof shelterId === 'string' ? +shelterId : null;
    });
    const shelter = computed(() => shelters.value.find((shelter) => shelter.id === shelterId.value));

    onMounted(async (): Promise<void> => {
      const { default: data } = await import('../assets/shelters.json');

      shelters.value = data.shelters;

      navigator.geolocation.watchPosition(
        (result) => {
          const { accuracy, latitude, longitude, heading } = result.coords;

          presentLocation.value = {
            accuracy,
            latitude,
            longitude,
            heading,
          };

          isInitialized.value = true;
        }, (error) => {
          console.error(error);

          presentLocation.value = null;

          isInitialized.value = true;
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        },
      );
    });

    const onClickShelter = async (id: number): Promise<void> => {
      await router.push(url('MAP_SHELTER', { shelterId: id }));
    }

    const backToMap = async (): Promise<void> => {
      await router.push(url('MAP'));
    }

    const openMenu = async (): Promise<void> => {
      await router.push(url('MAP_MENU'));
    };

    const closeMenu = async (): Promise<void> => {
      await router.replace(url('MAP'));
    };

    return {
      isInitialized,
      isMenuOpen,
      shelters,
      shelterId,
      shelter,
      presentLocation,
      onClickShelter,
      backToMap,
      openMenu,
      closeMenu,
    }
  }
});
</script>

<style lang="scss" scoped>
@import 'resources';

.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 0.3s 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.3s ease;

  & > .menu {
    transition: transform 0.3s ease;
  }
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;

  & > .menu {
    transform: translate3d(30px, 0, 0);
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.3s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.page-view {
  display: grid;
  grid-template:
    'map'    1fr
    'navbar' auto
    /1fr;
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);

  & > .map {
    grid-area: map;
    height: 100%;
  }

  & > .navbar {
    grid-area: navbar;
  }
}

.map-menu {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  width: 320px;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;
}

.menu-foundation {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background: rgba(#041122, 0.5);
}
</style>
