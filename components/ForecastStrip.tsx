import React from 'react';
import type { SpaceForecast } from '../types';

/**
 * Props for the ForecastStrip component.
 */
interface ForecastStripProps {
    /** An array of Space forecast data for the next 7 days. */
    spaceForecast: SpaceForecast[];
}

/**
 * A horizontally scrollable component that displays a 7-day forecast.
 * Each card in the strip shows a summary of Space weather.
 * @param {ForecastStripProps} props - The component props.
 * @returns {React.ReactElement} The rendered forecast strip.
 */
const ForecastStrip: React.FC<ForecastStripProps> = ({ spaceForecast }) => {
    return (
        <div className="mb-8">
            <h3 className="text-2xl font-bold font-orbitron mb-4 text-center">7-Day Space Forecast</h3>
            <div className="flex overflow-x-auto space-x-4 p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {spaceForecast.map((spaceDay, index) => {
                    return (
                        <div key={index} className="flex-shrink-0 w-48 bg-black/30 backdrop-blur-md rounded-xl p-4 border border-gray-700 text-center transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/30">
                            <h4 className="font-bold text-xl mb-3">{spaceDay.day}</h4>
                            <div className="space-y-2">
                                <div className="text-center">
                                    <span className="text-orange-400 text-sm font-semibold">Space Weather</span>
                                    <div className="flex flex-col items-center mt-1 text-base">
                                      <p>Wind: {spaceDay.solarWindSpeed} km/s</p>
                                      <p>Kp: {spaceDay.kpIndex}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ForecastStrip;
