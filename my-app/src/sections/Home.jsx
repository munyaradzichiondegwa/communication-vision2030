import React from 'react';
import { BarChart, TrendingUp, Globe } from 'lucide-react';

function Home() {
    const heroStats = [
        { 
            icon: <BarChart />, 
            label: 'GDP Growth', 
            value: '7% Target by 2030' 
        },
        { 
            icon: <TrendingUp />, 
            label: 'Job Creation', 
            value: '2M New Jobs' 
        },
        { 
            icon: <Globe />, 
            label: 'Global Ranking', 
            value: 'Upper Middle Income' 
        }
    ];

    return (
        <div className="space-y-6">
            <section className="bg-blue-700 text-white p-8 rounded-lg">
                <h1 className="text-3xl font-bold mb-4">
                    Zimbabwe Vision 2030
                </h1>
                <p className="text-xl">
                    Towards an Upper Middle-Income Economy: 
                    Inclusive Growth, Innovation, and Resilience
                </p>
            </section>

            <section className="grid md:grid-cols-3 gap-4">
                {heroStats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="bg-white p-6 rounded-lg shadow flex items-center"
                    >
                        <div className="mr-4 text-blue-600">
                            {stat.icon}
                        </div>
                        <div>
                            <h3 className="font-bold">{stat.label}</h3>
                            <p className="text-gray-600">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Home;