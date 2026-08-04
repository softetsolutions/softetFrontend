import { handleUnauthorized } from "../utils/auth";

// Signup API
const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;
export const signupUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/orgauth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
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
    credentials: "include",
  });

  // if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

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

export const onboardEmployee = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/employee/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (res.status === 401) await handleUnauthorized();
  return await res.json();
};

export const organizationDailyVisitList = async (abortcontroller, payload) => {
  const res = await fetch(
    `${API_BASE_URL}/daily-visit/getOrganizationVisitList`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
      signal: abortcontroller?.signal,
    },
  );
  if (res.status === 401) await handleUnauthorized();
  return await res.json();
};

export const updateDailyVisit = async (id, payload) => {
  const res = await fetch(`${API_BASE_URL}/daily-visit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (res.status === 401) await handleUnauthorized();
  return await res.json();
};

export const deleteDailyVisit = async (id) => {
  const res = await fetch(`${API_BASE_URL}/daily-visit/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (res.status === 401) await handleUnauthorized();
  return await res.json();
};

export const getDoctorVisitReport = async (params) => {
  const query = new URLSearchParams();
  if (params.month) query.append("month", params.month);
  if (params.year) query.append("year", params.year);
  if (params.doctorId) query.append("doctorId", params.doctorId);
  if (params.doctorName) query.append("doctorName", params.doctorName);
  if (params.minVisits) query.append("minVisits", params.minVisits);
  if (params.headQuarterId) query.append("headQuarterId", params.headQuarterId);
  if (params.pageNo) query.append("pageNo", params.pageNo);
  if (params.limit) query.append("limit", params.limit);

  const res = await fetch(
    `${API_BASE_URL}/daily-visit/getDoctorVisitReport?${query.toString()}`,
    { method: "GET", credentials: "include" },
  );
  if (res.status === 401) await handleUnauthorized();
  return await res.json();
};
export const exportOrganizationDailyVisitList = async (payload) => {
  const res = await fetch(
    `${API_BASE_URL}/daily-visit/exportOrganizationVisitList`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to export visit report");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `visit_report_${Date.now()}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportDoctorVisitReport = async (params) => {
  const query = new URLSearchParams();
  if (params.month) query.append("month", params.month);
  if (params.year) query.append("year", params.year);
  if (params.doctorId) query.append("doctorId", params.doctorId);
  if (params.doctorName) query.append("doctorName", params.doctorName);
  if (params.minVisits) query.append("minVisits", params.minVisits);
  if (params.headQuarterId) query.append("headQuarterId", params.headQuarterId);

  const res = await fetch(
    `${API_BASE_URL}/daily-visit/exportDoctorVisitReport?${query.toString()}`,
    { method: "GET", credentials: "include" },
  );

  if (res.status === 401) await handleUnauthorized();

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to export doctor visit report");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `doctor_visit_report_${Date.now()}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};
