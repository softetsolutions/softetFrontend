import { lazy, Suspense } from "react";
import "./App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Term from "./pages/Term";
import Policy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import IndustrialTraining from "./pages/IndustrialTraining";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import AboutUsPage from "./components/AboutUsPage.jsx";
import ContectUsPage from "./components/ContectUsPage.jsx";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Referral from "./pages/Referral";
import Dashboard from "./pages/Dashboard";
import ProfileModal from "./pages/Profile";
import Classes from "./pages/Classes";
import ProtectedRoute from "./Routes/ProtectedRoutes";
import Payment from "./pages/Payment";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import StudentList from "./pages/StudentList.jsx";
import PaymentList from "./pages/PaymentList.jsx";
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
import Sidebar from "./reportet/Sidebar";
import ContextProviderForReportetLayout from "./reportet/ContextProviderForReportetLayout.jsx";

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
          <Route path="/industrial-training" element={<IndustrialTraining />} />
          <Route path="/industrial-training/login" element={<Login />} />
          <Route path="/industrial-training/signup" element={<Signup />} />
          <Route path="/industrial-training/payment" element={<Payment />} />

          <Route
            path="/industrial-training/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<ProfileModal />} />
            <Route path="referral" element={<Referral />} />
            <Route path="classes" element={<Classes />} />
            <Route index element={<ProfileModal />} />
          </Route>

          <Route
            path="/industrial-training/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="student-list" element={<StudentList />} />
            <Route path="payment-list" element={<PaymentList />} />
            <Route index element={<ProfileModal />} />
          </Route>

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
