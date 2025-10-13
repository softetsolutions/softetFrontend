import { lazy } from "react";
import "./App.css";
import Home from "./pages/Home";
// import Codet from './pages/Codet'
// import Frontet from './pages/Frontet';
// import JsonDiffet from './pages/JsonDiffet';
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./reportet/admin/ProtectedRoute";

{
  /* ReportEt path */
}
import HomePage from "./reportet/HomePage";
import Login from "./reportet/Login";
import UserSignupPage from "./reportet/UserSignup";
import Sidebar from "./reportet/Sidebar";

const Codet = lazy(() => import("./pages/Codet"));
const Frontet = lazy(() => import("./pages/Frontet"));
const JsonDiffet = lazy(() => import("./pages/JsonDiffet"));

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/codet" element={<Codet />} />
        {/* Temprory frontent route */}
        <Route path="/tools/Frontet" element={<Frontet />} />
        <Route path="/tools/jsonDiff" element={<JsonDiffet />} />

        {/* -------------------ReportEt Routes-------------------------*/}

        <Route path="/reportet" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<UserSignupPage />} />
        {/* <Route path="/admin" element={<Sidebar />} /> */}

        {/* Protected admin route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute routeName="admin" requireRole="admin">
              <Sidebar />
            </ProtectedRoute>
          }
        />

        {/*------------------------------------------------------------------- */}
      </Routes>
    </>
  );
}

export default App;
