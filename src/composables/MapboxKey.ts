import {InjectionKey, Ref} from "vue";
import mapboxgl from "mapbox-gl";

const MapboxKey: InjectionKey<Ref<mapboxgl.Map | null>> = Symbol("MapboxMap");
export default MapboxKey;