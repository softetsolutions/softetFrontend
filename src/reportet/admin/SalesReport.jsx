import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { organizationSalesList } from "../api/sale";
import { getEmployeeListOptions } from "../api/employee";
import { roleMaper } from "../utils/mappers";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import { formatDate } from "../utils/helperFunctions";
import { ChevronDown } from "lucide-react";
import Spinner from "../genericComps/Spinner";

const ALL_MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const currentYear = new Date().getFullYear();
const ALL_YEARS = [currentYear];

const SaleReport = () => {
  const [employees, setEmployees] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [load, setLoad] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [reportFilters, setReportFilters] = useState({
    employee: "",
    months: [...ALL_MONTHS],
    years: [currentYear],
  });
  const [filterApplied, setFilterApplied] = useState(false);

  const [totalDocuments, setTotalDocuments] = useState(0);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 10,
  });
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const monthDropdownRef = useRef(null);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef(null);

  const getSalesList = useCallback(
    async (abortController, payloadParams) => {
      try {
        setTableLoading(true);
        const payload = {
          ...(reportFilters?.employee && {
            employeeId: reportFilters?.employee,
          }),
          months: reportFilters.months,
          years: reportFilters.years,
          pageNo: paginationData?.currentPage,
          limit: paginationData?.perPageDocument,
          ...payloadParams,
        };
        const saleReport = await organizationSalesList(
          abortController,
          payload,
        );
        setSaleData(saleReport?.data);
        setTotalDocuments(saleReport?.saleCount);
      } catch (error) {
        if (error.name === "AbortError") {
          console.error("Request was cancelled");
          return;
        }

        console.error("Problem in fetching daily visit list org wise", error);
        toast.error("Unable to get the daily visit list, Pls try again later");
      } finally {
        setTableLoading(false);
        setLoad(false);
      }
    },
    [
      paginationData?.currentPage,
      paginationData?.perPageDocument,
      filterApplied,
    ],
  ); // pls do not add the dependency of filters here as we have to apply filter when the user hit apply button

  const getEmployeeOption = async (abortController) => {
    try {
      const employees = await getEmployeeListOptions(abortController);
      const employeeOptions = employees?.data?.map((employee) => ({
        employeeName: employee?.firstName + " " + employee?.lastName,
        employeeId: employee?._id,
      }));
      setEmployees(employeeOptions);
    } catch (error) {
      console.error("Unable to fetch emplyees", error);
      toast.error("Unable to fetch the employee options");
    }
  };

  const handleSearch = async () => {
    setLoad(true);
    setFilterApplied((prev) => !prev);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const abortControllerTwo = new AbortController();
    getSalesList(abortController);
    getEmployeeOption(abortControllerTwo);
    return () => abortController.abort();
  }, [getSalesList]);

  const toggleMonth = (month) => {
    setReportFilters((prev) => ({
      ...prev,
      months: prev.months.includes(month)
        ? prev.months.filter((m) => m !== month)
        : [...prev.months, month],
    }));
  };

  const toggleAllMonths = () => {
    setReportFilters((prev) => ({
      ...prev,
      months: prev.months.length === ALL_MONTHS.length ? [] : [...ALL_MONTHS],
    }));
  };

  const monthLabel = () => {
    if (reportFilters.months.length === 0) return "No months selected";
    if (reportFilters.months.length === ALL_MONTHS.length) return "All Months";
    if (reportFilters.months.length <= 2)
      return reportFilters.months
        .map((m) => m[0].toUpperCase() + m.slice(1))
        .join(", ");
    return `${reportFilters.months.length} Months Selected`;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(e.target)
      ) {
        setMonthDropdownOpen(false);
      }

      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(e.target)
      ) {
        setYearDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleYear = (year) => {
    setReportFilters((prev) => ({
      ...prev,
      years: prev.years.includes(year)
        ? prev.years.filter((y) => y !== year)
        : [...prev.years, year],
    }));
  };

  const toggleAllYears = () => {
    setReportFilters((prev) => ({
      ...prev,
      years: prev.years.length === ALL_YEARS.length ? [] : [...ALL_YEARS],
    }));
  };

  const yearLabel = () => {
    if (reportFilters.years.length === 0) return "No years selected";
    if (reportFilters.years.length === ALL_YEARS.length) return "All Years";
    if (reportFilters.years.length <= 2) return reportFilters.years.join(", ");
    return `${reportFilters.years.length} Years Selected`;
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800">SALES REPORT</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Filter and review past sales records by MR, area, date, and status.
      </p>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Select MR */}
        <div className="flex justify-between gap-3">
          <div className="flex-1">
            <label className="block" htmlFor="employee">
              Select
            </label>
            <select
              name="employee"
              value={reportFilters.employee}
              onChange={(e) =>
                setReportFilters({ ...reportFilters, employee: e.target.value })
              }
              className="border p-2 w-full rounded min-h-10.5"
            >
              <option value="">--Select MR--</option>
              {employees.map((employee) => (
                <option key={employee?.employeeId} value={employee?.employeeId}>
                  {employee?.employeeName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1" ref={monthDropdownRef}>
            <label className="block text-sm mb-1">Select Months</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMonthDropdownOpen((prev) => !prev)}
                className="w-full border p-2 rounded flex items-center justify-between text-sm bg-white"
              >
                <span
                  className={
                    reportFilters.months.length === 0 ? "text-gray-400" : ""
                  }
                >
                  {monthLabel()}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {monthDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <div
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer mb-1 border-b pb-2"
                    onClick={toggleAllMonths}
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={
                        reportFilters.months.length === ALL_MONTHS.length
                      }
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {reportFilters.months.length === ALL_MONTHS.length
                        ? "Deselect All"
                        : "Select All"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-0.5">
                    {ALL_MONTHS.map((month) => (
                      <div
                        key={month}
                        onClick={() => toggleMonth(month)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-blue-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          readOnly
                          checked={reportFilters.months.includes(month)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm capitalize">{month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1" ref={yearDropdownRef}>
            <label className="block text-sm mb-1">Select Years</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setYearDropdownOpen((prev) => !prev)}
                className="w-full border p-2 rounded flex items-center justify-between text-sm bg-white"
              >
                <span
                  className={
                    reportFilters.years.length === 0 ? "text-gray-400" : ""
                  }
                >
                  {yearLabel()}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {yearDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <div
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer mb-1 border-b pb-2"
                    onClick={toggleAllYears}
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={reportFilters.years.length === ALL_YEARS.length}
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {reportFilters.years.length === ALL_YEARS.length
                        ? "Deselect All"
                        : "Select All"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-0.5">
                    {ALL_YEARS.map((year) => (
                      <div
                        key={year}
                        onClick={() => toggleYear(year)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-blue-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          readOnly
                          checked={reportFilters.years.includes(year)}
                          className="accent-blue-600"
                        />
                        <span
                          className={`text-sm ${year === currentYear ? "font-bold text-blue-600" : ""}`}
                        >
                          {year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <button
              onClick={handleSearch}
              disabled={load}
              className="bg-blue-900 text-white rounded w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {load && (
                <Spinner
                  size={16}
                  borderWidth={2}
                  className="border-white border-t-transparent"
                />
              )}

              {load ? "Applying..." : "Apply"}
            </button>
          </div>
        </div>
        {/* Report Table */}
      </div>

      <div className="space-y-4 bg-white  rounded-lg shadow-md mt-3 flex-1">
        <div className="mt-3 p-2 overflow-x-auto h-full">
          {tableLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-10">
              <Spinner size={40} borderWidth={4} />
              <p className="text-gray-500 text-sm">Loading sales report...</p>
            </div>
          ) : saleData?.length > 0 ? (
            <>
              <div className="h-9/10 overflow-auto">
                <table className="min-w-full text-sm ">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className=" border-gray-300 px-3 py-2 text-left">
                        Name
                      </th>

                      <th className=" border-gray-300 px-3 py-2 text-left">
                        Role
                      </th>

                      <th className=" border-gray-300 px-3 py-2 text-left">
                        Stockist Name
                      </th>

                      <th className=" border-gray-300 px-3 py-2 text-left">
                        Sale Month
                      </th>

                      <th className=" border-gray-300 px-3 py-2 text-left">
                        Sale Amount
                      </th>

                      <th className=" border-gray-300 px-3 py-2 text-left">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleData.map((report) => (
                      <tr key={report._id} className="hover:bg-gray-50">
                        <td className=" border-gray-300 px-3 py-2">
                          {report?.saleBy?.firstName +
                            " " +
                            report?.saleBy?.lastName +
                            ""}
                        </td>
                        <td className=" border-gray-300 px-3 py-2">
                          {roleMaper[report?.saleBy?.role]}
                        </td>
                        <td className=" border-gray-300 px-3 py-2">
                          {report?.stockist?.name}
                        </td>
                        <td className=" border-gray-300 px-3 py-2">
                          {report?.month?.toUpperCase()}
                        </td>

                        <td className=" border-gray-300 px-3 py-2">
                          {report?.saleAmount}
                        </td>

                        <td className=" border-gray-300 px-3 py-2">
                          {formatDate(report?.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationComp
                totalDocuments={totalDocuments}
                perPageDocument={paginationData.perPageDocument}
                currentPage={paginationData.currentPage}
                paginationHandler={setPaginationData}
                actualResultPerPage={saleData?.length}
                listName="Reports"
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg font-medium">
                No Sales Found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaleReport;
