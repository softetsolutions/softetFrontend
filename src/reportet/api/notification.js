import { handleUnauthorized } from "../utils/auth";
const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

export const getNotifications = async ({
  unread,
  page = 1,
  limit = 20,
} = {}) => {
  const query = new URLSearchParams();
  if (unread) query.append("unread", "true");
  query.append("page", page);
  query.append("limit", limit);

  const res = await fetch(`${API_BASE_URL}/notifications?${query.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      data.message || `Failed to fetch notifications (${res.status})`,
    );
  return data;
};

export const markNotificationAsRead = async (id) => {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      data.message || `Failed to update notification (${res.status})`,
    );
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      data.message || `Failed to update notifications (${res.status})`,
    );
  return data;
};

export const deleteNotification = async (id) => {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      data.message || `Failed to delete notification (${res.status})`,
    );
  return data;
};

export const sendDoctorBirthdayGreeting = async (doctorId, payload) => {
  const res = await fetch(
    `${API_BASE_URL}/notifications/doctors/${doctorId}/birthday-greeting`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.message || `Failed to send greeting (${res.status})`);
  return data;
};

export const getNotificationSettings = async () => {
  const res = await fetch(`${API_BASE_URL}/notifications/settings`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.message || `Failed to fetch settings (${res.status})`);
  return data;
};

export const toggleNotificationFeature = async (enabled) => {
  const res = await fetch(`${API_BASE_URL}/notifications/settings/toggle`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ enabled }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      data.message || `Failed to update feature toggle (${res.status})`,
    );
  return data;
};

export const updateNotificationEventSetting = async (eventType, updates) => {
  const res = await fetch(
    `${API_BASE_URL}/notifications/settings/${eventType}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updates),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      data.message || `Failed to update event setting (${res.status})`,
    );
  return data;
};

export const uploadEventLogo = async (file) => {
  const formData = new FormData();
  formData.append("logo", file);
  const res = await fetch(`${API_BASE_URL}/notifications/logo`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (res.status === 401) await handleUnauthorized();
  if (!res.ok) throw new Error("Failed to upload logo");
  return await res.json();
};
