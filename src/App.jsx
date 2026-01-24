import "./App.css";
import Home from "./pages/Home";
import Codet from "./pages/Codet";
import Frontet from "./pages/Frontet";
import JsonDiffet from "./pages/JsonDiffet";
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
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/codet" element={<Codet />} />
        <Route path="/:projectSlug" element={<ProjectDetails />} />
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
            <Dashboard />
            // <ProtectedRoute>
            // </ProtectedRoute>
          }
        >
          <Route path="profile" element={<ProfileModal />} />
          <Route path="referral" element={<Referral />} />
          <Route path="classes" element={<Classes />} />

          {/* default when only /dashboard is opened */}
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
          {/* <Route path="#" element={<Classes />} /> */}

          {/* default when only /dashboard is opened */}
          <Route index element={<ProfileModal />} />
        </Route>

        <Route />
        {/* Temprory frontent route */}
        <Route path="/tools/Frontet" element={<Frontet />} />
        <Route path="/tools/jsonDiff" element={<JsonDiffet />} />
      </Routes>
    </>
  );
}

export default App;
