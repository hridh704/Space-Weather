
import React from 'react';
import type { SpaceWeatherData, SpaceForecast, ChartDataPoint } from '../types';
import { NASA_API_KEY } from '../config';

/**
 * Helper to format a Date object into a YYYY-MM-DD string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
const getFormattedDate = (date: Date): string => date.toISOString().split('T')[0];

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
 * Generates mock Space weather data for fallback purposes.
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
    return {
        solarWindSpeed: 450,
        kpIndex: 3,
        cmeMaxSpeed: 1200,
        xrayFluxClass: 'M1.5',
        sepEvents: 1,
        forecast,
        historicalSolarWind: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: 420 + Math.random() * 50 })),
        historicalKpIndex: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: Math.floor(Math.random() * 4) })),
        historicalCmeSpeed: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: 800 + Math.random() * 400 })),
        historicalXrayFlux: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: flareClassToNumber('C' + (Math.random()*5).toFixed(1)) })),
        historicalSepEvents: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: Math.floor(Math.random() * 2) })),
    };
};


// --- NASA Space Weather (DONKI API) ---
/**
 * Fetches and processes Space weather data from NASA's DONKI API.
 * @returns {Promise<SpaceWeatherData>} A promise resolving to the processed Space weather data.
 */
const fetchNasaSpaceData = async (): Promise<SpaceWeatherData> => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 7);
    const formattedStartDate = getFormattedDate(startDate);
    const formattedEndDate = getFormattedDate(today);

    const apiKey = NASA_API_KEY;
    const cmeUrl = `https://api.nasa.gov/DONKI/CME?startDate=${formattedStartDate}&endDate=${formattedEndDate}&api_key=${apiKey}`;
    const gstUrl = `https://api.nasa.gov/DONKI/GST?startDate=${formattedStartDate}&endDate=${formattedEndDate}&api_key=${apiKey}`;
    const flrUrl = `https://api.nasa.gov/DONKI/FLR?startDate=${formattedStartDate}&endDate=${formattedEndDate}&api_key=${apiKey}`;
    const sepUrl = `https://api.nasa.gov/DONKI/SEP?startDate=${formattedStartDate}&endDate=${formattedEndDate}&api_key=${apiKey}`;

    const [cmeResponse, gstResponse, flrResponse, sepResponse] = await Promise.all([
        fetch(cmeUrl), 
        fetch(gstUrl),
        fetch(flrUrl),
        fetch(sepUrl),
    ]);
    if (!cmeResponse.ok || !gstResponse.ok || !flrResponse.ok || !sepResponse.ok) throw new Error('Failed to fetch NASA Space data.');
    const cmeData = await cmeResponse.json();
    const gstData = await gstResponse.json();
    const flrData = await flrResponse.json();
    const sepData = await sepResponse.json();

    if (!Array.isArray(cmeData) || !Array.isArray(gstData) || !Array.isArray(flrData) || !Array.isArray(sepData)) {
         throw new Error('Invalid Space data structure from NASA DONKI API.');
    }

    const dailyMaxCmeSpeed: { [key: string]: number } = {};
    cmeData.forEach((cme: any) => {
        const date = getFormattedDate(new Date(cme.startTime));
        const speed = cme.cmeAnalyses?.[0]?.speed || 0;
        if(speed > (dailyMaxCmeSpeed[date] || 0)) {
            dailyMaxCmeSpeed[date] = speed;
        }
    });

    const dailyMaxKp: { [key: string]: number } = {};
    gstData.forEach((gst: any) => {
        gst.allKpIndex.forEach((kpEntry: { observedTime: string; kpIndex: number }) => {
            const date = getFormattedDate(new Date(kpEntry.observedTime));
            dailyMaxKp[date] = Math.max(dailyMaxKp[date] || 0, kpEntry.kpIndex);
        });
    });

    const dailyMaxXray: { [key: string]: { class: string, value: number } } = {};
    flrData.forEach((flare: any) => {
        const date = getFormattedDate(new Date(flare.beginTime));
        const flareValue = flareClassToNumber(flare.classType);
        if (flareValue > (dailyMaxXray[date]?.value || 0)) {
            dailyMaxXray[date] = { class: flare.classType, value: flareValue };
        }
    });

    const dailySepCounts: { [key: string]: number } = {};
    sepData.forEach((sep: any) => {
        const date = getFormattedDate(new Date(sep.eventTime));
        dailySepCounts[date] = (dailySepCounts[date] || 0) + 1;
    });

    const historicalCmeSpeed: ChartDataPoint[] = [];
    const historicalKpIndex: ChartDataPoint[] = [];
    const historicalXrayFlux: ChartDataPoint[] = [];
    const historicalSepEvents: ChartDataPoint[] = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = getFormattedDate(d);
        const dayAbbr = getDayAbbreviation(d);
        historicalCmeSpeed.push({ time: dayAbbr, value: dailyMaxCmeSpeed[dateStr] || null });
        historicalKpIndex.push({ time: dayAbbr, value: dailyMaxKp[dateStr] ?? null });
        historicalXrayFlux.push({ time: dayAbbr, value: dailyMaxXray[dateStr]?.value || null });
        historicalSepEvents.push({ time: dayAbbr, value: dailySepCounts[dateStr] || 0 });
    }

    const latestKp = historicalKpIndex.slice(-1)[0]?.value ?? 0;
    const latestSolarWind = 400 + latestKp * 50 + (Math.random() - 0.5) * 50;
    
    let latestXrayClass = 'None';
    for (let i = historicalXrayFlux.length - 1; i >= 0; i--) {
        const dateStr = getFormattedDate(new Date(new Date().setDate(new Date().getDate() - (historicalXrayFlux.length - 1 - i))));
        if (dailyMaxXray[dateStr]) {
            latestXrayClass = dailyMaxXray[dateStr].class;
            break;
        }
    }


    const forecast: SpaceForecast[] = [];
    for (let i = 1; i <= 7; i++) {
        const day = new Date();
        day.setDate(day.getDate() + i);
        const kpVariation = (Math.random() - 0.5) * 2;
        let forecastedKp = Math.round(Math.max(0, latestKp + kpVariation));
        forecast.push({
            day: getDayAbbreviation(day),
            solarWindSpeed: Math.round(400 + forecastedKp * 50 + (Math.random() - 0.5) * 50),
            kpIndex: forecastedKp,
        });
    }

    return {
        solarWindSpeed: Math.round(latestSolarWind),
        kpIndex: latestKp,
        cmeMaxSpeed: Math.round(historicalCmeSpeed.slice(-1)[0]?.value ?? 0),
        xrayFluxClass: latestXrayClass,
        sepEvents: historicalSepEvents.slice(-1)[0]?.value ?? 0,
        forecast,
        historicalSolarWind: historicalKpIndex.map(kp => ({ time: kp.time, value: kp.value === null ? null : (400 + kp.value * 50 + (Math.random() - 0.5) * 50) })),
        historicalKpIndex,
        historicalCmeSpeed,
        historicalXrayFlux,
        historicalSepEvents,
    };
};

/**
 * Main data fetching function.
 * Fetches Space weather data from NASA APIs.
 * Falls back to mock data if the API calls fail.
 * @returns {Promise<SpaceWeatherData>} A promise that resolves to the combined weather data.
 */
export const fetchWeatherData = async (): Promise<SpaceWeatherData> => {
    try {
        const space = await fetchNasaSpaceData();
        return space;
    } catch (error) {
        console.error('Error fetching live space weather data:', error instanceof Error ? error.message : String(error));
        console.warn('Falling back to mock data.');
        return generateMockSpaceData();
    }
};