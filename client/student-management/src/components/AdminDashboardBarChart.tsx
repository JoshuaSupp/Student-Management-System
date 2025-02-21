import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions 
} from 'chart.js';
import './AdminDashboardBarChart.css';

// Register the required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Define types for chart data
interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
}

interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

const AdminDashboardBarChart = () => {
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: [],
    });
    
    const chartRef = useRef<ChartJS<'bar'> | null>(null);

    // Define your colors here
    const colors = [
        'rgba(13, 217, 196, 0.6)',  // Red
        'rgba(54, 162, 235, 0.6)',   // Blue
        'rgba(17, 212, 62, 0.6)',   // green
        'rgba(75, 192, 192, 0.6)',   // Teal
        'rgba(153, 102, 255, 0.6)',   // Purple
        'rgba(255, 159, 64, 0.6)',   // Orange
    ];

    useEffect(() => {
        const fetchStudentCounts = async () => {
            try {
                const response = await fetch('/api/student_counts');
                const data = await response.json();

                const labels = data.map((item: { course_name: any; }) => item.course_name);
                const counts = data.map((item: { student_count: number; }) => item.student_count);

                setChartData({
                    labels,
                    datasets: [{
                        label: 'Number of Students',
                        data: counts,
                        backgroundColor: colors.slice(0, counts.length), // Use solid colors directly
                        borderColor: colors.slice(0, counts.length).map(color => color.replace('0.6', '1')),
                        borderWidth: 1,
                    }],
                });
            } catch (error) {
                console.error('Error fetching student counts:', error);
            }
        };

        fetchStudentCounts();
    }, []);

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'top',
                display: false,
                labels: {
                    font: {
                        size: 16,
                    },
                },
            },
            title: { 
                display: true, 
                text: 'Students per Course',
                font:{
                    size :24,
                }
            },
        },
        scales: {
            x:{ 
                title:{ 
                    display:true , 
                    text:'Courses',
                    font:{
                        size :16,
                    }
                 },  
                 ticks:{
                     font:{
                         size :14,
                     }
                 }
             },  
             y:{ 
                 title:{ 
                     display:true , 
                     text:'Number of Students',
                     font:{
                         size :16,
                     }
                  },  
                  ticks:{
                      font:{
                          size :14,
                      }
                  }
              },  
         },  
     };

     return (
         <div className="chart-container"> 
             <h3>Students per Course</h3>
             <Bar ref={chartRef} data={chartData} options={chartOptions} />
         </div>
     );
};

export default AdminDashboardBarChart;