import React, { useEffect } from 'react';
import { useAppContext } from './AppContext';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

function KPIDashboard() {
    const { state, kpiService } = useAppContext();

    useEffect(() => {
        // Fetch KPIs on component mount
        kpiService.fetchLiveKPIs();
    }, []);

    const kpiData = [
        {
            name: 'GDP Growth',
            target: 7,
            current: state.kpis.gdpGrowth || 4.5
        },
        {
            name: 'Job Creation',
            target: 2000000,
            current: state.kpis.jobCreation || 500000
        },
        {
            name: 'Foreign Investment',
            target: 1000,
            current: state.kpis.foreignInvestment || 350
        }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl mb-4">Vision 2030 Live KPIs</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={kpiData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                        dataKey="current" 
                        fill="#3182ce" 
                        name="Current" 
                    />
                    <Bar 
                        dataKey="target" 
                        fill="#48bb78" 
                        name="Target" 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default KPIDashboard;