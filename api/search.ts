import {VercelRequest, VercelResponse} from '@vercel/node';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fetch from 'node-fetch';
import xml2js from 'xml2js';
import {OsmResult, Ydf, Gsi} from "@/composables/Geocoder";
import {SearchResult} from "@/composables/CompoundSearch";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (!req.query.query) {
        res.send("");
    } else if (req.query.lat && req.query.lng) {
        const {query, lng, lat} = req.query;
        if (typeof query === "string" && typeof lng === "string" && typeof lat === "string") {
            const result = await fetchYolp(query, [lng, lat]);
            res.send(JSON.stringify(result));
        }
    } else {
        const {query} = req.query;
        if (typeof query === "string") {
            const [yolp, osm, gsi] = await Promise.all([fetchYolp(query), fetchOsm(query), fetchGsi(query)]);
            res.send(JSON.stringify(gsi.concat(yolp, osm)));
        }
    }
}

async function fetchYolp(query: string, location?: string[]): Promise<SearchResult[]> {
    const params = new URLSearchParams(location ? {
        "appid": process.env.VUE_APP_YOLP_ID ?? "",
        "sort": "dist",
        "lon": location[0],
        "lat": location[1],
        "dist": "20",
        "query": query
    } : {
        "appid": process.env.VUE_APP_YOLP_ID ?? "",
        "sort": "match",
        "query": query
    });
    const url = "https://map.yahooapis.jp/search/local/V1/localSearch?" + params.toString();

    const xml = await fetch(url);
    const text = await xml.text();

    const parser = new xml2js.Parser();
    let list: SearchResult[] = [];
    parser.parseString(text, (err: unknown, ydf: Ydf.Ydf) => {
        if (err === null) {
            const features = ydf.YDF.Feature ?? []

            list = features.map(f => ({
                name: f.Name[0],
                lngLat: f.Geometry[0].Coordinates[0].split(",").map(s => Number(s)),
                address: f.Property[0].Address[0]
            }));
        }
    })
    return list;
}

async function fetchOsm(query: string): Promise<SearchResult[]> {
    const params = new URLSearchParams({
        "q": query,
        "format": "jsonv2",
        "countrycodes": "JP"
    });
    const url = "https://nominatim.openstreetmap.org/search.php?" + params.toString();
    const json = await fetch(url);
    const osmResults = await json.json() as OsmResult[];
    return osmResults.map(osm => ({
        name: osm.display_name,
        lngLat: [Number(osm.lon), Number(osm.lat)],
        address: ""
    }));
}

async function fetchGsi(query: string): Promise<SearchResult[]> {
    const params = new URLSearchParams({
        "q": query
    });
    const url = "https://msearch.gsi.go.jp/address-search/AddressSearch?" + params.toString();

    const json = await fetch(url);
    const gsiResult = await json.json() as Gsi.GsiResult[];
    return gsiResult.filter(r => r.properties.title.indexOf(query) != -1).map(r => ({
        name: r.properties.title,
        lngLat: r.geometry.coordinates,
        address: ""
    }))
}