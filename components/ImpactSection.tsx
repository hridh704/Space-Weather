import React from 'react';

/**
 * An educational section explaining the real-world impacts of Space weather.
 * @returns {React.ReactElement} The rendered impact section.
 */
const ImpactSection: React.FC = () => {
    return (
        <div className="text-center">
            <h3 className="text-2xl font-bold font-orbitron mb-4">How Does It Affect Us?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">Space weather has a significant impact on our technologically-dependent society, both in orbit and on the ground.</p>
            <div className="flex justify-center">
                 <div className="w-full max-w-lg p-6 rounded-lg bg-white/5 border-l-4 border-orange-500">
                    <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">🛰️</span>
                        <h4 className="text-xl font-bold font-orbitron">Space Weather Impacts</h4>
                    </div>
                    <p className="text-gray-300 text-left">
                        Space weather, like solar flares and geomagnetic storms, can impact technology on Earth and in orbit. It can disrupt GPS signals, damage satellites, and even pose risks to astronauts and power grids on the ground.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImpactSection;
