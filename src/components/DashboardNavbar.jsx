import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

export default function DashboardNavbar() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true); // start loading
      const res = await fetch("http://localhost:5005/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Logout failed:", data.message);
        setLoading(false);
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/industrial-training");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 border-b-2 border-blue-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 z-50">
      <Link to="/industrial-training">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Softet Solutions"
            className="w-10 h-10 rounded-lg object-contain"
          />
          <span className="font-bold text-lg text-[#0B3B6A]">
            Softet Solutions
          </span>
        </div>
      </Link>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </header>
  );
}
