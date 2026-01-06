import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
  const authToken = localStorage.getItem("token");

  if (!authToken) {
    return <Navigate to="/industrial-training/login" replace />;
  }

  return children;
}
