export type UiState = "Search" | "Summary" | "Navigation";

export interface NavigationData {
    description: string,
    remainingDistanceOnStep: number,
    remainingDistance: number,
    bearing: number
}

export interface SummaryData {
    summary: string,
    distance: number
}