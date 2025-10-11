import { API_BASE_URL } from "./config";

// Fetch all MRs
export const getAllMrs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/mr/getall`, {
      method: "GET",
      credentials: "include", // to send cookies if auth is session-based
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch MRs");
    }

    return data; // returns array of MR objects
  } catch (error) {
    console.error("Error fetching MRs:", error);
    throw error; // let caller handle UI error
  }
};

// Create a new MR
export const createMr = async (mrData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/mr/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mrData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create MR");
    }

    return data;
  } catch (error) {
    console.error("Error creating MR:", error);
    throw error;
  }
};

// Get MRs by Area ID
export const getMrByAreaId = async (areaId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/getByAreaId/${areaId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch MRs for this area");
    }

    return data;
  } catch (error) {
    console.error("Error fetching MRs by area:", error);
    throw error;
  }
};
