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

const downloadBlob = async (res, fallbackName) => {
  if (res.status === 401) await handleUnauthorized();
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Download failed");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const disposition = res.headers.get("Content-Disposition");
  const match = disposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  let filename = fallbackName;
  if (match?.[1]) {
    filename = match[1].replace(/['"]/g, "").trim();
  }
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return {
    rows: res.headers.get("X-Bank-File-Rows"),
    skipped: res.headers.get("X-Bank-File-Skipped"),
    skippedJson: res.headers.get("X-Bank-File-Skipped-JSON"),
  };
};

/* ── Settings ─────────────────────────────────────────── */

export const getPayrollSettings = async () => {
  const res = await fetch(`${API_BASE_URL}/payroll/settings`, {
    method: "GET",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return parseJson(res);
};

export const updatePayrollSettings = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/payroll/settings`, {
    method: "PATCH",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
};

/* ── Holidays ─────────────────────────────────────────── */

export const getPayrollHolidays = async (year) => {
  const q = year != null ? `?year=${year}` : "";
  const res = await fetch(`${API_BASE_URL}/payroll/holidays${q}`, {
    method: "GET",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return parseJson(res);
};

export const upsertPayrollHoliday = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/payroll/holidays`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
};

export const deletePayrollHoliday = async (holidayId) => {
  const res = await fetch(`${API_BASE_URL}/payroll/holidays/${holidayId}`, {
    method: "DELETE",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return parseJson(res);
};

export const bulkUpsertPayrollHolidays = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/payroll/holidays/bulk`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
};

export const downloadHolidayTemplate = async () => {
  const res = await fetch(`${API_BASE_URL}/payroll/holidays/template`, {
    method: "GET",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return downloadBlob(res, "holiday-template.xlsx");
};

export const importPayrollHolidays = async (file, overwrite = true) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("overwrite", String(overwrite));

  const res = await fetch(`${API_BASE_URL}/payroll/holidays/import`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders(),
    body: formData,
  });
  return parseJson(res);
};

export const copyPayrollHolidaysYear = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/payroll/holidays/copy-year`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
};

export const getHolidayPresets = async () => {
  const res = await fetch(`${API_BASE_URL}/payroll/holidays/presets`, {
    method: "GET",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return parseJson(res);
};

export const previewHolidayPreset = async ({ year, packId }) => {
  const q = new URLSearchParams({
    year: String(year),
    packId: String(packId),
  });
  const res = await fetch(
    `${API_BASE_URL}/payroll/holidays/presets/preview?${q}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return parseJson(res);
};

export const applyHolidayPreset = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/payroll/holidays/presets/apply`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
};

/* ── Bank details ─────────────────────────────────────── */

export const getEmployeeBankDetails = async (employeeMongoId) => {
  const res = await fetch(
    `${API_BASE_URL}/payroll/employees/${employeeMongoId}/bank-details`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return parseJson(res);
};

export const upsertEmployeeBankDetails = async (employeeMongoId, payload) => {
  const res = await fetch(
    `${API_BASE_URL}/payroll/employees/${employeeMongoId}/bank-details`,
    {
      method: "PUT",
      credentials: "include",
      headers: orgAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    },
  );
  return parseJson(res);
};

/* ── Salary structures ────────────────────────────────── */

export const createSalaryStructure = async (employeeMongoId, payload) => {
  const res = await fetch(
    `${API_BASE_URL}/payroll/employees/${employeeMongoId}/salary-structures`,
    {
      method: "POST",
      credentials: "include",
      headers: orgAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    },
  );
  return parseJson(res);
};

export const getSalaryStructures = async (employeeMongoId) => {
  const res = await fetch(
    `${API_BASE_URL}/payroll/employees/${employeeMongoId}/salary-structures`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return parseJson(res);
};

export const getCurrentSalaryStructure = async (employeeMongoId, asOf) => {
  const q = asOf ? `?asOf=${encodeURIComponent(asOf)}` : "";
  const res = await fetch(
    `${API_BASE_URL}/payroll/employees/${employeeMongoId}/salary-structures/current${q}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return parseJson(res);
};

/* ── Payroll runs ─────────────────────────────────────── */

export const createPayrollRun = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/payroll/runs`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
};

export const getPayrollRuns = async () => {
  const res = await fetch(`${API_BASE_URL}/payroll/runs`, {
    method: "GET",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return parseJson(res);
};

export const getPayrollRun = async (runId) => {
  const res = await fetch(`${API_BASE_URL}/payroll/runs/${runId}`, {
    method: "GET",
    credentials: "include",
    headers: orgAuthHeaders(),
  });
  return parseJson(res);
};

export const regeneratePayrollRun = async (runId) => {
  const res = await fetch(`${API_BASE_URL}/payroll/runs/${runId}/regenerate`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
  });
  return parseJson(res);
};

export const finalizePayrollRun = async (runId) => {
  const res = await fetch(`${API_BASE_URL}/payroll/runs/${runId}/finalize`, {
    method: "POST",
    credentials: "include",
    headers: orgAuthHeaders({ "Content-Type": "application/json" }),
  });
  return parseJson(res);
};

/* ── Payslips ─────────────────────────────────────────── */

export const getPayslip = async (runId, payslipId) => {
  const res = await fetch(
    `${API_BASE_URL}/payroll/runs/${runId}/payslips/${payslipId}`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return parseJson(res);
};

export const updatePayslip = async (runId, payslipId, payload) => {
  const res = await fetch(
    `${API_BASE_URL}/payroll/runs/${runId}/payslips/${payslipId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: orgAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    },
  );
  return parseJson(res);
};

/* ── Exports ──────────────────────────────────────────── */

export const exportBankFile = async (runId) => {
  const res = await fetch(
    `${API_BASE_URL}/payroll/runs/${runId}/export/bank-file`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return downloadBlob(res, `bank_file_${runId}.csv`);
};

export const exportPayslipsExcel = async (runId) => {
  const res = await fetch(
    `${API_BASE_URL}/payroll/runs/${runId}/export/payslips`,
    {
      method: "GET",
      credentials: "include",
      headers: orgAuthHeaders(),
    },
  );
  return downloadBlob(res, `payslips_${runId}.xlsx`);
};
