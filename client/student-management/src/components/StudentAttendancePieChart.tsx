import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

const StudentAttendancePieChart = () => {
  const [chartData, setChartData] = useState<(string | number)[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const student_Id = sessionStorage.getItem("student_id");

  useEffect(() => {
    axios
      .get(`/api/student_attendance/${student_Id}`)
      .then((response) => {
        const data = response.data.attendanceData;
        //console.log("DATA",data)
        if (data.length > 0) {
          const formattedData = [["Status", "Count"], ...data.map((item: { name: any; value: any; }) => [item.name, item.value])];
          setChartData(formattedData);
        } else {
          setError("No attendance data available.");
        }
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
        setError("Failed to load attendance data.");
      })
      .finally(() => setLoading(false));
  }, [student_Id]);

  const options = {
    title: "Attendance Overview",
    pieHole: 0.4,
    is3D: false,
    backgroundColor: "transparent",
    colors: ["#36A2EB", "#f01308"],
    chartArea: { width: "80%", height: "80%" },
    legend: { position: "bottom" },
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h2>Attendance Tracker 📊</h2>

      {loading ? (
        <p>Loading attendance data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <Chart chartType="PieChart" data={chartData} options={options} width={"100%"} height={"500px"} />
      )}
    </div>
  );
};

export default StudentAttendancePieChart;
