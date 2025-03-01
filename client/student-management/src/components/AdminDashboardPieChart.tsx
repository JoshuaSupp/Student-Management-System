import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';

interface CourseData {
  course_name: string;
  student_count: number;
}

const PieChart: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/student_counts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CourseData[] = await response.json();

        if (data.length === 0) {
          setChartData([['Course Name', 'Student Count'], ['No Data', 1]]);
          return;
        }

        const processedData = data.map(item => [item.course_name, item.student_count]);

        if (processedData.length < 2) {
          setChartData([['Course Name', 'Student Count'], ['Not Enough Data', 1]]);
          return;
        }

        setChartData([['Course Name', 'Student Count'], ...processedData]);
      } catch (error) {
        console.error("Could not fetch data:", error);
        setChartData([['Course Name', 'Student Count'], ['Error', 1]]);
      }
    };

    fetchData();
  }, []);

  const options = {
    title: 'Student Courses',
    is3D: true,
    colors: ['#09e1d7', '#0a7ae9', '#e99f0a', '#f3cc08', '#f15e14' ], // Customize colors here
    titleTextStyle: {
      fontSize: 24, // Change this value to your desired size (e.g., 18, 20, 24)
    },
  };

  return (
    <Chart
      chartType="PieChart"
      data={chartData}
      options={options}
      width={"100%"}
      height={"500px"}
    />
  );
};

export default PieChart;
