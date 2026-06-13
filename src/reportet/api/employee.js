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


export const getEmployeeById = async (employeeId) => {
  const res = await fetch(`${API_BASE_URL}/employee/${employeeId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (res.status === 401) await handleUnauthorized();
  if (!res.ok) throw new Error("Failed to fetch employee");
  return await res.json();
};

export const updateEmployee = async (employeeId, payload) => {
  const res = await fetch(`${API_BASE_URL}/employee/${employeeId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (res.status === 401) await handleUnauthorized();
  if (!res.ok) throw new Error("Failed to update employee");
  return await res.json();
};

export const getAllEmployeeNames = async () => {
  const res = await fetch(`${API_BASE_URL}/employee/getAllEmployees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ pageNo: 1, limit: 1000 }),
  });
  if (res.status === 401) await handleUnauthorized();
  if (!res.ok) throw new Error("Failed to fetch employees list");
  return await res.json();
};
