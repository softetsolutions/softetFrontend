import { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { AlertTriangle, X, Check, Download } from "lucide-react";
import Spinner from "../genericComps/Spinner";
import { getLeaveReport, exportLeaveReport } from "../api/leave";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";

const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const ROLES = [
  { label: "MR", value: "mr" },
  { label: "Area Manager", value: "areaManager" },
  { label: "Zonal Manager", value: "zonalManager" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const LeaveBreakdownPopup = ({ breakdown }) => {
  if (!breakdown?.length) {
    return (
      <p className="text-xs text-gray-400 italic">No leave breakdown</p>
    );
  }

  return (
    <ul className="space-y-1">
      {breakdown.map((item) => (
        <li
          key={item.code}
          className="flex items-center justify-between gap-4 text-xs text-gray-700"
        >
          <span className="font-medium">{item.code}</span>
          <span className="text-gray-900">{item.days}</span>
        </li>
      ))}
    </ul>
  );
};

const TotalLeavesCell = ({ total, breakdown }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-default ${
          total === 0
            ? "bg-gray-50 text-gray-500"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        }`}
      >
        {total}
      </span>

      {hovered && total > 0 && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-36 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg pointer-events-none">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 mb-1.5">
            By leave type
          </p>
          <LeaveBreakdownPopup breakdown={breakdown} />
        </div>
      )}
    </div>
  );
};

const LeaveReport = () => {
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [report, setReport] = useState([]);
  const [toast, setToast] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 10,
  });
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: currentYear,
    employeeName: "",
    role: "mr",
  });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLeaveReport({
        month: filters.month,
        year: filters.year,
        employeeName: filters.employeeName || undefined,
        role: filters.role || undefined,
        pageNo: paginationData.currentPage,
        limit: paginationData.perPageDocument,
      });

      if (!data.success) {
        showToast(data.message || "Failed to fetch report");
        return;
      }

      setReport(data.data || []);
      setTotalDocuments(data.pagination?.total || 0);
    } catch {
      showToast("Failed to fetch leave report");
    } finally {
      setLoading(false);
    }
  }, [
    filters.month,
    filters.year,
    filters.employeeName,
    filters.role,
    paginationData.currentPage,
    paginationData.perPageDocument,
  ]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      month: new Date().getMonth() + 1,
      year: currentYear,
      employeeName: "",
      role: "mr",
    });
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await exportLeaveReport({
        month: filters.month,
        year: filters.year,
        employeeName: filters.employeeName || undefined,
        role: filters.role || undefined,
      });
      showToast("Report exported successfully", "success");
    } catch (error) {
      showToast(error.message || "Failed to export report");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-hidden">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Leave Report</h1>
          <p className="text-gray-500 mt-1 italic">
            View approved leave days by employee for the selected month and
            year.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exportLoading || loading || report.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {exportLoading ? (
            <Spinner
              size={16}
              borderWidth={2}
              className="border-white border-t-transparent"
            />
          ) : (
            <Download size={16} />
          )}
          {exportLoading ? "Exporting..." : "Export to Excel"}
        </button>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col min-h-0">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-medium text-gray-800">Leave Summary</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                name="employeeName"
                value={filters.employeeName}
                onChange={handleFilterChange}
                placeholder="Search by employee..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition w-48"
              />
            </div>

            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            >
              <option value="">All Roles</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            {(filters.employeeName || filters.role !== "mr") && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto flex-1 flex flex-col min-h-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size={40} borderWidth={4} />
              <p className="text-sm text-gray-500">Loading report...</p>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manager Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Leaves Taken
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.length > 0 ? (
                      report.map((row) => (
                        <tr
                          key={row.employeeId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {row.employeeName || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.managerName || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <TotalLeavesCell
                              total={row.totalLeaves}
                              breakdown={row.leaveBreakdown}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">
                          <div className="flex items-center justify-center h-64 text-sm text-gray-500">
                            No leave data found for the selected period.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <PaginationComp
                totalDocuments={totalDocuments}
                perPageDocument={paginationData.perPageDocument}
                currentPage={paginationData.currentPage}
                paginationHandler={setPaginationData}
                actualResultPerPage={report.length}
                listName="Employees"
              />
            </>
          )}
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
          ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
          <button
            onClick={() => setToast(null)}
            className="ml-2 opacity-50 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveReport;
