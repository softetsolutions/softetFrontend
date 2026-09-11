import { lazy, Suspense } from "react";
import "./App.css";
import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Term from "./pages/Term";
import Policy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import AboutUsPage from "./components/AboutUsPage.jsx";
import ContectUsPage from "./components/ContectUsPage.jsx";

import ForgotPassword from "./reportet/ForgotPassword.jsx";
import ResetPassword from "./reportet/ResetPassword.jsx";

const FullStackCoursePage = lazy(
  () => import("./fsdCourse/pages/FullStackCoursePage.jsx"),
);

import ReportetProtectedRoute from "./reportet/admin/ProtectedRoute";
import { Toaster } from "react-hot-toast";

import HomePage from "./reportet/HomePage";
import ReportetLogin from "./reportet/Login";
import UserSignupPage from "./reportet/UserSignup";
import ContextProviderForReportetLayout from "./reportet/ContextProviderForReportetLayout.jsx";

const Sidebar = lazy(() => import("./reportet/Sidebar"));
const Codet = lazy(() => import("./pages/Codet"));
const Frontet = lazy(() => import("./pages/Frontet"));
const JsonDiffet = lazy(() => import("./pages/JsonDiffet"));

function LazyFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Loading…
    </div>
  );
}

function App() {
  return (
    <>
      <Suspense fallback={<LazyFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/codet" element={<Codet />} />
          <Route path="/tools/Frontet" element={<Frontet />} />
          <Route path="/tools/jsonDiff" element={<JsonDiffet />} />

          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContectUsPage />} />
          <Route path="/terms" element={<Term />} />
          <Route path="/privacy" element={<Policy />} />
          <Route path="/refund_policy" element={<RefundPolicy />} />

          {/* Industrial training paused — redirect old URLs */}
          <Route
            path="/industrial-training/*"
            element={<Navigate to="/" replace />}
          />

          <Route
            path="full-stack-development-course"
            element={<FullStackCoursePage />}
          />

          <Route element={<ContextProviderForReportetLayout />}>
            <Route path="/reportet" element={<HomePage />} />
            <Route path="/login" element={<ReportetLogin />} />
            <Route path="/signup" element={<UserSignupPage />} />
            <Route
              path="/reportet/employee/forgot-password"
              element={<ForgotPassword />}
            />
            <Route
              path="/reportet/employee/reset-password/:token"
              element={<ResetPassword />}
            />
            <Route
              path="/admin"
              element={
                <ReportetProtectedRoute requireTyp="org">
                  <Sidebar />
                </ReportetProtectedRoute>
              }
            />
          </Route>

          {/* Keep catch-all after specific routes so auth paths are not swallowed */}
          <Route path="/:projectSlug" element={<ProjectDetails />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
