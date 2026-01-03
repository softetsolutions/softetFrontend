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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Referral from "./pages/Referral";
import Dashboard from "./pages/Dashboard";
import ProfileModal from "./pages/Profile";
import Classes from "./pages/Classes";
import ProtectedRoute from "./Routes/ProtectedRoutes";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/codet" element={<Codet />} />
        <Route path="/:projectSlug" element={<ProjectDetails />} />
        <Route path="/terms" element={<Term />} />
        <Route path="/privacy" element={<Policy />} />
        <Route path="/refund_policy" element={<RefundPolicy />} />
        <Route path="/industrial-training" element={<IndustrialTraining />} />
        <Route path="/industrial-training/login" element={<Login />} />
        <Route path="/industrial-training/signup" element={<Signup />} />
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
