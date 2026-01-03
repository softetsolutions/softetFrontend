// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const authToken = localStorage.getItem("token");

  if (!authToken) {
    return <Navigate to="/industrial-training/login" replace />;
  }

  return children;
}
