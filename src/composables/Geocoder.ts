export namespace Ydf {
    export interface Ydf {
        YDF: Ydf_Root
    }

    export interface Ydf_Root {
        $: Empty;
        ResultInfo: ResultInfo[];
        Feature: Feature[];
    }

    export interface Empty {
        xmlns: string;
        totalResultsReturned: string;
        totalResultsAvailable: string;
        firstResultPosition: string;
    }

    export interface Feature {
        Id: string[];
        Gid: string[];
        Name: string[];
        Geometry: Geometry[];
        Category: string[];
        Description: string[];
        Style: string[];
        Property: Property[];
    }

    export interface Geometry {
        Type: string[];
        Coordinates: string[];
    }

    export interface Property {
        Uid: string[];
        CassetteId: string[];
        Country: Country[];
        Address: string[];
        GovernmentCode: string[];
        AddressMatchingLevel: string[];
        LandmarkCode?: string[];
        Tel1: string[];
        Genre: Country[];
        Station?: Station[];
        SmartPhoneCouponFlag: string[];
        KeepCount?: string[];
        Access1?: string[];
        LeadImage?: string[];
        ParkingFlag?: string[];
        CouponFlag?: string[];
        Coupon?: Coupon[];
    }

    export interface Country {
        Code: string[];
        Name: string[];
    }

    export interface Coupon {
        PcUrl: string[];
        SmartPhoneUrl: string[];
    }

    export interface Station {
        Id: string[];
        SubId: string[];
        Name: string[];
        Railway: string[];
        Exit: string[];
        ExitId: string[];
        Distance: string[];
        Time: string[];
        Geometry: Geometry[];
    }

    export interface ResultInfo {
        Count: string[];
        Total: string[];
        Start: string[];
        Status: string[];
        Description: string[];
        Copyright: string[];
        Latency: string[];
    }
}

export interface OsmResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    place_rank: number;
    category: string;
    type: string;
    importance: number;
    icon?: string;
}

export namespace Gsi {
    export interface GsiResult {
        geometry: Geometry;
        type: string;
        properties: Properties;
    }

    export interface Geometry {
        coordinates: number[];
        type: string;
    }

    export interface Properties {
        addressCode: string;
        title: string;
    }
}
