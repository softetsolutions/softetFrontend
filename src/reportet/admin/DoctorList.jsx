import toast from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { FaFileImport } from "react-icons/fa";
import Spinner from "../genericComps/Spinner";

import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import { Pencil, X, Check, Loader2, Trash2, AlertTriangle } from "lucide-react";
import {
  getAllDoctors,
  importDoctorsFromExcel,
  editDoctor,
  deleteDoctor,
  getAllAreasForDropdown,
} from "../api/doctor";

const DoctorsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", specialty: "" });
  const [editLoader, setEditLoader] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteLoader, setDeleteLoader] = useState(null);
  const [confirmDeleteDoctor, setConfirmDeleteDoctor] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    specialty: "",
    areaId: "",
  });
  const [areaOptions, setAreaOptions] = useState([]);
  const [areaOptionsLoader, setAreaOptionsLoader] = useState(false);

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
        name: filters.name,
        specialty: filters.specialty,
      });

      setDoctors(Array.isArray(data) ? data : data.doctors || []);
      setTotalDocuments(data.doctorsCount);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  }, [paginationData, filters]);

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
  // const filteredDoctors = doctors.filter(
  //   (doctor) =>
  //     doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()),
  // );
  const openEdit = async (e, doctor) => {
    e.stopPropagation();
    console.log("doctor.areaId:", doctor.areaId);
    setEditingDoctor(doctor);
    setEditForm({
      name: doctor.name,
      specialty: doctor.specialty || "",
      areaId: doctor.areaId || "",
    });
    setEditError("");

    try {
      setAreaOptionsLoader(true);
      const areas = await getAllAreasForDropdown();
      setAreaOptions(areas);
      const currentArea = areas.find(
        (a) => a._id?.toString() === doctor.areaId?.toString(),
      );
      setEditForm((prev) => ({
        ...prev,
        areaId: currentArea ? currentArea._id : "",
      }));
    } catch {
      setAreaOptions([]);
    } finally {
      setAreaOptionsLoader(false);
    }
  };

  const closeEdit = () => {
    setEditingDoctor(null);
    setEditForm({ name: "", specialty: "", areaId: "" });
    setEditError("");
    setAreaOptions([]);
  };

  const handleEditSubmit = async () => {
    if (!editForm.name.trim()) {
      setEditError("Doctor name is required.");
      return;
    }
    try {
      setEditLoader(true);
      setEditError("");
      await editDoctor(editingDoctor._id, {
        name: editForm.name.trim(),
        specialty: editForm.specialty.trim(),
        ...(editForm.areaId && { areaId: editForm.areaId }),
      });
      setDoctors((prev) =>
        prev.map((d) =>
          d._id === editingDoctor._id
            ? {
                ...d,
                name: editForm.name.trim(),
                specialty: editForm.specialty.trim(),
              }
            : d,
        ),
      );
      closeEdit();
    } catch (error) {
      setEditError("Failed to update. Please try again.");
    } finally {
      setEditLoader(false);
    }
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async () => {
    const doctorId = confirmDeleteDoctor._id;
    try {
      setDeleteLoader(doctorId);
      setConfirmDeleteDoctor(null);
      await deleteDoctor(doctorId);
      setDoctors((prev) => prev.filter((d) => d._id !== doctorId));
      setTotalDocuments((prev) => prev - 1);
      showToast("Doctor deleted successfully.", "success");
    } catch (error) {
      showToast(
        error.message || "Could not delete doctor. Try again.",
        "error",
      );
    } finally {
      setDeleteLoader(null);
    }
  };
  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-hidden">
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
      <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col min-h-0">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-medium text-gray-800">Doctors List</h2>
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
            <input
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              placeholder="Filter by specialty..."
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition w-48"
            />
            {(filters.name || filters.specialty) && (
              <button
                onClick={() => setFilters({ name: "", specialty: "" })}
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Doctor Table */}
        <div className="overflow-x-auto flex-1 flex flex-col min-h-0">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.length > 0 ? (
                      doctors.map((doctor) => (
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => openEdit(e, doctor)}
                                title="Edit doctor"
                                className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteDoctor(doctor)}
                                title="Delete doctor"
                                disabled={deleteLoader === doctor._id}
                                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {deleteLoader === doctor._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">
                          <div className="flex items-center justify-center h-64 text-sm text-gray-500">
                            No Doctor found.
                          </div>
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
      {editingDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={closeEdit}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-base font-bold text-gray-900">
                  Edit Doctor
                </h2>
              </div>
              <button
                onClick={closeEdit}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Doctor Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Specialty
                </label>
                <input
                  type="text"
                  value={editForm.specialty}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      specialty: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Area
                  </label>
                  {areaOptionsLoader ? (
                    <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Loading areas...
                    </div>
                  ) : (
                    <select
                      value={editForm.areaId}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          areaId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                    >
                      <option value="">— Select area —</option>
                      {areaOptions.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                          {area.headQuarterId?.headQuarterName
                            ? ` (${area.headQuarterId.headQuarterName})`
                            : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              {editError && (
                <p className="text-xs text-red-500 font-medium">{editError}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeEdit}
                disabled={editLoader}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={editLoader}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {editLoader ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDeleteDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setConfirmDeleteDoctor(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Delete Doctor
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {confirmDeleteDoctor.name}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteDoctor(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

export default DoctorsList;
