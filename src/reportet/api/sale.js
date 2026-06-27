import { handleUnauthorized } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

export const organizationSalesList = async (abortcontroller, payload) => {
  const res = await fetch(`${API_BASE_URL}/sales/getAllSales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
    signal: abortcontroller?.signal,
  });
  if (res.status === 401) await handleUnauthorized();
  return await res.json();
};
export const updateSale = async (id, payload) => {
  const res = await fetch(`${API_BASE_URL}/sales/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (res.status === 401) await handleUnauthorized();
  return await res.json();
};

export const deleteSale = async (id) => {
  const res = await fetch(`${API_BASE_URL}/sales/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (res.status === 401) await handleUnauthorized();
  return await res.json();
};
