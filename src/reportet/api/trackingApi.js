import { handleUnauthorized } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

async function trackingFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
  });
  if (res.status === 401) await handleUnauthorized();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
}

/** Org-wide live tracking directory (flags + online status). */
export const getTrackingEmployees = async (signal) =>
  trackingFetch("/tracking/employees", { method: "GET", signal });

export const enableOrgLiveTracking = async () =>
  trackingFetch("/tracking/org/enable", { method: "POST" });

export const disableOrgLiveTracking = async () =>
  trackingFetch("/tracking/org/disable", { method: "POST" });

export const enableLiveTracking = async (employeeId) =>
  trackingFetch(`/tracking/employees/${employeeId}/tracking/enable`, {
    method: "POST",
  });

export const disableLiveTracking = async (employeeId) =>
  trackingFetch(`/tracking/employees/${employeeId}/tracking/disable`, {
    method: "POST",
  });

/** Trip Analysis payload for a single employee + IST date. */
export const getTripByDate = async ({ employeeId, date, signal }) => {
  const query = new URLSearchParams({ employeeId, date });
  return trackingFetch(`/tracking/trip?${query.toString()}`, {
    method: "GET",
    signal,
  });
};

/** List trip days for date picker / history. */
export const getTrips = async ({ employeeId, from, to, signal }) => {
  const query = new URLSearchParams();
  if (employeeId) query.set("employeeId", employeeId);
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  return trackingFetch(`/tracking/trips?${query.toString()}`, {
    method: "GET",
    signal,
  });
};

/** Full (or capped) raw GPS points for a trip day. */
export const getTripRaw = async ({ employeeId, date, signal }) => {
  const query = new URLSearchParams({ employeeId, date });
  return trackingFetch(`/tracking/trip/raw?${query.toString()}`, {
    method: "GET",
    signal,
  });
};

export const getTodayTrip = async (employeeId, signal) => {
  const query = new URLSearchParams({ employeeId });
  return trackingFetch(`/tracking/trip/today?${query.toString()}`, {
    method: "GET",
    signal,
  });
};

/**
 * Live SSE stream. Org auth via cookies (credentials / withCredentials),
 * matching the rest of ReportET admin APIs.
 */
export const openLiveLocationsStream = (employeeId) => {
  const path = employeeId
    ? `/tracking/live/${employeeId}`
    : "/tracking/live";
  return new EventSource(`${API_BASE_URL}${path}`, {
    withCredentials: true,
  });
};
