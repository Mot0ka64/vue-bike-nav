<template>
  <div class="home">
    <Mapbox @context-menu="onMapClick">
      <MapboxMarker v-if="lngLat" :lng-lat="lngLat" :text="markerText" @click="onLayerClick"/>
      <MapboxGeoJsonSource v-if="routeResults" :coordinates="coordinates" id="route" @click="onLayerClick"/>
      <MapboxGeolocation @located="onLocation" :track-user-location="true" :max-zoom="11"/>
    </Mapbox>
    <transition name="route-summary">
      <RouteSummary v-if="uiState === 'Summary'" :data="summaryData"/>
    </transition>
    <transition name="route-navigation">
      <RouteNavigation v-if="uiState === 'Navigation'" :data="navData"/>
    </transition>
    <FloatingActionButton color="teal" bottom="40px" @clicked="onFabClick" :uiState="uiState"/>
    <OverlayModal v-if="modalVisible" @close="onModalClose">
      <LocationSearch :location="location" @result="onSearchResult"/>
    </OverlayModal>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from "vue";
import Mapbox from "@/components/mapbox/Mapbox.vue";
import mapboxgl, {MapMouseEvent} from "mapbox-gl";
import MapboxMarker from "@/components/mapbox/MapboxMarker.vue";
import MapboxGeolocation from "@/components/mapbox/MapboxGeolocation.vue";
import MapboxGeoJsonSource from "@/components/mapbox/MapboxGeoJsonSource.vue";
import FloatingActionButton from "@/components/ui/FloatingActionButton.vue";
import RouteSummary from "@/components/RouteSummary.vue";
import fetchCycleRoute from "@/composables/CycleRoute";
import {RouteResults} from "osrm";
import {NavigationData, SummaryData, UiState} from "@/composables/UiType";
import RouteManager from "@/composables/RouteManager";
import RouteNavigation from "@/components/RouteNavigation.vue";
import OverlayModal from "@/components/ui/OverlayModal.vue";
import LocationSearch from "@/components/LocationSearch.vue";
import {SearchResult} from "@/composables/CompoundSearch";

export default defineComponent({
  components: {
    LocationSearch,
    OverlayModal,
    RouteNavigation,
    FloatingActionButton,
    MapboxGeoJsonSource,
    MapboxGeolocation,
    MapboxMarker,
    Mapbox,
    RouteSummary
  },
  setup() {
    const lngLat = ref<mapboxgl.LngLat | null>(null);
    const location = ref<mapboxgl.LngLat | null>(null);
    const routeResults = ref<RouteResults | null>(null);
    const routeIndex = ref(0);
    const markerText = ref("");
    const uiState = ref<UiState>("Search");
    const modalVisible = ref(false);

    const navData = ref<NavigationData>({
      description: "",
      remainingDistanceOnStep: 0.0,
      remainingDistance: 0.0,
      bearing: 0.0
    });

    let routeManager: RouteManager | null = null;

    const onMapClick = (e: MapMouseEvent) => {
      uiState.value = "Search";
      if (window.confirm(`[${e.lngLat.lng.toFixed(6)}, ${e.lngLat.lat.toFixed(6)}] に変更しますか？`)) {
        lngLat.value = e.lngLat;
        markerText.value = e.lngLat.toString();
      }
    }

    // eslint-disable-next-line no-undef
    const onLocation = (position: GeolocationPosition) => {
      location.value = new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude);
      if (uiState.value === "Navigation") {
        updateLocation();
        if (!routeManager || !routeManager.onNavigation) uiState.value = "Summary";
      }
    }

    const onFabClick = () => {
      switch (uiState.value) {
        case "Search":
          modalVisible.value = true;
          break;
        case "Summary":
          if (routeResults.value) routeManager = new RouteManager(routeResults.value.routes[routeIndex.value]);
          updateLocation();
          uiState.value = "Navigation";
          break;
        case "Navigation":
          uiState.value = "Summary";
          break;
      }
    }

    const onLayerClick = (bool: boolean) => {
      if (uiState.value === "Search" && bool) uiState.value = "Summary";
      if (uiState.value === "Summary" && (!bool)) uiState.value = "Search";
    }

    const onModalClose = () => {
      modalVisible.value = false;
    }

    const onSearchResult = (result: SearchResult) => {
      modalVisible.value = false;
      markerText.value = result.name;
      lngLat.value = new mapboxgl.LngLat(result.lngLat[0], result.lngLat[1]);
    }

    function updateLocation() {
      if (location.value) {
        routeManager?.updateLocation(location.value);
        navData.value = {
          description: routeManager?.nextDescription() ?? "",
          remainingDistance: routeManager?.remainingDistance() ?? 0.0,
          remainingDistanceOnStep: routeManager?.remainingDistanceOnStep() ?? 0.0,
          bearing: routeManager?.nextBearing() ?? 0.0
        }
      }
    }

    watch(lngLat, () => {
      if (lngLat.value && location.value) {
        fetchCycleRoute([location.value, lngLat.value], (route) => {
          if (route) {
            console.log(route);
            uiState.value = "Summary";
            routeResults.value = route;
          }
        });
      }
    });

    const route = computed(() => {
      return routeResults.value?.routes[routeIndex.value];
    });

    const summaryData = computed<SummaryData>(() => ({
      summary: route.value?.legs?.map(leg => leg.summary).join(",") ?? "",
      distance: route.value?.distance ?? 0
    }));

    const coordinates = computed(() => {
      if (route.value) return RouteManager.getAllWaypoints(route.value);
      else return [];
    });

    return {
      onMapClick, onLocation, onFabClick, onLayerClick, onModalClose, onSearchResult,
      lngLat, markerText, location, routeResults, uiState,
      summaryData, coordinates, navData,
      modalVisible,
    };
  }
})
</script>

<style>
html {
  height: 100%;
}

body {
  height: 100%;
}

#app {
  height: 100%;
}

.home {
  width: 100%;
  height: 100%;
}

.route-summary-enter-active,
.route-summary-leave-active,
.route-navigation-enter-active,
.route-navigation-leave-active {
  transition: all 0.5s ease;
}

.route-summary-enter-from,
.route-summary-leave-to,
.route-navigation-enter-from,
.route-navigation-leave-to {
  opacity: 0;
}
</style>
