export const WEEKDAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const formatINR = (amount) => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

export const monthLabel = (month, year) => {
  const m = MONTHS.find((x) => x.value === Number(month));
  return `${m?.label || month} ${year}`;
};

export const runStatusClass = (status) => {
  switch (status) {
    case "finalized":
      return "bg-green-100 text-green-700";
    case "draft":
      return "bg-amber-100 text-amber-700";
    case "onHold":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const payslipStatusClass = (status) => {
  switch (status) {
    case "finalized":
      return "bg-green-100 text-green-700";
    case "draft":
      return "bg-blue-100 text-blue-700";
    case "onHold":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const employeeDisplayName = (emp) => {
  if (!emp) return "—";
  if (typeof emp === "string") return emp;
  if (emp.displayName) return emp.displayName;
  const name = `${emp.firstName || ""} ${emp.lastName || ""}`.trim();
  return name || emp.employeeId || "—";
};

export const sumLineItems = (items) =>
  (items || []).reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
