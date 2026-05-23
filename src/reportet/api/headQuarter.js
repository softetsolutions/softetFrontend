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
