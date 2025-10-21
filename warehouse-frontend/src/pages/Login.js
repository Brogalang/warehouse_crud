// src/pages/Login.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/v1/login";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { email, password });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        <button type="submit" style={{ padding: "8px", background:"#2d4c74", color:"#fff", border:"none", borderRadius:"4px" }}>Login</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Belum punya akun? <Link to="/register" style={{ color: "#2d4c74" }}>Daftar di sini</Link>
      </p>
    </div>
  );
  
}
