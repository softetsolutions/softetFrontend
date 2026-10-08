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

export const getNotifications = async ({
  unread,
  page = 1,
  limit = 20,
  signal,
} = {}) => {
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (unread) query.set("unread", "true");

  const res = await fetch(
    `${API_BASE_URL}/notifications?${query.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
      signal,
    },
  );
  return parseJson(res);
};

export const markNotificationRead = async (id) => {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return parseJson(res);
};

export const markAllNotificationsRead = async () => {
  const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return parseJson(res);
};

export const deleteNotification = async (id) => {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return parseJson(res);
};

export const getNotificationSettings = async ({ signal } = {}) => {
  const res = await fetch(`${API_BASE_URL}/notifications/settings`, {
    method: "GET",
    credentials: "include",
    headers: orgAuthHeaders(),
    signal,
  });
  return parseJson(res);
};

export const toggleNotificationFeature = async (enabled) => {
  const res = await fetch(`${API_BASE_URL}/notifications/settings/toggle`, {
    method: "PATCH",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ enabled }),
  });
  return parseJson(res);
};

export const updateNotificationEvent = async (eventType, payload) => {
  const res = await fetch(
    `${API_BASE_URL}/notifications/settings/${eventType}`,
    {
      method: "PUT",
      credentials: "include",
      headers: orgAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    },
  );
  return parseJson(res);
};

export const uploadNotificationLogo = async (file) => {
  const formData = new FormData();
  formData.append("logo", file);
  const res = await fetch(`${API_BASE_URL}/notifications/logo`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders(),
    body: formData,
  });
  return parseJson(res);
};

export const sendDoctorBirthdayGreeting = async (
  doctorId,
  { subject, message, notificationId, template } = {},
) => {
  const res = await fetch(
    `${API_BASE_URL}/notifications/doctors/${doctorId}/birthday-greeting`,
    {
      method: "POST",
      credentials: "include",
      headers: orgAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        ...(subject && { subject }),
        ...(message && { message }),
        ...(notificationId && { notificationId }),
        ...(template && { template }),
      }),
    },
  );
  return parseJson(res);
};
