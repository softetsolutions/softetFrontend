import { handleUnauthorized } from "../utils/auth";
const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

export const getEmployeeList = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/employee/getAllEmployees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to fetch employees list");
  if (res.status === 401) await handleUnauthorized();
  return await res.json();
};
