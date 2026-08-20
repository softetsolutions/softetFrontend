import { handleUnauthorized } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

export const enableLiveTracking = async (employeeId) => {
  const res = await fetch(
    `${API_BASE_URL}/tracking/employees/${employeeId}/tracking/enable`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to enable live tracking");
  return data;
};

export const disableLiveTracking = async (employeeId) => {
  const res = await fetch(
    `${API_BASE_URL}/tracking/employees/${employeeId}/tracking/disable`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to disable live tracking");
  return data;
};
export const getTripByDate = async ({ employeeId, date, signal }) => {
  const query = new URLSearchParams({ employeeId, date });
  const res = await fetch(`${API_BASE_URL}/tracking/trip?${query.toString()}`, {
    method: "GET",
    credentials: "include",
    signal,
  });
  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch trip");
  return data;
};

export const getTodayTrip = async (employeeId, signal) => {
  const query = new URLSearchParams({ employeeId });
  const res = await fetch(
    `${API_BASE_URL}/tracking/trip/today?${query.toString()}`,
    { method: "GET", credentials: "include", signal },
  );
  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch today's trip");
  return data;
};

export const openLiveLocationsStream = () => {
  return new EventSource(`${API_BASE_URL}/tracking/live`, {
    withCredentials: true,
  });
};
