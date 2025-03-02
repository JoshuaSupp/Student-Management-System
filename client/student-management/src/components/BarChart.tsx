import React, { useEffect, useRef } from 'react';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// ✅ Register required components
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface PieChartProps {
    data: number[];
    labels: string[];
}

const BarChart: React.FC<PieChartProps> = ({ data, labels }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // ✅ Destroy existing chart before creating a new one
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(chartRef.current, {
            type: 'bar', // ✅ Pie chart
            data: {
                labels,
                datasets: [
                    {
                        label: 'Course Student Count',
                        data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9966FF'],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
            },
        });

        // Cleanup function to destroy chart on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, labels]);

    return <canvas ref={chartRef} />;
};

export default BarChart;