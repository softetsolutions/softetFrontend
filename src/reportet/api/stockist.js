// api/stockist.js
import { API_BASE_URL } from "./config";

// CREATE Stockist
export const createStockist = async (stockistData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/stockists`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stockistData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create stockist");

    return data; // Newly created stockist
  } catch (err) {
    console.error("Create Stockist Error:", err);
    throw err;
  }
};

// GET ALL Stockists
export const getAllStockists = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/stockists`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch stockists");

    return data; // Array of stockists
  } catch (err) {
    console.error("Get All Stockists Error:", err);
    throw err;
  }
};

// UPDATE Stockist
export const updateStockist = async (id, updatedData) => {
  try {
    if (!id) throw new Error("Stockist ID is required");

    const res = await fetch(`${API_BASE_URL}/stockists/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update stockist");

    return data; // Updated stockist
  } catch (err) {
    console.error("Update Stockist Error:", err);
    throw err;
  }
};

// DELETE Stockist
export const deleteStockist = async (id) => {
  try {
    if (!id) throw new Error("Stockist ID is required");

    const res = await fetch(`${API_BASE_URL}/stockists/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete stockist");

    return data; // { message: "Deleted successfully" }
  } catch (err) {
    console.error("Delete Stockist Error:", err);
    throw err;
  }
};
