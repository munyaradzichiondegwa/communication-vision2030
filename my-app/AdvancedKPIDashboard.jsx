import React, { useState, useEffect } from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend,
    ResponsiveContainer,
    PieChart, 
    Pie, 
    Cell 
} from 'recharts';

function AdvancedKPIDashboard() {
    const [kpiData, setKpiData] = useState({
        economicTrends: [],
        sectorBreakdown: []
    });

    useEffect(() => {
        // Fetch advanced KPI data
        async function fetchKPIData() {
            try {
                const response = await fetch('/api/advanced-kpis');
                const data = await response.json();
                setKpiData(data);
            } catch (error) {
                console.error('Failed to fetch KPI data', error);
            }
        }

        fetchKPIData();
    }, []);

    // Economic Trends Line Chart
    const EconomicTrendsChart = () => (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Economic Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={kpiData.economicTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="gdpGrowth" 
                        stroke="#8884d8" 
                        name="GDP Growth" 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="foreignInvestment" 
                        stroke="#82ca9d" 
                        name="Foreign Investment" 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    // Sector Breakdown Pie Chart
    const SectorBreakdownChart = () => {
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

        return (
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Sector Contribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={kpiData.sectorBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {kpiData.sectorBreakdown.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <EconomicTrendsChart />
            <SectorBreakdownChart />
        </div>
    );
}

export default AdvancedKPIDashboard;