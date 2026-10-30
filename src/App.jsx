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

const FullStackCoursePage = lazy(
  () => import("./fsdCourse/pages/FullStackCoursePage.jsx"),
);

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

        <Route path="/:projectSlug" element={<ProjectDetails />} />
      </Routes>
    </Suspense>
  );
}

export default App;
