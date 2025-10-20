// src/components/Navbar.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // hide navbar jika belum login

  return (
    <nav style={{ padding: "10px", background: "#2d4c74", color: "#fff", display: "flex", gap: "20px" }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
      <Link to="/itemlist" style={{ color: "#fff", textDecoration: "none" }}>Item List</Link>
      <Link to="/transactions" style={{ color: "#fff", textDecoration: "none" }}>Item Transactions</Link>
      <button onClick={handleLogout} style={{ marginLeft: "auto", padding: "5px 10px", background: "#fff", color: "#2d4c74", border: "none", borderRadius: "4px" }}>
        Logout
      </button>
    </nav>
  );
}
