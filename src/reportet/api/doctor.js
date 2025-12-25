const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addDoctors = async (doctorData) => {
  const res = await fetch(`${API_BASE_URL}/doctor/add`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctorData), // already wrapped in doctors array
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add doctor");
  return data;
};

// 2. Get all doctors
export const getAllDoctors = async () => {
  const res = await fetch(`${API_BASE_URL}/doctor/getAll`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch doctors");
  return data;
};

// 3. Get doctors by areaId
export const getDoctorsByAreaId = async (areaId) => {
  const res = await fetch(`${API_BASE_URL}/doctors/area/${areaId}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch doctors for area");
  return data;
};

// 4. Assign doctor to MR
export const assignDoctorToMR = async (mrId, doctorId) => {
  const res = await fetch(`${API_BASE_URL}/doctor/assigntoMR`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ mrId, doctorId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to assign doctor to MR");
  return data;
};

// 5. Import doctors from Excel file
export const importDoctorsFromExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/doctor/import`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to import doctors from Excel");
  return data;
};

export const getDoctorsWithRemarks = async (
  mrId,
  areaId,
  startDate,
  endDate
) => {
  try {
    if (!mrId || !areaId || !startDate || !endDate) {
      throw new Error("mrId, areaId, startDate, and endDate are required");
    }

    const queryParams = new URLSearchParams({
      mrId,
      areaId,
      startDate,
      endDate,
    });

    const res = await fetch(
      `${API_BASE_URL}/daily-visit/visitReport?${queryParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to fetch doctors with remarks");

    return data; // Array of visits with doctorId & remark
  } catch (err) {
    console.error("Get Doctors With Remarks Error:", err);
    throw err;
  }
};
