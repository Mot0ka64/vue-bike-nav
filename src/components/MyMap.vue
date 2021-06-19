<template>
  <div id="map"></div>
</template>

<script lang="ts">
import mapboxgl, {LngLat, MapboxOptions} from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css'

import {defineComponent, onMounted, reactive} from "vue";

export default defineComponent({
  name: 'MyMap',
  props: {},
  setup(props, context) {
    const options: MapboxOptions = {
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      container: "map",
      style: process.env.VUE_APP_MAPBOX_STYLE,
      center: new LngLat(139.8, 35.75),
      zoom: 10
    }

    onMounted(() => {
      const map = new mapboxgl.Map(options);
    });
  },
});
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 99%;
}
</style>