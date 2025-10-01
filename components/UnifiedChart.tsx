import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar, Line, RadialBarChart, PolarAngleAxis, RadialBar, BarChart } from 'recharts';
import type { SpaceWeatherData } from '../types';

/**
 * Props for the UnifiedChart component.
 */
interface UnifiedChartProps {
    spaceData: SpaceWeatherData;
}

type ChartView = 'solar_wind' | 'geomagnetic' | 'solar_activity' | 'particle_events' | 'kp_forecast';

/**
 * A custom tooltip component for Recharts to match the app's style.
 * @param {object} props - The props injected by Recharts.
 * @param {boolean} props.active - Whether the tooltip is active.
 * @param {Array} props.payload - The data payload for the tooltip.
 * @param {string} props.label - The label for the current data point.
 * @returns {React.ReactElement | null} The rendered tooltip or null.
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-black/70 backdrop-blur-sm border border-gray-600 rounded-md text-white">
        <p className="label">{`Time: ${label}`}</p>
        {payload.map((p: any, index: number) => {
            return (
                <p key={index} style={{ color: p.color || p.stroke }}>
                    {`${p.name}: ${p.value !== null && p.value !== undefined ? Math.round(p.value) : 'N/A'}`}
                </p>
            );
        })}
      </div>
    );
  }
  return null;
};

/**
 * A component that displays multiple, switchable charts for visualizing weather data.
 * @param {UnifiedChartProps} props - The component props.
 * @returns {React.ReactElement} The rendered data visualizer section.
 */
const UnifiedChart: React.FC<UnifiedChartProps> = ({ spaceData }) => {
    const [activeTab, setActiveTab] = useState<ChartView>('solar_wind');
    
    // Data for Geomagnetic Chart (Kp Index)
    const geomagneticData = spaceData.historicalKpIndex.map(kp => ({
        time: kp.time,
        'Max Kp-Index': kp.value
    }));

    // Data for Solar Activity Chart (CME Speed + X-ray Flux)
    const solarActivityTimes = [...new Set([...spaceData.historicalCmeSpeed.map(d => d.time), ...spaceData.historicalXrayFlux.map(d => d.time)])].sort();
    const solarActivityData = solarActivityTimes.map(time => ({
        time: time,
        'Max CME Speed (km/s)': spaceData.historicalCmeSpeed.find(d => d.time === time)?.value,
        'X-ray Flux Intensity': spaceData.historicalXrayFlux.find(d => d.time === time)?.value,
    }));


    /**
     * Renders the currently active chart based on the `activeTab` state.
     * @returns {React.ReactElement | null} The chart component to render.
     */
    const renderChart = () => {
        switch (activeTab) {
            case 'solar_wind':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={spaceData.historicalSolarWind}>
                            <defs>
                                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#33FFD1" stopOpacity={0.8}/><stop offset="95%" stopColor="#33FFD1" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#EAEAEA" />
                            <YAxis stroke="#33FFD1" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area 
                                type="monotone" 
                                dataKey="value"
                                name="Solar Wind (km/s)"
                                stroke="#33FFD1" 
                                fillOpacity={1} 
                                fill="url(#colorSolar)" 
                                connectNulls={false} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'geomagnetic':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={geomagneticData}>
                            <defs>
                                <linearGradient id="colorKp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/><stop offset="95%" stopColor="#eab308" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#EAEAEA" />
                            <YAxis yAxisId="left" orientation="left" stroke="#eab308" domain={[0, 9]} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="Max Kp-Index" stroke="#eab308" fill="url(#colorKp)" connectNulls={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                );
            case 'solar_activity':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={solarActivityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#EAEAEA" />
                            <YAxis yAxisId="left" orientation="left" stroke="#FF6B00" label={{ value: 'km/s', angle: -90, position: 'insideLeft', fill: '#FF6B00' }}/>
                            <YAxis yAxisId="right" orientation="right" stroke="#ef4444" domain={[10, 65]} allowDecimals={false} tickFormatter={(tick) => { if(tick===10) return 'A'; if(tick===20) return 'B'; if(tick===30) return 'C'; if(tick===40) return 'M'; if(tick===50) return 'X'; return '' }}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar yAxisId="right" dataKey="X-ray Flux Intensity" barSize={20} fill="#ef4444" />
                            <Line yAxisId="left" type="monotone" dataKey="Max CME Speed (km/s)" stroke="#FF6B00" strokeWidth={2} connectNulls={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                );
            case 'particle_events':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={spaceData.historicalSepEvents}>
                             <defs>
                                <linearGradient id="colorSep" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#EAEAEA" />
                            <YAxis stroke="#a855f7" allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="value" name="SEP Events" fill="url(#colorSep)" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'kp_forecast': {
                const peakForecast = spaceData.forecast.reduce(
                    (max, day) => (day.kpIndex > max.kpIndex ? day : max),
                    spaceData.forecast[0] || { kpIndex: 0, day: 'N/A' }
                );
                const peakKp = peakForecast.kpIndex;
                const gaugeData = [{ name: 'Kp-Index', value: peakKp }];

                const getKpColor = (kp: number) => {
                    if (kp <= 3) return '#33FFD1'; // Calm - Teal
                    if (kp <= 4) return '#eab308'; // Unsettled - Yellow
                    if (kp <= 6) return '#FF6B00'; // Storm - Orange
                    return '#ef4444'; // Severe Storm - Red
                };
                const color = getKpColor(peakKp);
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="90%"
                            barSize={30}
                            data={gaugeData}
                            startAngle={90}
                            endAngle={-270}
                        >
                            <PolarAngleAxis type="number" domain={[0, 9]} angleAxisId={0} tick={false} />
                            <RadialBar
                                background
                                dataKey="value"
                                angleAxisId={0}
                                fill={color}
                                cornerRadius={15}
                                className="transition-all"
                            />
                            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="font-orbitron text-5xl fill-white">
                                {peakKp.toFixed(0)}
                            </text>
                            <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-lg fill-gray-400">
                                Peak Kp-Index
                            </text>
                             <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-500">
                                (Forecast for {peakForecast.day})
                            </text>
                        </RadialBarChart>
                    </ResponsiveContainer>
                )
            }
            default:
                return null;
        }
    };
    
    /**
     * A button component for switching between chart tabs.
     * @param {object} props - The component props.
     * @param {ChartView} props.view - The chart view this button activates.
     * @param {string} props.label - The text label for the button.
     */
    const TabButton = ({ view, label }: { view: ChartView; label: string }) => (
        <button
            onClick={() => setActiveTab(view)}
            className={`px-3 py-2 text-sm sm:px-4 sm:text-base rounded-md transition-colors font-semibold ${activeTab === view ? 'bg-[#FF6B00] text-black' : 'bg-white/10 hover:bg-white/20'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold font-orbitron mb-4 text-center">Data Visualizer</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                <TabButton view="solar_wind" label="🌬️ Solar Wind" />
                <TabButton view="geomagnetic" label="🌍 Geomagnetic" />
                <TabButton view="solar_activity" label="☀️ Solar Activity" />
                <TabButton view="particle_events" label="⚛️ Particle Events" />
                <TabButton view="kp_forecast" label="⚡ Kp Forecast" />
            </div>
            <div className="w-full h-[300px]">
                {renderChart()}
            </div>
        </div>
    );
};

export default UnifiedChart;