const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;


export const applyLeave = async (leaveData) => {
  const res = await fetch(`${API_BASE_URL}/leave/apply`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leaveData),

  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to apply leave");
  return data;
};


export const getMyLeaves = async () => {
  const res = await fetch(`${API_BASE_URL}/leaves/my`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch your leaves");
  return data;
};


export const getAllLeavesForAdmin = async ({ pageNo = 1, limit = 10, status, role } = {}) => {
  const res = await fetch(`${API_BASE_URL}/leaves/all`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageNo, limit, ...(status && { status }), ...(role && { role }) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch leaves");
  return data;
};


export const getLeavesForAreaManager = async ({ pageNo = 1, limit = 10, status } = {}) => {
  const res = await fetch(`${API_BASE_URL}/leave/manager/all`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageNo, limit, ...(status && { status }) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch leaves");
  return data;
};


export const actionOnLeaveByAdmin = async (leaveId, { action, rejectionReason } = {}) => {
  const res = await fetch(`${API_BASE_URL}/leaves/${leaveId}/action/admin`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...(rejectionReason && { rejectionReason }) }),
    
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to action leave");
  return data;
};


export const actionOnLeaveByAreaManager = async (leaveId, { action, rejectionReason } = {}) => {
  const res = await fetch(`${API_BASE_URL}/leave/manager/action/${leaveId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...(rejectionReason && { rejectionReason }) }),
    
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to action leave");
  return data;
};