const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

export const getZoneOptions = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/zone/getZoneOptions`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch zones");

    return data;
  } catch (err) {
    console.error("Get Zone Options Error:", err);
    throw err;
  }
};
