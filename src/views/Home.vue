<template>
  <div class="home">
    <Mapbox @map-click="onMapClick">
      <MapboxMarker v-if="lngLat" :lng-lat="lngLat" :text="markerText"/>
      <MapboxGeoJsonSource v-if="routeResults" :coordinates="coordinates" id="route"/>
      <MapboxGeolocation @located="onLocation" :track-user-location="false" :max-zoom="11"/>
    </Mapbox>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from "vue";
import Mapbox from "@/components/mapbox/Mapbox.vue";
import mapboxgl, {MapMouseEvent} from "mapbox-gl";
import MapboxMarker from "@/components/mapbox/MapboxMarker.vue";
import MapboxGeolocation from "@/components/mapbox/MapboxGeolocation.vue";
import fetchCycleRoute from "@/composables/CycleRoute"
import {RouteResults} from "osrm";
import MapboxGeoJsonSource from "@/components/mapbox/MapboxGeoJsonSource.vue";

export default defineComponent({
  components: {
    MapboxGeoJsonSource,
    MapboxGeolocation,
    MapboxMarker,
    Mapbox
  },
  setup() {
    const lngLat = ref<mapboxgl.LngLat | null>(null);
    const location = ref<mapboxgl.LngLat | null>(null);
    const routeResults = ref<RouteResults | null>(null);
    const routeIndex = ref(0);
    const markerText = ref("");

    const onMapClick = (e: MapMouseEvent) => {
      if (window.confirm(`[${e.lngLat.lng.toFixed(6)}, ${e.lngLat.lat.toFixed(6)}] に変更しますか？`)) {
        lngLat.value = e.lngLat;
        markerText.value = e.lngLat.toString();
      }
    }

    // eslint-disable-next-line no-undef
    const onLocation = (position: GeolocationPosition) => {
      location.value = new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude)
    }

    watch(lngLat, () => {
      if (lngLat.value && location.value) {
        fetchCycleRoute([location.value, lngLat.value], (route) => {
          if (route) {
            console.log(route);
            routeResults.value = route
          }
        });
      }
    });

    const route = computed(() => {
      return routeResults.value?.routes[routeIndex.value];
    })

    const coordinates = computed(() => {
      let points: number[][] = []
      if (route.value) {
        points = points.concat(route.value.legs.flatMap(leg => leg.steps).flatMap(step => {
          if (typeof step.geometry != "string") {
            return step.geometry.coordinates;
          } else {
            return [];
          }
        }));
      }
      return points
    });

    return {onMapClick, onLocation, lngLat, markerText, location, routeResults, coordinates};
  }
})
</script>

<style>
.home {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
