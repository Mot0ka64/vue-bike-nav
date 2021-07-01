import mapboxgl from "mapbox-gl";
import axios, {AxiosResponse} from "axios";

abstract class Search {
    abstract makePromise(query: string, location: mapboxgl.LngLat): Promise<AxiosResponse>
}

export class LocationSearch extends Search {
    makePromise(query: string): Promise<AxiosResponse> {
        const client = axios.create({
            baseURL: process.env.VERCEL_URL
        });
        return client.get("/api/search", {
            params: {
                query: query
            },
        });
    }
}

export class LocalSearch extends Search{
    makePromise(query: string, location: mapboxgl.LngLat): Promise<AxiosResponse> {
        const client = axios.create({
            baseURL: process.env.VERCEL_URL
        });
        return client.get("/api/search", {
            params: {
                lat: location.lat,
                lng: location.lng,
                query: query
            },
        });
    }
}

export interface SearchResult {
    name: string;
    lngLat: number[];
    address: string;
}