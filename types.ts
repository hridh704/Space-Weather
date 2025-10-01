import type React from 'react';

/**
 * Represents a single day's forecast for Space weather.
 */
export interface SpaceForecast {
  day: string;
  solarWindSpeed: number;
  kpIndex: number;
}

/**
 * Represents the complete Space weather data object.
 */
export interface SpaceWeatherData {
  solarWindSpeed: number;
  kpIndex: number;
  cmeMaxSpeed: number;
  xrayFluxClass: string;
  sepEvents: number;
  forecast: SpaceForecast[];
  historicalSolarWind: ChartDataPoint[];
  historicalKpIndex: ChartDataPoint[];
  historicalCmeSpeed: ChartDataPoint[];
  historicalXrayFlux: ChartDataPoint[];
  historicalSepEvents: ChartDataPoint[];
}

/**
 * Represents a single data point for use in charts.
 * The value can be null to represent gaps in data.
 */
export interface ChartDataPoint {
  time: string;
  value: number | null;
}