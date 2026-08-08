const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

export const createBulkHeadQuarterWithUi = async (data) => {
  const res = await fetch(`${API_BASE_URL}/headQuarter/bulkuiadd`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create the headquarters");
  return await res.json();
};

export const getAllHeadquartersData = async (paginationData) => {
  const res = await fetch(
    `${API_BASE_URL}/headQuarter/getPaginatedHeadQuarters`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paginationData),
    },
  );
  if (!res.ok) throw new Error("Failed to fetch headQuarters");
  return await res.json();
};

export const getAllHeadQuartersNames = async () => {
  const res = await fetch(
    `${API_BASE_URL}/headQuarter/getAllHeadQuarterNames`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch headquarter names");
  return await res.json();
};

export const editHeadQuarter = async (headquarterId, data) => {
  const res = await fetch(`${API_BASE_URL}/headQuarter/${headquarterId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update the headquarter");
  return await res.json();
};

export const deleteHeadQuarter = async (headquarterId) => {
  const res = await fetch(`${API_BASE_URL}/headQuarter/${headquarterId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return await res.json();
};

export const importHeadquartersFromExcel = async (file, fromRow, toRow) => {
  const formData = new FormData();
  formData.append("file", file);
  if (fromRow) formData.append("rowNumber", fromRow);

  const res = await fetch(`${API_BASE_URL}/headQuarter/import`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to import headquarters");
  return await res.json();
};

export const getAllZones = async () => {
  const res = await fetch(`${API_BASE_URL}/headQuarter/zones`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch zones");
  return await res.json();
};
