import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { getAllMrs } from "../api/mr"; // your MR API file
import MrDialogBox from "../../components/MrDialogBox";
import TableList from "../genericComps/tableList/TableList";
import { getEmployeeList } from "../api/employee";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import { formatDate } from "../utils/helperFunctions";
import { PhoneCall, Pencil } from "lucide-react";
import Spinner from "../genericComps/Spinner";

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    fromDate: "",
    toDate: "",
  });

  const [selectedMR, setSelectedMR] = useState(null);

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 5,
  });

  const fetchEmployees = async (paginationData) => {
    try {
      setLoading(true);
      const data = await getEmployeeList({
        pageNo: paginationData.currentPage,
        limit: paginationData.perPageDocument,
        name: filters.name,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
      setEmployees(data.employees || []);
      setTotalEmployees(data?.employeeCount || 0);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(paginationData);
  }, [paginationData, filters]);

  // Filter MRs based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };
  return (
    <div className="bg-gray-100 flex flex-col h-full">
      <MrDialogBox
        open={openDialog}
        close={() => setOpenDialog(false)}
        firstName={selectedMR?.firstName}
        lastName={selectedMR?.lastName}
        username={selectedMR?.userName}
        email={selectedMR?.email ? selectedMR?.email : "Not available"}
        password={selectedMR?.password}
        mr={selectedMR}
      />

      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Employee List
          </h1>
          <p className="text-gray-500 mt-1 italic">
            Manage your Medical Representatives.
          </p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h2 className="text-xl font-medium text-gray-800">Employee List</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search by name..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition w-48"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-500 whitespace-nowrap">
                From
              </label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-500 whitespace-nowrap">
                To
              </label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
            </div>

            {(filters.name || filters.fromDate || filters.toDate) && (
              <button
                onClick={() =>
                  setFilters({ name: "", fromDate: "", toDate: "" })
                }
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {/* MR Table */}
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size={40} borderWidth={4} />
              <p className="text-sm text-gray-500">Loading Employees...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned HeadQuarter
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee info
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.email || "Not available"}
                      </td>

                      <td className="relative px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <TableList
                          list={
                            employee.assignedHeadQuarters.map(
                              (list) => list?.headQuarterName,
                            ) || []
                          }
                        />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <PhoneCall size={16} />{" "}
                          <span>{employee.phoneNumber}</span>
                        </div>
                        <div>Joined:- {formatDate(employee.createdAt)}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent("switch-tab", {
                                detail: {
                                  tabId: "profile",
                                  employeeId: employee.employeeId,
                                },
                              }),
                            );
                          }}
                        >
                          <Pencil />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No Employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <PaginationComp
          totalDocuments={totalEmployees}
          perPageDocument={paginationData.perPageDocument}
          currentPage={paginationData.currentPage}
          paginationHandler={setPaginationData}
          actualResultPerPage={employees.length}
          listName="Employees"
        />
      </div>
    </div>
  );
};

export default EmployeeList;
