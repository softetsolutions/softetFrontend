// import { API_BASE_URL } from "./config";
// import { handleUnauthorized } from "../utils/auth";

// // Signup API
// // export const signupUser = async (userData) => {
// //   const res = await fetch(`${API_BASE_URL}/auth/register`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(userData),
// //   });

// //   if (res.status === 401) await handleUnauthorized();
// //   const data = await res.json();
// //   if (!res.ok) throw new Error(data.message || "Signup failed");
// //   return data;
// // };

// // Login API
// // export const loginUser = async (credentials) => {
// //   const res = await fetch(`${API_BASE_URL}/auth/login`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(credentials),
// //     credentials: "include", // for cookie/session support
// //   });

// //   if (res.status === 401) await handleUnauthorized();
// //   const data = await res.json();
// //   if (!res.ok) throw new Error(data.message || "Login failed");

// //   if (data.token) {
// //     localStorage.setItem("userToken", data.token);
// //   }

// //   return data;
// // };

// // Logout API
// export const logoutUser = async () => {
//   const res = await fetch(`${API_BASE_URL}/orgauth/logout`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include", // for cookie/session logout
//   });

//   if (res.status === 401) await handleUnauthorized();
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Logout failed");
//   return data;
// };


import { API_BASE_URL } from "./config";
import { handleUnauthorized } from "../utils/auth";

// Signup API
export const signupUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/orgauth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include", // important for cookies
  });

  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");

  // If token is sent in response, store it
  if (data.token) {
    localStorage.setItem("userToken", data.token);
  }

  return data;
};

// Login API
export const loginUser = async (credentialsData) => {
  const res = await fetch(`${API_BASE_URL}/orgauth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentialsData),
    credentials: "include", // important for cookies
  });

  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  // Save token locally (optional - for easy frontend access)
  if (data.token) {
    localStorage.setItem("userToken", data.token);
  }

  return data;
};

// Logout API
export const logoutUser = async () => {
  const res = await fetch(`${API_BASE_URL}/orgauth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Logout failed");

  localStorage.removeItem("userToken"); // clear from storage
  return data;
};

