import {Route, Waypoint} from "osrm";
import {LngLat} from "mapbox-gl";
import axios, {AxiosPromise} from "axios";

export interface CycleRoute {
    code: string;
    waypoints: Waypoint[];
    routes: Route[];
}

function fetchCycleRoute(lls: LngLat[], callback: (route: CycleRoute | null) => void): void {
    if (lls.length < 2) callback(null);
    const client = axios.create({
        baseURL: "https://cyc-route.com/route/",
    });
    const query = lls.map((ll) => `${ll.lng.toFixed(5)},${ll.lat.toFixed(5)}`).join(";")
    const fetchRoute = (): AxiosPromise<CycleRoute> => client.get(query, {
        params: {
            overview: false,
            alternatives: true,
            steps: true,
            geometries: "geojson"
        }
    });
    fetchRoute().then((data) => {
        callback(data.data)
    });
}

export default fetchCycleRoute