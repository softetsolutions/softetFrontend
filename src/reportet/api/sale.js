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
