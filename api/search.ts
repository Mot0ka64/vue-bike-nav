import {VercelRequest, VercelResponse} from '@vercel/node'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fetch from 'node-fetch'
import xml2js from 'xml2js'

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    const {query, lng, lat} = req.query;
    if (typeof query === "string" && typeof lng === "string" && typeof lat === "string") {
        const params = new URLSearchParams({
            "appid": process.env.VUE_APP_YOLP_ID ?? "",
            "sort": "dist",
            "lat": lat,
            "lon": lng,
            "dist": "20",
            "query": query
        });
        const url = "https://map.yahooapis.jp/search/local/V1/localSearch?" + params.toString();

        const xml = await fetch(url)
        const text = await xml.text()

        const parser = new xml2js.Parser()
        parser.parseString(text, (err: unknown, result: unknown) => {
            if (err === null) {
                res.send(JSON.stringify(result));
            }
        })
    }
}