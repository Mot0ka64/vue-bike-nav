<template>
  <div id="map"></div>
  <slot/>
</template>

<script lang="ts">
import mapboxgl, {CameraOptions, LngLat} from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css'

import {defineComponent, onMounted, PropType, provide, ref, SetupContext, watch} from "vue";
import MapboxKey from "@/composables/MapboxKey";

export default defineComponent({
  name: 'Mapbox',
  props: {
    camera: {
      type: Object as PropType<CameraOptions>,
      required: true
    }
  },
  emits: ["click", "context-menu"],
  setup(props, context: SetupContext) {
    const map = ref<mapboxgl.Map | null>(null)

    const options: mapboxgl.MapboxOptions = {
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      container: "map",
      style: process.env.VUE_APP_MAPBOX_STYLE,
      ...props.camera
    }
    provide(MapboxKey, map);

    onMounted(() => {
      map.value = new mapboxgl.Map(options);
      map.value.on("click", async (e) => {
        const features = map.value?.queryRenderedFeatures(e.point)
        if (features && (features.length == 0 || features.every(f => (f.source == "road" || f.source == "composite")))) {
          context.emit("click", e);
        }
      });
      map.value.on("contextmenu", (e) => {
        context.emit("context-menu", e);
      });
    });

    watch(() => props.camera, () => {
      if (map.value) {
        const zoom = map.value.getZoom();
        const bearing = props.camera.bearing ?? 0.0;
        const z = Math.pow(2.0, zoom);
        const offset = 60
        const center = props.camera.center as mapboxgl.LngLat

        map.value.easeTo({
          bearing: bearing,
          center: new LngLat(
              center.lng + offset * Math.sin(bearing / 180.0 * Math.PI) / z / Math.cos(center.lat / 180 * Math.PI),
              center.lat + offset * Math.cos(bearing / 180.0 * Math.PI) / z
          )
        });
      }
    })
  },
})
;
</script>

<style scoped>
#map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>