import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { OrganizationProvider } from "../src/reportet/admin/OrganizationContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <OrganizationProvider>
      <App />
    </OrganizationProvider>
  </BrowserRouter>,
);
