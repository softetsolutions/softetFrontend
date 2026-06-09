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

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

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
      });
      console.log("Employee list is", data);
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
  }, [paginationData]);

  // Filter MRs based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  console.log("filteredEmployees", filteredEmployees);

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

      {/* MR List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col">
        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">Employee List</h2>
          {/* <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search MRs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
            />
          </div> */}
        </div>

        {/* MR Table */}
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              Loading employees...
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
                        <button>
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
