import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { organizationSalesList } from "../api/sale";
import { getEmployeeListOptions } from "../api/employee";
import { roleMaper } from "../utils/mappers";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import { formatDate } from "../utils/helperFunctions";

const SaleReport = () => {
  const [employees, setEmployees] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [reportFilters, setReportFilters] = useState({
    employee: "",
    dateFrom: "",
    dateTo: "",
  });
  const [filterApplied, setFilterApplied] = useState(false);

  const [totalDocuments, setTotalDocuments] = useState(0);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 10,
  });

  const getSalesList = useCallback(
    async (abortController, payloadParams) => {
      try {
        const payload = {
          ...(reportFilters?.employee && {
            employeeId: reportFilters?.employee,
          }),
          ...(reportFilters?.dateFrom && { dateFrom: reportFilters?.dateFrom }),
          ...(reportFilters?.dateTo && { dateTo: reportFilters?.dateTo }),
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
    setFilterApplied((prev) => !prev);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const abortControllerTwo = new AbortController();
    getSalesList(abortController);
    getEmployeeOption(abortControllerTwo);
    return () => abortController.abort();
  }, [getSalesList]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800">VISIT REPORT</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Filter and review past visit records by MR, area, date, and status.
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
          {/* Date Between */}

          <div className="flex-1 flex gap-2">
            <div>
              <label htmlFor="from">From</label>
              <input
                name="from"
                type="date"
                value={reportFilters.dateFrom}
                onChange={(e) =>
                  setReportFilters({
                    ...reportFilters,
                    dateFrom: e.target.value,
                  })
                }
                className="border w-full p-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="to">To</label>
              <input
                name="to"
                type="date"
                value={reportFilters.dateTo}
                onChange={(e) =>
                  setReportFilters({ ...reportFilters, dateTo: e.target.value })
                }
                className="border w-full p-2 rounded"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <button
              onClick={handleSearch}
              className="bg-blue-900 text-white rounded w-full py-2.5 cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
        {/* Report Table */}
      </div>

      <div className="space-y-4 bg-white  rounded-lg shadow-md mt-3 flex-1">
        <div className="mt-3 p-2 overflow-x-auto h-full">
          {saleData?.length > 0 ? (
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
            <p className="text-gray-500 text-xs">No Visit found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaleReport;
