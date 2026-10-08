import { handleUnauthorized } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

const orgAuthHeaders = (extra = {}) => {
  const headers = { ...extra };
  const token = localStorage.getItem("userToken");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const parseJson = async (res) => {
  if (res.status === 401) await handleUnauthorized();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
};

export const getSubordinateTourPlans = async ({
  pageNo = 1,
  limit = 10,
  status,
  year,
  month,
  role,
  search,
  headQuarterId,
} = {}) => {
  const query = new URLSearchParams();
  query.set("pageNo", String(pageNo));
  query.set("limit", String(limit));
  if (status) query.set("status", status);
  if (year) query.set("year", String(year));
  if (month) query.set("month", String(month));
  if (role) query.set("role", role);
  if (search) query.set("search", search);
  if (headQuarterId) query.set("headQuarterId", headQuarterId);

  const res = await fetch(
    `${API_BASE_URL}/tour-plans/subordinates?${query.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return parseJson(res);
};

export const getSubordinateTourPlanDetail = async (planId) => {
  const res = await fetch(
    `${API_BASE_URL}/tour-plans/subordinates/${planId}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return parseJson(res);
};

export const actionOnTourPlan = async (
  planId,
  { action, rejectionReason } = {},
) => {
  const res = await fetch(`${API_BASE_URL}/tour-plans/${planId}/action`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      action,
      ...(rejectionReason && { rejectionReason }),
    }),
  });
  return parseJson(res);
};
