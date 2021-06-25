<template>
  <div class="home">
    <Mapbox @map-click="onMapClick">
      <MapboxMarker v-if="lngLat" :lng-lat="lngLat" :text="text"/>
      <MapboxGeolocation @located="onLocation" :track-user-location="false" :max-zoom="11"/>
    </Mapbox>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import Mapbox from "@/components/mapbox/Mapbox.vue";
import mapboxgl, {MapMouseEvent} from "mapbox-gl";
import MapboxMarker from "@/components/mapbox/MapboxMarker.vue";
import MapboxGeolocation from "@/components/mapbox/MapboxGeolocation.vue";

export default defineComponent({
  components: {
    MapboxGeolocation,
    MapboxMarker,
    Mapbox
  },
  setup() {
    const lngLat = ref<mapboxgl.LngLat | null>(null);
    const location = ref<mapboxgl.LngLat | null>(null);
    const text = ref("");

    const onMapClick = (e: MapMouseEvent) => {
      if (window.confirm(`[${e.lngLat.lng.toFixed(6)}, ${e.lngLat.lat.toFixed(6)}] に変更しますか？`)) {
        lngLat.value = e.lngLat;
        text.value = e.lngLat.toString();
      }
    }

    // eslint-disable-next-line no-undef
    const onLocation = (position: GeolocationPosition) => {
      location.value = new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude)
    }

    return {onMapClick, onLocation, lngLat, text, location};
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
