import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  // disable background scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      <DashboardNavbar />

      <div className="bg-blue-50 min-h-screen">
        {/* MOBILE HAMBURGER */}
        <button
          className="lg:hidden fixed top-20 left-4 z-40 bg-white shadow p-2 rounded-xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>

        {/* DARK BACKDROP (mobile) */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
    fixed top-16 left-0
  
    h-[30vh]             
    lg:h-[calc(100vh-4rem)] 

    w-40 sm:w-48 lg:w-64
    bg-white shadow-xl rounded-r-2xl
    p-5
    z-40
    transform transition-transform duration-300
    lg:translate-x-0
    ${open ? "translate-x-0" : "-translate-x-64"}
  `}
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">
            Dashboard
          </h2>

          <nav className="space-y-2">
            <NavLink
              to="profile"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                    : "hover:bg-blue-50"
                }`
              }
            >
              Profile
            </NavLink>

            <NavLink
              to="referral"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                    : "hover:bg-blue-50"
                }`
              }
            >
              Referral
            </NavLink>

            <NavLink
              to="classes"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                    : "hover:bg-blue-50"
                }`
              }
            >
              Classes
            </NavLink>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main
          className="
            pt-20
            lg:pt-16
            lg:ml-64
            transition-all
          "
        >
          <div className="min-h-[calc(100vh-5rem)] p-4 sm:p-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 min-h-[70vh]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
