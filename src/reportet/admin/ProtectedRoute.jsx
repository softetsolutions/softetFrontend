import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // ✅ check expiry only
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("userToken");
        navigate("/login");
        return;
      }

      // Since backend doesn't send role or allowedRoutes,
      // just authorize if token is valid
      setIsAuthorized(true);
    } catch (err) {
      console.error("Token decode error:", err);
      navigate("/login");
    }
  }, [navigate]);

  if (isAuthorized === null) return null; // loading placeholder
  return isAuthorized ? <>{children}</> : null;
}

export default ProtectedRoute;
