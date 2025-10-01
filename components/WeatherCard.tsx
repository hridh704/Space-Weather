import React from 'react';

interface WeatherCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    description: string;
    borderColor: string;
    glowColor: string;
}

/**
 * A card component that displays a single, prominent space weather metric.
 * @param {WeatherCardProps} props - The component props.
 * @returns {React.ReactElement} The rendered metric card.
 */
const WeatherCard: React.FC<WeatherCardProps> = ({ title, value, unit, icon: Icon, description, borderColor, glowColor }) => {
    return (
        <div className={`bg-black/30 backdrop-blur-lg rounded-2xl p-6 border ${borderColor} shadow-lg ${glowColor}/40 transition-shadow duration-300 hover:shadow-2xl hover:${glowColor}/60 flex flex-col justify-between`}>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-orbitron text-gray-300">{title}</h3>
                    <Icon className="w-8 h-8 text-gray-400" />
                </div>
                <div className="mb-4">
                    <span className="text-5xl font-bold font-orbitron">{value}</span>
                    <span className="text-lg ml-2 text-gray-400">{unit}</span>
                </div>
            </div>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
};

export default WeatherCard;
