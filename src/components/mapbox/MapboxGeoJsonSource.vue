<script lang="ts">
import {defineComponent, h, inject, onBeforeUnmount, onMounted, PropType, watch} from "vue";
import MapboxKey from "@/composables/MapboxKey";
import mapboxgl from "mapbox-gl";

export default defineComponent({
  props: {
    id: {
      type: String as PropType<string>,
      required: true
    },
    coordinates: {
      type: Array as PropType<Array<Array<number>>>,
      required: true
    }
  },
  emits: ["click"],
  setup(props, context) {
    const map = inject(MapboxKey);

    const attachGeoJson = (map: mapboxgl.Map, coordinates: Array<Array<number>>, id: string) => {
      detachGeoJson(map, id)
      map.addSource(id, {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': coordinates
          }
        }
      });
      map.addLayer({
        'id': id,
        'type': 'line',
        'source': id,
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': 'blue',
          'line-width': 4
        }
      });
      map.on("click", id, () => {
        context.emit("click", true)
      })
    }

    const detachGeoJson = (map: mapboxgl.Map, id: string) => {
      if (map.getLayer(id)) {
        map.removeLayer(id)
        map.removeSource(id)
      }
    }

    watch(() => props.coordinates, () => {
      if (map) {
        if (map.value) {
          attachGeoJson(map.value, props.coordinates, props.id)
        }
      }
    });


    onMounted(() => {
      if (map?.value) attachGeoJson(map.value, props.coordinates, props.id);
    })

    onBeforeUnmount(() => {
      if (map?.value) detachGeoJson(map.value, props.id);
    });

    return () => h("div", {
      style: {
        display: "none"
      }
    });
  }
});
</script>
