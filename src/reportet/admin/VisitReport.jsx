import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  organizationDailyVisitList,
  updateDailyVisit,
  deleteDailyVisit,
} from "../api/api";
import { getEmployeeListOptions } from "../api/employee";
import { roleMaper } from "../utils/mappers";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import { formatDate } from "../utils/helperFunctions";
import Spinner from "../genericComps/Spinner";
import { Pencil, Trash2 } from "lucide-react";

const VisitReport = () => {
  const [employees, setEmployees] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editRemark, setEditRemark] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
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

  const getDailyVisitList = useCallback(
    async (abortController, payloadParams) => {
      try {
        setLoading(true);
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
        const visitReport = await organizationDailyVisitList(
          abortController,
          payload,
        );
        setReportData(visitReport?.data);
        setTotalDocuments(visitReport?.dailyVistListCount);
      } catch (error) {
        if (error.name === "AbortError") {
          console.error("Request was cancelled");
          return;
        }

        console.error("Problem in fetching daily visit list org wise", error);
        toast.error("Unable to get the daily visit list, Pls try again later");
      } finally {
        setLoading(false);
        setBtnLoading(false);
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
    setBtnLoading(true);
    setFilterApplied((prev) => !prev);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const abortControllerTwo = new AbortController();
    getDailyVisitList(abortController);
    getEmployeeOption(abortControllerTwo);
    return () => abortController.abort();
  }, [getDailyVisitList]);

  const handleEdit = async () => {
    if (!editRemark.trim()) {
      toast.error("Remark cannot be empty");
      return;
    }
    try {
      const res = await updateDailyVisit(editModal._id, { remark: editRemark });
      if (res.success) {
        toast.success("Visit updated");
        setEditModal(null);
        setFilterApplied((prev) => !prev);
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteDailyVisit(deleteConfirmId);
      if (res.success) {
        toast.success("Visit deleted");
        setDeleteConfirmId(null);
        setFilterApplied((prev) => !prev);
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (e) {
      toast.error("Delete failed");
    }
  };
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
              disabled={btnLoading}
              className="bg-blue-900 text-white rounded w-full py-2.5 cursor-pointer disabled:opacity-60 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {btnLoading && (
                <Spinner
                  size={16}
                  borderWidth={2}
                  className="border-white border-t-transparent"
                />
              )}
              {btnLoading ? "Applying" : "Apply"}
            </button>
          </div>
        </div>
        {/* Report Table */}
      </div>

      <div className="space-y-4 bg-white  rounded-lg shadow-md mt-3 flex-1">
        <div className="mt-3 p-2 overflow-x-auto h-full">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-10">
              <Spinner size={40} borderWidth={4} />
              <p className="text-gray-500 text-sm">Loading Visit report...</p>
            </div>
          ) : reportData?.length > 0 ? (
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
                        Areas Visited
                      </th>

                      <th className=" border-gray-300 px-3 py-2 text-left">
                        Doctors Visited
                      </th>

                      <th className=" border-gray-300 px-3 py-2 text-left">
                        Visit Date
                      </th>

                      <th className=" border-gray-300 px-3 py-2 text-left">
                        With
                      </th>

                      <th className=" border-gray-300 px-3 py-2 text-left">
                        Remark
                      </th>
                      <th className="border-gray-300 px-3 py-2 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((report) => (
                      <tr key={report._id} className="hover:bg-gray-50">
                        <td className=" border-gray-300 px-3 py-2">
                          {report?.employeeId?.firstName +
                            " " +
                            report?.employeeId?.lastName +
                            ""}
                        </td>
                        <td className=" border-gray-300 px-3 py-2">
                          {roleMaper[report?.employeeId?.role]}
                        </td>
                        <td className=" border-gray-300 px-3 py-2">
                          {report?.areaId?.map((area) => (
                            <div key={area?._id}>{area?.name}</div>
                          ))}
                        </td>
                        <td className=" border-gray-300 px-3 py-2">
                          {report?.doctorId?.map((doctor) => (
                            <div key={doctor?._id}>{doctor?.name}</div>
                          ))}
                        </td>

                        <td className=" border-gray-300 px-3 py-2">
                          {formatDate(report?.visitDate)}
                        </td>

                        <td className=" border-gray-300 px-3 py-2">
                          {report?.assistedBy || "-"}
                        </td>
                        <td className=" border-gray-300 px-3 py-2">
                          {report.remark}
                        </td>
                        <td className="border-gray-300 px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditModal(report);
                                setEditRemark(report.remark);
                              }}
                              className="p-1 rounded hover:bg-blue-50 text-blue-600"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(report._id)}
                              className="p-1 rounded hover:bg-red-50 text-red-500"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
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
                actualResultPerPage={reportData?.length}
                listName="Reports"
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg font-medium">
                No Visit Found
              </p>
            </div>
          )}

          {editModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Edit Remark
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  {editModal.employeeId?.firstName} —{" "}
                  {formatDate(editModal.visitDate)}
                </p>
                <textarea
                  value={editRemark}
                  onChange={(e) => setEditRemark(e.target.value)}
                  className="border rounded w-full px-3 py-2 text-sm mb-4 resize-none"
                  rows={3}
                  placeholder="Enter remark"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditModal(null)}
                    className="px-4 py-2 text-sm rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 text-sm rounded bg-blue-900 text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {deleteConfirmId && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Confirm Delete
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  This visit record will be permanently deleted.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 text-sm rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitReport;
