import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../api/api";
import toast from "react-hot-toast";

let clearOrgCallback = null;

/** Wire OrganizationContext.clearOrganization into logout cleanup. */
export const setClearOrganizationCallback = (fn) => {
  clearOrgCallback = typeof fn === "function" ? fn : null;
};

export const getAuthInfo = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const decoded = jwtDecode(token);
  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    localStorage.removeItem("userToken");
    throw new Error("Authentication token expired");
  }

  const userId = decoded.id;
  // Org JWT is { id, typ: "org" } — no role claim
  const typ = decoded.typ;
  const role = decoded.role;

  if (!userId) {
    throw new Error("No user ID found in token");
  }

  return { token, userId, typ, role };
};

export const logout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    localStorage.removeItem("organization");
    localStorage.removeItem("userToken");
    if (typeof clearOrgCallback === "function") {
      clearOrgCallback();
    }
  }
};

export const isAuthenticated = () => {
  try {
    getAuthInfo();
    return true;
  } catch {
    return false;
  }
};

export const handleUnauthorized = async (navigate) => {
  if (window.location.pathname === "/login") return;

  await logout();
  toast.error("Session expired. Please login again.");
  if (typeof navigate === "function") {
    navigate("/login");
  } else {
    window.location.href = "/login";
  }
};
