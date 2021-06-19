<template>
  <div id="map"></div>
  <slot/>
</template>

<script lang="ts">
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css'

import {defineComponent, onMounted, provide, ref, SetupContext} from "vue";
import MapboxKey from "@/composables/MapboxKey";

export default defineComponent({
  name: 'Mapbox',
  props: {},
  emits:["map-click"],
  setup(props, context: SetupContext) {
    const map = ref<mapboxgl.Map | null>(null)
    const options: mapboxgl.MapboxOptions = {
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      container: "map",
      style: process.env.VUE_APP_MAPBOX_STYLE,
      center: new mapboxgl.LngLat(139.8, 35.75),
      zoom: 10
    }
    provide(MapboxKey, map)

    onMounted(() => {
      map.value = new mapboxgl.Map(options);
      map.value.on("click", (e) => {
        context.emit("map-click", e)
      });
    });
  },
})
;
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>