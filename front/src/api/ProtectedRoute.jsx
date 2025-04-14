import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

export default function ProtectedRoute({ children }) {
  const { token } = useAuth(); // instead of reading from localStorage directly
  const location = useLocation();

  if (!token) {
    // Redirect to login, but remember where the user was going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
