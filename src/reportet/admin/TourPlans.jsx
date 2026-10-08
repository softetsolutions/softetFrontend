import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { Calendar, Check, Clock, Map, X } from "lucide-react";
import { getSubordinateTourPlans } from "../api/tourPlan";
import { getAllHeadQuartersNames } from "../api/headQuarter";
import TourPlanDetailModal from "../modals/TourPlanDetailModal";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import { formatDate } from "../utils/helperFunctions";
import Spinner from "../genericComps/Spinner";

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "submitted", label: "Submitted" },
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "mr", label: "MR" },
  { value: "areaManager", label: "Area Manager" },
  { value: "zonalManager", label: "Zonal Manager" },
];

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

const STATUS_BADGE = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

const STATUS_ICON = {
  draft: null,
  submitted: <Clock size={12} />,
  approved: <Check size={12} />,
  rejected: <X size={12} />,
};

const ROLE_LABELS = {
  mr: "MR",
  areaManager: "Area Manager",
  zonalManager: "Zonal Manager",
};

const monthYearLabel = (month, year) => {
  const m = MONTHS.find((item) => item.value === month);
  return `${m?.label?.slice(0, 3) || month} ${year}`;
};

const TourPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headQuarterOptions, setHeadQuarterOptions] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 10,
  });

  const [filters, setFilters] = useState({
    status: "submitted",
    month: new Date().getMonth() + 1,
    year: currentYear,
    role: "",
    search: "",
    headQuarterId: "",
  });

  useEffect(() => {
    getAllHeadQuartersNames()
      .then((data) => {
        setHeadQuarterOptions(data?.headQuarterNames || []);
      })
      .catch(() => {
        setHeadQuarterOptions([]);
      });
  }, []);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSubordinateTourPlans({
        pageNo: paginationData.currentPage,
        limit: paginationData.perPageDocument,
        ...(filters.status && { status: filters.status }),
        ...(filters.month && { month: filters.month }),
        ...(filters.year && { year: filters.year }),
        ...(filters.role && { role: filters.role }),
        ...(filters.search && { search: filters.search }),
        ...(filters.headQuarterId && { headQuarterId: filters.headQuarterId }),
      });

      setPlans(data.plans || []);
      setTotalDocuments(data.pagination?.total ?? data.plans?.length ?? 0);
    } catch (err) {
      toast.error(err.message || "Failed to fetch tour plans");
      setPlans([]);
      setTotalDocuments(0);
    } finally {
      setLoading(false);
    }
  }, [paginationData, filters]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      status: "submitted",
      month: new Date().getMonth() + 1,
      year: currentYear,
      role: "",
      search: "",
      headQuarterId: "",
    });
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  const hasActiveFilters =
    filters.status !== "submitted" ||
    filters.month !== new Date().getMonth() + 1 ||
    filters.year !== currentYear ||
    Boolean(filters.role) ||
    Boolean(filters.search) ||
    Boolean(filters.headQuarterId);

  const handleActionComplete = () => {
    fetchPlans();
  };

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-auto">
      <header className="mb-6 flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Tour Plans</h1>
          <p className="text-gray-500 mt-1 italic">
            Review monthly tour plans submitted by field employees.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-500 flex items-center gap-2">
          <Calendar size={14} className="text-blue-500" />
          {totalDocuments} plan{totalDocuments !== 1 ? "s" : ""}
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="mt-1 block w-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {STATUS_FILTERS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Month
            </label>
            <select
              value={filters.month}
              onChange={(e) =>
                handleFilterChange("month", Number(e.target.value))
              }
              className="mt-1 block w-36 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) =>
                handleFilterChange("year", Number(e.target.value))
              }
              className="mt-1 block w-28 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="mt-1 block w-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Headquarter
            </label>
            <select
              value={filters.headQuarterId}
              onChange={(e) =>
                handleFilterChange("headQuarterId", e.target.value)
              }
              className="mt-1 block w-48 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">All headquarters</option>
              {headQuarterOptions.map((hq) => (
                <option key={hq._id} value={hq._id}>
                  {hq.headQuarterName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name / ID
            </label>
            <div className="relative mt-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search employee..."
                className="pl-8 pr-3 py-2 w-48 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-md transition"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Spinner size={40} borderWidth={4} />
            <p className="text-sm text-gray-400">Loading tour plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
            <Map size={28} className="text-gray-300" />
            <p className="text-sm">No tour plans found for these filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Employee",
                      "Employee ID",
                      "Role",
                      "Month",
                      "Status",
                      "Planned Days",
                      "Submitted",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {plans.map((plan) => {
                    const emp = plan.employee;
                    return (
                      <tr
                        key={plan._id}
                        onClick={() => setSelectedPlanId(plan._id)}
                        className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                          {emp?.displayName ||
                            `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {emp?.employeeId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {ROLE_LABELS[emp?.role] || emp?.role}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {monthYearLabel(plan.month, plan.year)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              STATUS_BADGE[plan.status] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {STATUS_ICON[plan.status]}
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {plan.summary?.plannedDaysCount ?? 0} /{" "}
                          {plan.summary?.totalWorkingDays ?? 0}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {plan.submittedAt
                            ? formatDate(plan.submittedAt)
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalDocuments > 0 && (
              <div className="p-4 border-t border-gray-100">
                <PaginationComp
                  totalDocuments={totalDocuments}
                  perPageDocument={paginationData.perPageDocument}
                  currentPage={paginationData.currentPage}
                  paginationHandler={setPaginationData}
                  actualResultPerPage={plans.length}
                  listName="Tour Plans"
                />
              </div>
            )}
          </>
        )}
      </div>

      {selectedPlanId && (
        <TourPlanDetailModal
          planId={selectedPlanId}
          onClose={() => setSelectedPlanId(null)}
          onActionComplete={handleActionComplete}
        />
      )}
    </div>
  );
};

export default TourPlans;
