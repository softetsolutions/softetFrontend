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

export const createSaleByAdmin = async (saleData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/sales/createSaleByAdmin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create sale");

    return data;
  } catch (err) {
    console.error("Create Sale By Admin Error:", err);
    throw err;
  }
};

export const alreadySubmitedSaleByAdmin = async ({ stockist }) => {
  try {
    const params = new URLSearchParams({ stockist });
    const res = await fetch(
      `${API_BASE_URL}/sales/alreadySubmitedSalesByAdmin?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || "Failed to check sale submission status");

    return data;
  } catch (err) {
    console.error("Already Submited Sale By Admin Error:", err);
    throw err;
  }
};

export const exportAllSales = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/sales/exportAllSales`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) await handleUnauthorized();

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to export sales report");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sales_report_${Date.now()}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};

export const getHeadQuarterSalesList = async (headQuarterId, payload) => {
  const res = await fetch(
    `${API_BASE_URL}/sales/headQuarterSales/${headQuarterId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );
  if (res.status === 401) await handleUnauthorized();
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch headquarter sales");
  return data;
};
