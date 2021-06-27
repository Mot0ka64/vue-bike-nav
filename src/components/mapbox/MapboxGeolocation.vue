<script lang="ts">
import {defineComponent, h, onMounted, onBeforeUnmount, inject, PropType, watch} from "vue";
import MapboxKey from "@/composables/MapboxKey";
import mapboxgl from "mapbox-gl";

export default defineComponent({
  props: {
    trackUserLocation: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    enableHighAccuracy: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    showUserLocation: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    showAccuracyCircle: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    maxZoom: {
      type: Number as PropType<number>,
      default: 15
    }
  },
  emits: ["located"],
  setup(props, context) {
    const map = inject(MapboxKey);
    // console.log(props)
    const geolocate = new mapboxgl.GeolocateControl({
      fitBoundsOptions: {
        maxZoom: props.maxZoom
      },
      positionOptions: {
        enableHighAccuracy: props.enableHighAccuracy
      },
      showAccuracyCircle: props.showAccuracyCircle,
      showUserLocation: props.showUserLocation,
      trackUserLocation: props.trackUserLocation
    });

    geolocate.on("geolocate", (position) => {
      context.emit("located", position);
    })

    if (map) {
      watch(map, () => {
        map.value?.on("load", () => {
          geolocate.trigger();
        })
        if (map.value?.hasControl(geolocate)) map.value.removeControl(geolocate);
        map.value?.addControl(geolocate);
      });
    }

    onMounted(() => {
      map?.value?.addControl(geolocate);
    });

    onBeforeUnmount(() => {
      map?.value?.removeControl(geolocate);
    });

    return () => h("div", {
      style: {
        display: "none"
      }
    });
  }
})
;
</script>