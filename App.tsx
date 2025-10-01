import React, { useState, useEffect } from 'react';
import type { SpaceWeatherData } from './types';
import { fetchWeatherData } from './services/weatherService';
import WeatherCard from './components/WeatherCard';
import ForecastStrip from './components/ForecastStrip';
import UnifiedChart from './components/UnifiedChart';
import ImpactSection from './components/ImpactSection';
import AnimatedBackground from './components/AnimatedBackground';
import { WindIcon, GaugeIcon, SunIcon, XRayIcon, ProtonIcon } from './components/icons';

/**
 * The main component for the Cosmic Forecast application.
 * It handles data fetching, loading and error states, and renders the main UI layout.
 * @returns {React.ReactElement} The rendered application component.
 */
const App: React.FC = () => {
    const [weatherData, setWeatherData] = useState<SpaceWeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchWeatherData();
                setWeatherData(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch cosmic data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    /**
     * A loading spinner component displayed while data is being fetched.
     */
    const LoadingSpinner = () => (
      <div role="status" className="flex flex-col items-center justify-center h-screen text-[#EAEAEA]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF6B00]"></div>
        <p className="mt-4 text-xl font-orbitron">Initializing Cosmic Link...</p>
      </div>
    );

    /**
     * A component to display an error message if data fetching fails.
     * @param {object} props - The component props.
     * @param {string} props.message - The error message to display.
     */
    const ErrorDisplay = ({ message }: { message: string }) => (
      <div className="flex items-center justify-center h-screen text-center text-red-400">
        <p className="text-xl">{message}</p>
      </div>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !weatherData) {
        return <ErrorDisplay message={error || "An unknown error occurred."} />;
    }

    return (
        <div className="relative min-h-screen bg-[#0D0D0D] text-[#EAEAEA] overflow-hidden">
            <AnimatedBackground />
            <main className="relative z-10 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    {/* You can personalize your app by changing the name in the title below! */}
                    <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FFD700]">
                        Cosmic Forecast
                    </h1>
                    <p className="text-lg text-gray-400 mt-2">Your daily link to Space weather.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    <WeatherCard
                        title="Solar Wind"
                        value={weatherData.solarWindSpeed}
                        unit="km/s"
                        icon={WindIcon}
                        description="A stream of charged particles released from the Sun's upper atmosphere."
                        borderColor="border-[#33FFD1]"
                        glowColor="shadow-[#33FFD1]"
                    />
                     <WeatherCard
                        title="Kp-index"
                        value={weatherData.kpIndex}
                        unit=""
                        icon={GaugeIcon}
                        description="A scale of 0-9 used to characterize the magnitude of geomagnetic storms."
                        borderColor="border-[#eab308]"
                        glowColor="shadow-[#eab308]"
                    />
                     <WeatherCard
                        title="Max CME Speed"
                        value={weatherData.cmeMaxSpeed}
                        unit="km/s"
                        icon={SunIcon}
                        description="The top speed of the most significant Coronal Mass Ejection in the last 24h."
                        borderColor="border-[#FF6B00]"
                        glowColor="shadow-[#FF6B00]"
                    />
                    <WeatherCard
                        title="Max X-ray Flux"
                        value={weatherData.xrayFluxClass}
                        unit=""
                        icon={XRayIcon}
                        description="The class of the most intense solar flare in the last 24 hours."
                        borderColor="border-[#ef4444]"
                        glowColor="shadow-[#ef4444]"
                    />
                    <WeatherCard
                        title="SEP Events"
                        value={weatherData.sepEvents}
                        unit="in last 24h"
                        icon={ProtonIcon}
                        description="Solar Energetic Particle (proton) events detected near Earth."
                        borderColor="border-[#a855f7]"
                        glowColor="shadow-[#a855f7]"
                    />
                </div>

                <ForecastStrip spaceForecast={weatherData.forecast} />

                <UnifiedChart spaceData={weatherData} />
                
                <ImpactSection />
            </main>
        </div>
    );
};

export default App;