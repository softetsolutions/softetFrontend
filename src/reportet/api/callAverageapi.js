import { handleUnauthorized } from "../utils/auth";
const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

export const getCallAverageReport = async (filters = {}, abortController) => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.headQuarterId)
    params.append("headQuarterId", filters.headQuarterId);

  const res = await fetch(
    `${API_BASE_URL}/employee/call-average?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal: abortController?.signal,
    },
  );
  if (res.status === 401) await handleUnauthorized();
  if (!res.ok) throw new Error("Failed to fetch call average report");
  return await res.json();
};

export const exportCallAverageReport = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.headQuarterId)
    params.append("headQuarterId", filters.headQuarterId);

  const res = await fetch(
    `${API_BASE_URL}/employee/call-average/export?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (res.status === 401) await handleUnauthorized();
  if (!res.ok) throw new Error("Failed to export call average report");

  const blob = await res.blob();

  const disposition = res.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="?([^"]+)"?/);
  const fileName = match?.[1] || "call-average-report.xlsx";

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
