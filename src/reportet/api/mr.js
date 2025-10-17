import { API_BASE_URL } from "./config";

// Fetch all MRs
export const getAllMrs = async () => {
  const res = await fetch(`${API_BASE_URL}/mr/getall`, {
    method: "GET",
    credentials: "include", // important
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch MRs");
  return data.data||data;
};

// Create a new MR
export const createMr = async (mrData) => {
  const res = await fetch(`${API_BASE_URL}/mr/create`, {
    method: "POST",
    credentials: "include", // important
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mrData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create MR");
  return data.data||data;
};
