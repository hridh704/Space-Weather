
import React from 'react';
import type { SpaceWeatherData, SpaceForecast, ChartDataPoint } from '../types';

/**
 * Helper to get the three-letter abbreviation for the day of the week.
 * @param {Date} date - The date to get the day from.
 * @returns {string} The day abbreviation (e.g., "Mon").
 */
const getDayAbbreviation = (date: Date): string => {
    return date.toLocaleString('en-US', { weekday: 'short' });
};

/**
 * Converts a solar flare class string (e.g., "X1.9", "M5.5") to a numerical
 * value for easier comparison and charting.
 * @param {string} flareClass - The flare class string.
 * @returns {number} A numerical representation of the flare's intensity.
 */
const flareClassToNumber = (flareClass: string): number => {
    if (!flareClass) return 0;
    const classLetter = flareClass.charAt(0).toUpperCase();
    const classValue = parseFloat(flareClass.substring(1));
    switch (classLetter) {
        case 'X': return 50 + classValue; // e.g., X9.3 -> 59.3
        case 'M': return 40 + classValue; // e.g., M5.5 -> 45.5
        case 'C': return 30 + classValue;
        case 'B': return 20 + classValue;
        case 'A': return 10 + classValue;
        default: return 0;
    }
};

// --- Mock Data Generation ---

/**
 * Generates mock Space weather data.
 * @returns {SpaceWeatherData} A complete mock Space weather data object.
 */
const generateMockSpaceData = (): SpaceWeatherData => {
    const forecast: SpaceForecast[] = [];
    for (let i = 1; i <= 7; i++) {
        const day = new Date();
        day.setDate(day.getDate() + i);
        forecast.push({
            day: getDayAbbreviation(day),
            solarWindSpeed: Math.round(400 + Math.random() * 100),
            kpIndex: Math.floor(Math.random() * 5),
        });
    }

    const historicalKpIndex: ChartDataPoint[] = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return { time: getDayAbbreviation(d), value: Math.floor(Math.random() * 4) }
    });
    
    return {
        solarWindSpeed: 450,
        kpIndex: 3,
        cmeMaxSpeed: 1200,
        xrayFluxClass: 'M1.5',
        sepEvents: 1,
        forecast,
        historicalSolarWind: historicalKpIndex.map(kp => ({ time: kp.time, value: kp.value === null ? null : (400 + kp.value * 50 + (Math.random() - 0.5) * 50) })),
        historicalKpIndex: historicalKpIndex,
        historicalCmeSpeed: historicalKpIndex.map(d => ({ time: d.time, value: 800 + Math.random() * 400 })),
        historicalXrayFlux: historicalKpIndex.map(d => ({ time: d.time, value: flareClassToNumber('C' + (Math.random()*5).toFixed(1)) })),
        historicalSepEvents: historicalKpIndex.map(d => ({ time: d.time, value: Math.floor(Math.random() * 2) })),
    };
};


/**
 * Main data fetching function.
 * This version uses a mock data generator to ensure the app works without an API key.
 * @returns {Promise<SpaceWeatherData>} A promise that resolves to the mock weather data.
 */
export const fetchWeatherData = async (): Promise<SpaceWeatherData> => {
    // Simulate a network delay for a more realistic loading experience
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockSpaceData();
};