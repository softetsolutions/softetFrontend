import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { getCallAverageReport } from "../api/callAverageapi";

import { getAllHeadQuartersNames } from "../api/headQuarter";
import { ChevronDown } from "lucide-react";
import Spinner from "../genericComps/Spinner";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";

const CallAverageReport = () => {
  const [headquarters, setHeadquarters] = useState([]);
  const [reportData, setReportData] = useState([]);

  const [tableLoading, setTableLoading] = useState(false);
  const [load, setLoad] = useState(false);

  const [reportFilters, setReportFilters] = useState({
    headQuarterId: "",
    startDate: "",
    endDate: "",
  });
  const [filterApplied, setFilterApplied] = useState(false);

  const [hqDropdownOpen, setHqDropdownOpen] = useState(false);
  const hqDropdownRef = useRef(null);

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 10,
  });

  const getReport = useCallback(
    async (abortController) => {
      try {
        setTableLoading(true);
        const payload = {
          ...(reportFilters?.headQuarterId && {
            headQuarterId: reportFilters.headQuarterId,
          }),
          ...(reportFilters?.startDate && {
            startDate: reportFilters.startDate,
          }),
          ...(reportFilters?.endDate && { endDate: reportFilters.endDate }),
        };
        const res = await getCallAverageReport(payload, abortController);
        setReportData(res?.data || []);
        setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
      } catch (error) {
        if (error.name === "AbortError") {
          console.error("Request was cancelled");
          return;
        }
        console.error("Problem fetching call average report", error);
        toast.error(
          "Unable to get the call average report, Pls try again later",
        );
      } finally {
        setTableLoading(false);
        setLoad(false);
      }
    },

    [filterApplied],
  );

  const getHeadquarterOptions = async () => {
    try {
      const res = await getAllHeadQuartersNames();
      setHeadquarters(res?.headQuarterNames || []);
    } catch (error) {
      console.error("Unable to fetch headquarters", error);
      toast.error("Unable to fetch the headquarter options");
    }
  };

  const handleSearch = () => {
    setLoad(true);
    setFilterApplied((prev) => !prev);
  };

  useEffect(() => {
    const abortController = new AbortController();
    getReport(abortController);
    getHeadquarterOptions();
    return () => abortController.abort();
  }, [getReport]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (hqDropdownRef.current && !hqDropdownRef.current.contains(e.target)) {
        setHqDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectHeadquarter = (id) => {
    setReportFilters({ ...reportFilters, headQuarterId: id });
    setHqDropdownOpen(false);
  };

  const headquarterLabel = () => {
    if (!reportFilters.headQuarterId) return "--All Headquarters--";
    return (
      headquarters.find((hq) => hq._id === reportFilters.headQuarterId)
        ?.headQuarterName || "--All Headquarters--"
    );
  };

  const average = (row) =>
    row.workDays > 0 ? (row.totalVisits / row.workDays).toFixed(2) : "0.00";

  // Pagination derived values (client-side slice of the full dataset)
  const totalRows = reportData?.length || 0;

  const paginatedData = useMemo(() => {
    const start =
      (paginationData.currentPage - 1) * paginationData.perPageDocument;
    return reportData.slice(start, start + paginationData.perPageDocument);
  }, [reportData, paginationData]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          CALL AVERAGE REPORT
        </h2>
      </div>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Review each employee's working days, visit count, call average, sales,
        and missed doctors — filter by headquarter and date range.
      </p>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between gap-3">
          <div className="flex-1" ref={hqDropdownRef}>
            <label className="block text-sm mb-1" htmlFor="headQuarterId">
              Select Headquarter
            </label>
            <div className="relative">
              <button
                type="button"
                id="headQuarterId"
                onClick={() => setHqDropdownOpen((prev) => !prev)}
                className="w-full border p-2 rounded min-h-10.5 flex items-center justify-between text-sm bg-white"
              >
                <span
                  className={
                    !reportFilters.headQuarterId ? "text-gray-400" : ""
                  }
                >
                  {headquarterLabel()}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {hqDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-64 overflow-auto">
                  <div
                    className="flex items-center px-2 py-1.5 rounded hover:bg-blue-50 cursor-pointer"
                    onClick={() => selectHeadquarter("")}
                  >
                    <span className="text-sm">--All Headquarters--</span>
                  </div>
                  {headquarters.map((hq) => (
                    <div
                      key={hq?._id}
                      onClick={() => selectHeadquarter(hq._id)}
                      className="flex items-center px-2 py-1.5 rounded hover:bg-blue-50 cursor-pointer"
                    >
                      <span className="text-sm">{hq?.headQuarterName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-1" htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={reportFilters.startDate}
              onChange={(e) =>
                setReportFilters({
                  ...reportFilters,
                  startDate: e.target.value,
                })
              }
              className="border p-2 w-full rounded min-h-10.5"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-1" htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={reportFilters.endDate}
              onChange={(e) =>
                setReportFilters({ ...reportFilters, endDate: e.target.value })
              }
              className="border p-2 w-full rounded min-h-10.5"
            />
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
      </div>

      <div className="space-y-4 bg-white rounded-lg shadow-md mt-3 flex-1">
        <div className="mt-3 p-2 overflow-x-auto h-full">
          {tableLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-10">
              <Spinner size={40} borderWidth={4} />
              <p className="text-gray-500 text-sm">
                Loading call average report...
              </p>
            </div>
          ) : reportData?.length > 0 ? (
            <>
              <div className="h-9/10 overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border-gray-300 px-3 py-2 text-left">
                        Name
                      </th>
                      <th className="border-gray-300 px-3 py-2 text-left">
                        Headquarter
                      </th>
                      <th className="border-gray-300 px-3 py-2 text-left">
                        Work Days
                      </th>
                      <th className="border-gray-300 px-3 py-2 text-left">
                        Total Visits
                      </th>
                      <th className="border-gray-300 px-3 py-2 text-left">
                        Call Average
                      </th>
                      <th className="border-gray-300 px-3 py-2 text-left">
                        Total Sale
                      </th>
                      <th className="border-gray-300 px-3 py-2 text-left">
                        Missed Doctors
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border-gray-300 px-3 py-2">
                          {row.name}
                        </td>
                        <td className="border-gray-300 px-3 py-2">
                          {row.headQuarterName}
                        </td>
                        <td className="border-gray-300 px-3 py-2">
                          {row.workDays}
                        </td>
                        <td className="border-gray-300 px-3 py-2">
                          {row.totalVisits}
                        </td>
                        <td className="border-gray-300 px-3 py-2">
                          {average(row)}
                        </td>
                        <td className="border-gray-300 px-3 py-2">
                          {row.totalSale}
                        </td>
                        <td className="border-gray-300 px-3 py-2">
                          {row.missedDoctorCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationComp
                totalDocuments={totalRows}
                perPageDocument={paginationData.perPageDocument}
                currentPage={paginationData.currentPage}
                paginationHandler={setPaginationData}
                actualResultPerPage={paginatedData?.length}
                listName="Employees"
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg font-medium">No Data Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallAverageReport;
