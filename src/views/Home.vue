<template>
  <div class="home">
    <Mapbox @map-click="onMapClick">
      <MapboxMarker v-if="lngLat" :lng-lat="lngLat" :text="text"/>
    </Mapbox>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import Mapbox from "@/components/mapbox/Mapbox.vue";
import mapboxgl, {MapMouseEvent} from "mapbox-gl";
import MapboxMarker from "@/components/mapbox/MapboxMarker.vue";

export default defineComponent({
  components: {
    MapboxMarker,
    Mapbox
  },
  setup() {
    let lngLat = ref<mapboxgl.LngLat | null>(null);
    let text = ref("");
    const onMapClick = (e: MapMouseEvent) => {
      if (window.confirm(`[${e.lngLat.lng.toFixed(6)}, ${e.lngLat.lat.toFixed(6)}] に変更しますか？`)) {
        lngLat.value = e.lngLat;
        text.value = e.lngLat.toString();
      }
    }

    return {onMapClick, lngLat, text};
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
