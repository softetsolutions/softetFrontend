// import { jwtDecode } from "jwt-decode";
// import { logoutUser } from "../api/api";
// import toast from "react-hot-toast";

// // Decode user token and extract auth info
// export const getAuthInfo = () => {
//   const token = localStorage.getItem("userToken");
//   if (!token) {
//     throw new Error("No authentication token found");
//   }

//   const decoded = jwtDecode(token);
//   const userId = decoded.id;
//   const role = decoded.role;
// // 
//   if (!userId) {
//     throw new Error("No user ID found in token");
//   }

//   return { token, userId, role };
// };

// // Call logout API and clear localStorage
// export const logout = async () => {
//   try {
//     await logoutUser(); // You should have this function defined in ../api/api.js
//   } catch (error) {
//     console.error("Logout API call failed:", error);
//   } finally {
//     localStorage.removeItem("userToken");
//   }
// };

// // Check if user is authenticated
// export const isAuthenticated = () => {
//   try {
//     getAuthInfo();
//     return true;
//   } catch {
//     return false;
//   }
// };

// // Handle logout and redirect
// export const handleUnauthorized = async (navigate) => {
//   await logout();
//   toast.error("Session expired. Please login again.");

//   if (typeof navigate === "function") {
//     navigate("/login");
//   } else {
//     window.location.href = "/login";
//   }
// };



// src/utils/auth.js
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../api/api";
import toast from "react-hot-toast";

export const getAuthInfo = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const decoded = jwtDecode(token);
  const userId = decoded.id;
  const role = decoded.role;

  if (!userId) {
    throw new Error("No user ID found in token");
  }

  return { token, userId, role };
};

export const logout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    localStorage.removeItem("userToken");
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
  await logout();
  toast.error("Session expired. Please login again.");
  if (typeof navigate === "function") {
    navigate("/login");
  } else {
    window.location.href = "/login";
  }
};
