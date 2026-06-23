import toast from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { FaFileImport } from "react-icons/fa";
import Spinner from "../genericComps/Spinner";

import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import { getAllDoctors, importDoctorsFromExcel } from "../api/doctor";

const DoctorsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const [totalDocuments, setTotalDocuments] = useState(0);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 5,
  });

  // Fetch doctors from API
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllDoctors({
        pageNo: paginationData.currentPage,
        limit: paginationData.perPageDocument,
      });

      setDoctors(Array.isArray(data) ? data : data.doctors || []);
      setTotalDocuments(data.doctorsCount);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  }, [paginationData]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Handle file import
  // const handleImport = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setImporting(true);
  //   try {
  //     const newDoctors = await importDoctorsFromExcel(file);
  //     toast.success(newDoctors.message);

  //     // refresh doctor list
  //     await fetchDoctors();
  //   } catch (err) {
  //     toast.error("Failed to import doctors");
  //     console.error(err);
  //   } finally {
  //     setImporting(false);
  //     e.target.value = ""; // reset file input
  //   }
  // };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-gray-100 flex flex-col h-full">
      {/* Header Section */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Doctors</h1>
          <p className="text-gray-500 mt-1 italic">
            Manage your medical staff and their information.
          </p>
        </div>
      </header>

      {/* Doctor List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        {/* Import Button */}
        {/* <label className="bg-green-600 w-fit text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 flex items-center gap-2">
          <FaFileImport />
          {importing ? "Importing..." : "Import Excel"}
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImport}
            className="hidden"
          />
        </label> */}
        {/* <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">Doctors List</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
              />
            </div>
          </div>
        </div> */}

        {/* Doctor Table */}
        <div className="overflow-x-auto h-full flex flex-col ">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size={40} borderWidth={4} />
              <p className="text-sm text-gray-500">Loading Doctors...</p>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doctor) => (
                        <tr
                          key={doctor._id}
                          className={`hover:bg-gray-50 transition-colors}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {doctor.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doctor.specialty}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No doctors found.
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
                actualResultPerPage={doctors.length}
                listName="Doctors"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
