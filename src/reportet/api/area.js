//import { API_BASE_URL } from "./config";

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;
export const createArea = async (data) => {
  const res = await fetch(`${API_BASE_URL}/area/add`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // already in { names: [...] } format
  });
  if (!res.ok) throw new Error("Failed to create area");
  return res.json();
};

export const assignAreaToMR = async (mrId, areaId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/area/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mrId, areaId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to assign area to MR");

    return data;
  } catch (err) {
    console.error("Assign Area Error:", err);
    throw err;
  }
};

export const getAreas = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/area`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch areas");

    return data.data||data;
  } catch (err) {
    console.error("Get Areas Error:", err);
    throw err;
  }
};

export const getAreaById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/area/${id}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch area");

    return data;
  } catch (err) {
    console.error("Get Area By ID Error:", err);
    throw err;
  }
};

export const importAreasFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/area/import`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to import areas");

    return data;
  } catch (err) {
    console.error("Import Areas Error:", err);
    throw err;
  }
};

export const getAreaByMrId = async (mrId) => {
  try {
    if (!mrId) throw new Error("MR ID is required");

    const res = await fetch(`${API_BASE_URL}/area/mr/${mrId}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to fetch assigned areas");

    return data; // Array of assigned areas
  } catch (err) {
    console.error("Get Areas by MR ID Error:", err);
    throw err;
  }
};
