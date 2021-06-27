<script lang="ts">
import {defineComponent, h, onMounted, onBeforeUnmount, inject, watch, PropType} from "vue";
import mapboxgl from "mapbox-gl";
import MapboxKey from "@/composables/MapboxKey";

export default defineComponent({
  props: {
    lngLat: {
      type: mapboxgl.LngLat as PropType<mapboxgl.LngLat>,
      required: true
    },
    text: {
      type: String as PropType<string>,
      default: ""
    }
  },
  emits: ["click"],
  setup(props, context) {
    const createMarker = (lngLat: mapboxgl.LngLat, text: string, offset = 20) => {
      const popup = new mapboxgl.Popup({offset: offset}).setText(text);
      const marker = new mapboxgl.Marker().setLngLat(lngLat).setPopup(popup);
      marker.getElement().addEventListener('click', function (e) {
        e.stopPropagation();
        marker.togglePopup();
        context.emit("click", marker.getPopup().isOpen());
      });
      return marker;
    }
    let marker = createMarker(props.lngLat, props.text);
    const map = inject(MapboxKey);

    watch(() => props.lngLat, (newVal) => {
      marker.remove();
      marker = createMarker(newVal, props.text);
      if (map && map.value) marker.addTo(map.value);
    });

    onMounted(() => {
      if (map && map.value) marker.addTo(map.value);
    });

    onBeforeUnmount(() => {
      marker.remove();
    })

    return () => h("div", {
      style: {
        display: "none"
      }
    });
  },
});
</script>