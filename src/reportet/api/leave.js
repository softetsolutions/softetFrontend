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
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const getLeaveSummary = async ({ year, signal } = {}) => {
  const query = new URLSearchParams();
  if (year) query.append("year", year);

  const res = await fetch(
    `${API_BASE_URL}/leaves/getLeaveSummary?${query.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
      signal,
    },
  );
  return parseJson(res);
};

export const getLeaveReport = async ({ signal, ...params } = {}) => {
  const query = new URLSearchParams();
  if (params.month) query.append("month", params.month);
  if (params.year) query.append("year", params.year);
  if (params.employeeName) query.append("employeeName", params.employeeName);
  if (params.role) query.append("role", params.role);
  if (params.pageNo) query.append("pageNo", params.pageNo);
  if (params.limit) query.append("limit", params.limit);

  const res = await fetch(
    `${API_BASE_URL}/leaves/getLeaveReport?${query.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
      signal,
    },
  );
  if (res.status === 401) await handleUnauthorized();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch leave report");
  return data;
};

export const exportLeaveReport = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.month) query.append("month", params.month);
  if (params.year) query.append("year", params.year);
  if (params.employeeName) query.append("employeeName", params.employeeName);
  if (params.role) query.append("role", params.role);

  const res = await fetch(
    `${API_BASE_URL}/leaves/exportLeaveReport?${query.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );

  if (res.status === 401) await handleUnauthorized();

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to export leave report");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leave_report_${Date.now()}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};

/** Leave types master (admin) */
export const getLeaveTypes = async ({ includeInactive = true } = {}) => {
  const query = new URLSearchParams();
  if (includeInactive) query.set("includeInactive", "true");

  const res = await fetch(
    `${API_BASE_URL}/leaves/types?${query.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return parseJson(res);
};

export const createLeaveType = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/leaves/types`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
};

export const updateLeaveType = async (id, payload) => {
  const res = await fetch(`${API_BASE_URL}/leaves/types/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
};

/** Team leave inbox (admin backup approver) */
export const getSubordinateLeaves = async ({
  status,
  leaveType,
  fromDate,
  toDate,
} = {}) => {
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  if (leaveType) query.set("leaveType", leaveType);
  if (fromDate) query.set("fromDate", fromDate);
  if (toDate) query.set("toDate", toDate);

  const qs = query.toString();
  const res = await fetch(
    `${API_BASE_URL}/leaves/subordinates${qs ? `?${qs}` : ""}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return parseJson(res);
};

export const actionOnLeave = async (
  leaveId,
  { action, rejectionReason } = {},
) => {
  const res = await fetch(`${API_BASE_URL}/leaves/${leaveId}/action`, {
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
