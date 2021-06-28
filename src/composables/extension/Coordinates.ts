const R = 6371.0;

export function distanceTo(from: number[], dest: number[]): number {
    const r = R * 1e3
    return r * angleTo(from, dest)
}

// Lng Lat
// Haversine formula
const angleTo = (from: number[], dest: number[]) => {
    const phi1 = from[1] * Math.PI / 180;
    const phi2 = dest[1] * Math.PI / 180;
    const dPhi = (dest[1] - from[1]) * Math.PI / 180;
    const dLambda = (dest[0] - from[0]) * Math.PI / 180;

    const a = Math.pow(Math.sin(dPhi / 2), 2) + Math.cos(phi1) * Math.cos(phi2) * Math.pow(Math.sin(dLambda / 2), 2);
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function lineDistance(from: number[], p1: number[], p2: number[]): number{
    const theta = angleTo(p1, p2);
    const gamma1 = angleTo(from, p1);
    const gamma2 = angleTo(from, p2);
    const s = (theta + gamma1 + gamma2) / 2;
    const h = Math.sqrt(s * (s-theta) * (s-gamma1) * (s-gamma2) * 2) / theta;

    return R * 1e3 * h;
}

export function bearing(from: number[], dest: number[]): number {
    const dx = (dest[0] - from[0]) * Math.cos(from[1] * Math.PI / 180);
    const dy = dest[1] - from[1];
    const theta = Math.atan2(dy, dx);
    return (theta < 0) ? theta + 2 * Math.PI : theta;
}