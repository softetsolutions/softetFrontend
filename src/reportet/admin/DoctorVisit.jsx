import { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { AlertTriangle, X, Check } from "lucide-react";
import Spinner from "../genericComps/Spinner";
import { getDoctorVisitReport } from "../api/api";
import { getAllHeadQuartersNames } from "../api/headQuarter";
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

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const DoctorVisitReport = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);
  const [toast, setToast] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [headQuarters, setHeadQuarters] = useState([]);
  const [maxVisits, setMaxVisits] = useState(0);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 10,
  });
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: currentYear,
    doctorName: "",
    minVisits: "",
    headQuarterId: "",
  });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDoctorVisitReport({
        month: filters.month || undefined,
        year: filters.year,
        doctorName: filters.doctorName || undefined,
        minVisits: filters.minVisits || undefined,
        headQuarterId: filters.headQuarterId || undefined,
        pageNo: paginationData.currentPage,
        limit: paginationData.perPageDocument,
      });

      if (!data.success) {
        showToast(data.message || "Failed to fetch report");
        return;
      }

      setReport(data.data || []);
      setTotalDocuments(data.pagination?.total || 0);
      if (data.maxTotalVisits !== undefined) setMaxVisits(data.maxTotalVisits);
    } catch (error) {
      showToast("Failed to fetch doctor visit report");
    } finally {
      setLoading(false);
    }
  }, [
    filters.month,
    filters.year,
    filters.minVisits,
    filters.doctorName,
    paginationData.currentPage,
    paginationData.perPageDocument,
    filters.headQuarterId,
  ]);

  useEffect(() => {
    const fetchHeadQuarters = async () => {
      try {
        const data = await getAllHeadQuartersNames();
        console.log(data);
        if (data.status) setHeadQuarters(data.headQuarterNames);
      } catch (error) {
        console.error("Failed to fetch headquarters", error);
      }
    };
    fetchHeadQuarters();
  }, []);
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // reset to page 1 on filter change
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      month: new Date().getMonth() + 1,
      year: currentYear,
      doctorName: "",
      minVisits: "",
      headQuarterId: "",
    });
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  // local doctor name filter — no API call
  // const filteredReport = filters.doctorName
  //   ? report.filter((r) =>
  //       r.doctorName?.toLowerCase().includes(filters.doctorName.toLowerCase()),
  //     )
  //   : report;

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Doctor Visit Report
          </h1>
          <p className="text-gray-500 mt-1 italic">
            View and filter doctor visit counts by month and year.
          </p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col min-h-0">
        {/* Filters Row */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-medium text-gray-800">Visit Summary</h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Doctor name local search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                name="doctorName"
                value={filters.doctorName}
                onChange={handleFilterChange}
                placeholder="Search by doctor..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition w-48"
              />
            </div>

            {/* Month select */}
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            >
              <option value="">All Months</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            {/* Year select */}
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
              name="minVisits"
              value={filters.minVisits}
              onChange={handleFilterChange}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition w-36"
            >
              <option value="">All Visits</option>
              <option value="0">Missed call (0)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3 and more</option>
            </select>
            <select
              name="headQuarterId"
              value={filters.headQuarterId}
              onChange={handleFilterChange}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            >
              <option value="">All Headquarters</option>
              {headQuarters.map((hq) => (
                <option key={hq._id} value={hq._id}>
                  {hq.headQuarterName}
                </option>
              ))}
            </select>

            {/* Clear — show when doctorName typed or month cleared */}
            {(filters.doctorName ||
              !filters.month ||
              filters.minVisits ||
              filters.headQuarterId) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
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
                        Doctor Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Visits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Headquarter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visit Dates
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.length > 0 ? (
                      report.map((row) => (
                        <tr
                          key={row.doctorId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {row.doctorName || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.specialty || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.totalVisits === 0 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"}`}
                            >
                              {row.totalVisits === 0
                                ? "Missed call"
                                : row.totalVisits}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.headQuarterName || "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {row.visitDates || "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">
                          <div className="flex items-center justify-center h-64 text-sm text-gray-500">
                            No visit data found for the selected period.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <PaginationComp
                totalDocuments={totalDocuments}
                perPageDocument={paginationData.perPageDocument}
                currentPage={paginationData.currentPage}
                paginationHandler={setPaginationData}
                actualResultPerPage={report.length}
                listName="Doctors"
              />
            </>
          )}
        </div>
      </div>

      {/* Toast */}
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

export default DoctorVisitReport;
