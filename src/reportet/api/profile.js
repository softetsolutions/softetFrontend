import { handleUnauthorized } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;
export const updateBranding = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/logo/branding`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update branding");
  return data;
};

export const getAllHeadQuarterNames = async () => {
  const res = await fetch(
    `${API_BASE_URL}/headQuarter/getAllHeadQuarterNames`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch headquarters");
  return data;
};

export const getUnassignedHierarchy = async () => {
  const res = await fetch(`${API_BASE_URL}/headQuarter/unassigned`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch unassigned hierarchy");
  return data;
};

export const getConfiguredFinancialYears = async () => {
  const res = await fetch(`${API_BASE_URL}/budget/meta/years`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch financial years");
  return data;
};

export const getHeadQuarterBudget = async (headQuarterId, financialYear) => {
  const res = await fetch(
    `${API_BASE_URL}/budget/${headQuarterId}?financialYear=${financialYear}`,
    { method: "GET", credentials: "include" },
  );

  if (res.status === 401) await handleUnauthorized();
  if (res.status === 404) return null; // no budget yet — not an error, handled by caller
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch budget");
  return data;
};

export const setHeadQuarterBudget = async (headQuarterId, payload) => {
  const res = await fetch(`${API_BASE_URL}/budget/${headQuarterId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to save budget");
  return data;
};
