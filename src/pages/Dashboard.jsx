import { Outlet, NavLink } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import { useState } from "react";

export default function Dashboard() {
  return (
    <>
      <DashboardNavbar />

      <div className="w-full bg-blue-50">
        <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white rounded-r-2xl shadow-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">
              Dashboard
            </h2>

            <nav className="space-y-2" style={{ fontVariantLigatures: "none" }}>
              <NavLink
                to="profile"
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
          </div>
        </aside>

        <main className="ml-64 pt-16 h-screen">
          <div className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 min-h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
