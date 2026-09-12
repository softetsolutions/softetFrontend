import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

/**
 * ReportEt org sessions are signed as { id, typ: "org" }.
 * requireTyp defaults to "org" for /admin.
 */
function ProtectedRoute({ children, requireTyp = "org" }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("userToken");
        navigate("/login", { replace: true });
        return;
      }

      if (requireTyp && decoded.typ !== requireTyp) {
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    } catch (err) {
      console.error("Token decode error:", err);
      localStorage.removeItem("userToken");
      navigate("/login", { replace: true });
    }
  }, [navigate, requireTyp]);

  if (isAuthorized === null) return null;

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
