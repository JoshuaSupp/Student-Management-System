import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
      }, []);


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        axios.post("/api/login", { email, password })
            .then((res) => {
                toast.success("Login Successful!", { position: "top-right", autoClose: 300 });
                //console.log("Full Response:", res.data);
                const {role_id} = res.data

                // Store the token in localStorage or sessionStorage
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("token_expiry", (Date.now() + 15 * 60 * 1000).toString()); //  15 mins
                localStorage.setItem("role_id", role_id);

                //console.log("Role_id",role_id)

                const redirectPath = role_id === "001" ? "/dashboard" : "/student_dashboard";

                // Delay navigation to allow toast to be visible
                setTimeout(() => {
                  navigate(redirectPath);
                }, 900);
            })
            .catch((error) => {
                toast.error("Invalid email or password", { position: "top-right", autoClose: 600 });
                console.error(error);
            });
    };
    

  return (
    <div> 
   <div className="container vh-100 d-flex justify-content-center align-items-center">
    <form className="p-5 bg-light rounded-3 shadow-lg border border-secondary w-45 w-sm-60" onSubmit={handleLogin}>
        <h2 className="text-center mb-4">SMS Login 🏫</h2>
        <div className="mb-3">
            <label className="fw-bold">Email:</label>
            <input type="email" className="form-control p-3" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
            <label className="fw-bold">Password:</label>
            <input type="password" className="form-control p-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Login</button>
    </form>
    <ToastContainer />
</div>

    </div>
  )
}

export default Login