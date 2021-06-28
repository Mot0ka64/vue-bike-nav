import {RouteStep} from "osrm";
import {distanceTo, bearing, lineDistance} from "@/composables/extension/Coordinates"
import {sum} from "@/composables/extension/NumberArray";

export default class StepManager {
    constructor(readonly step: RouteStep) {
        this.coordinates = [];
        if (typeof step.geometry != "string") {
            this.coordinates = step.geometry.coordinates;
        }
        this.dd = [...new Array(this.coordinates.length - 1).keys()].map(i =>
            distanceTo(this.coordinates[i], this.coordinates[i + 1])
        );
    }

    private readonly coordinates: number[][];
    private readonly dd: number[];

    private minDistance2AndIndex(point: number[]): [number, number] {
        let index = 0;
        let min = 1e8;
        const distances = this.coordinates.map(from => distanceTo(from, point));

        for (let i = 0; i < this.coordinates.length - 1; i++) {
            const d2 = distances[i] + distances[i + 1];
            if (d2 < min) {
                min = d2;
                index = i;
            }
        }

        return [min, index];
    }

    currentBearing = (point: number[]): number => {
        const [, index] = this.minDistance2AndIndex(point);
        return bearing(this.coordinates[index], this.coordinates[index + 1]);
    }
    minD2To = (point: number[]): number => {
        const [distance,] = this.minDistance2AndIndex(point);
        return distance
    }
    minDistanceTo = (point: number[]): number => {
        const [, index] = this.minDistance2AndIndex(point);
        return lineDistance(point, this.coordinates[index], this.coordinates[index + 1]);
    }
    remainingDistanceFrom = (point: number[]): number => {
        const [, index] = this.minDistance2AndIndex(point);
        const dRem = distanceTo(point, this.coordinates[index + 1]);
        return dRem + sum(this.dd.slice(index + 1));
    }
    isStepEnd = (point: number[]): boolean => {
        const [, index] = this.minDistance2AndIndex(point);
        const lastIdx = this.coordinates.length - 1;
        if (index == lastIdx - 1) {
            return distanceTo(this.coordinates[lastIdx - 1], point) > distanceTo(this.coordinates[lastIdx], point);
        } else {
            return false;
        }
    }
}