import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { getAllMrs } from "../api/mr"; // your MR API file
import MrDialogBox from "../../components/MrDialogBox";

const AllMR = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mrs, setMrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedMR, setSelectedMR] = useState(null);

  // Fetch all MRs
  const fetchMRs = async () => {
    try {
      setLoading(true);
      const data = await getAllMrs();
      setMrs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching MRs:", error);
      toast.error("Failed to fetch MRs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMRs();
  }, []);

  // Filter MRs based on search term
  const filteredMRs = mrs.filter(
    (mr) =>
      `${mr.firstName} ${mr.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      mr.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // To Get MR Information
  const getInfo = (mr) => {
    setSelectedMR(mr);
    setOpenDialog(true);
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
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
          <h1 className="text-3xl font-semibold text-gray-800">MRs</h1>
          <p className="text-gray-500 mt-1 italic">
            Manage your Medical Representatives.
          </p>
        </div>
      </header>

      {/* MR List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">MR List</h2>
          <div className="relative">
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
          </div>
        </div>

        {/* MR Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              Loading MRs...
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
                    MR info
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMRs.length > 0 ? (
                  filteredMRs.map((mr) => (
                    <tr
                      key={mr._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {mr.firstName} {mr.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mr.email || "Not available"}
                      </td>

                      <td>
                        <button
                          onClick={() => getInfo(mr)}
                          className="border-gray-500 border ml-5 text-sm text-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-[#155DFC] hover:text-white transition-all duration-200"
                        >
                          Profile
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
                      No MRs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllMR;
