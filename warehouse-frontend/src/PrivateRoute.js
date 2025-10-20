// src/PrivateRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />; // belum login

  if (role && user.role !== role) return <Navigate to="/" />; // role tidak sesuai

  return children;
};
