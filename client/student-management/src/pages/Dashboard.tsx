import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

interface Courses {
  id: number;
  course_number: number;
  name: string;
  student_count: number;
}

function Dashboard() {
    const [data, setData] = useState<Courses[]>([]);
    const [deleted, setDeleted] = useState(true)
    const [courseNames, setCourseNames] = useState<string[]>([]);
    const [courseNumbers, setCourseNumbers] = useState<number[]>([]);
    useEffect(()=>{
        if(deleted){
            setDeleted(false)
        axios.get('/api/courses') //TODO
        .then((res)=>{
            setData(res.data)
        })
        .catch((err) => {
            console.log(err);
            toast.error("Failed to fetch course details");
        });
    }
    }, [deleted])

    useEffect(() => {
        if (data.length > 0) {
            setCourseNames(data.map((course) => course.name));
            setCourseNumbers(data.map((course) => course.student_count));
        }
    }, [data]); // Runs when data changes
  return (
    <>
    <Navbar />
    <div style={{width: "500px", display: "flex", alignItems: "center", margin: "10%"}}>
        <h2 style={{textAlign: "center"}}>Student Allocation</h2>
        <PieChart data={courseNumbers} labels={courseNames} />
        <BarChart data={courseNumbers} labels={courseNames} />
    </div>
    </>
  )
}

export default Dashboard