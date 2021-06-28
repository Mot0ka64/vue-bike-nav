import {Route} from "osrm";
import {LngLat} from "mapbox-gl";
import StepManager from "@/composables/StepManager";
import {sum} from "@/composables/extension/NumberArray";

export default class RouteManager {
    constructor(private readonly route: Route) {
        this.steps = this.route.legs.flatMap(leg => leg.steps).map(step => new StepManager(step));
    }

    private readonly steps: StepManager[];
    private stepIndex = 0;
    private _remainingDistanceOnStep = 0.0;
    private _bearing = 0.0;
    private location: number[] = [0, 0];

    private currentStep = () => this.steps[this.stepIndex];
    private nextStep = () => {
        if (this.stepIndex != this.steps.length - 1 && this.steps[this.stepIndex + 1].step.distance > 0.0) {
            return this.steps[this.stepIndex + 1];
        } else {
            return null;
        }
    }

    private isOnCurrentStep = () => {
        const next = this.nextStep();
        if (next == null) return true;
        else {
            const c = this.currentStep().minD2To(this.location);
            const n = next.minD2To(this.location);
            return c < n;
        }
    }

    onNavigation = true;

    remainingDistanceOnStep = (): number => this._remainingDistanceOnStep;
    bearing = (): number => this._bearing;

    summary(): string {
        return this.route.legs.flatMap(leg => leg.summary).join(";");
    }

    distance(): number {
        return this.route.distance;
    }

    nextBearing = (): number | null => {
        const m = this.nextStep()?.step.maneuver
        if (m != null) {
            return m.bearing_after - m.bearing_before;
        } else {
            return null;
        }
    }
    remainingDistance = (): number => {
        let distance = this._remainingDistanceOnStep;
        if (this.stepIndex != this.steps.length - 1) {
            const array = this.steps.slice(this.stepIndex)
                .map(step => step.step.distance);
            distance += sum(array);
        }
        return distance;
    }
    nextDescription = (): string => this.nextStep()?.step?.name ?? "目的地";

    updateLocation(location: LngLat): boolean {
        this.location = [location.lng, location.lat];

        //last step
        if (this.stepIndex == this.steps.length - 2 && this.currentStep().isStepEnd(this.location)) {
            this.onNavigation = false;
            this._remainingDistanceOnStep = 0.0;
            return true;
        }

        if (!this.isOnCurrentStep()) {
            this.stepIndex += 1;
        } else {
            if (this.currentStep().minDistanceTo(this.location) > 25.0) {
                return false
            }
        }
        this._bearing = this.currentStep().currentBearing(this.location);
        this._remainingDistanceOnStep = this.currentStep().remainingDistanceFrom(this.location);
        return true;
    }

    static getAllWaypoints(route: Route): number[][] {
        let points: number[][] = [];
        if (route) {
            points = points.concat(route.legs.flatMap(leg => leg.steps).flatMap(step => {
                if (typeof step.geometry != "string") {
                    return step.geometry.coordinates;
                } else {
                    return [];
                }
            }));
        }
        return points;
    }
}

