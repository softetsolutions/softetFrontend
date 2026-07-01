import { useState, useEffect, useCallback } from "react";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import { getAreas, editArea, deleteArea } from "../api/area";
import Spinner from "../genericComps/Spinner";
import { FaSearch } from "react-icons/fa";
import { Pencil, X, Check, Loader2, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const AreaList = () => {
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [deleteLoader, setDeleteLoader] = useState(null);
  const [confirmDeleteArea, setConfirmDeleteArea] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [forceDeleteArea, setForceDeleteArea] = useState(null);
  const [toast, setToast] = useState(null);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 5,
  });
  const [editingArea, setEditingArea] = useState(null);
  const [editForm, setEditForm] = useState({ name: "" });
  const [editLoader, setEditLoader] = useState(false);
  const [editError, setEditError] = useState("");
  const [filters, setFilters] = useState({ name: "", headQuarterName: "" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  const fetchAreas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAreas({
        pageNo: paginationData.currentPage,
        limit: paginationData.perPageDocument,
        name: filters.name,
        headQuarterName: filters.headQuarterName,
      });

      setAreas(Array.isArray(data) ? data : data.areas || []);
      setTotalDocuments(data.areasCount);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  }, [paginationData, filters]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);
  const openEdit = (e, area) => {
    e.stopPropagation();
    setEditingArea(area);
    setEditForm({ name: area.name });
    setEditError("");
  };

  const closeEdit = () => {
    setEditingArea(null);
    setEditForm({ name: "" });
    setEditError("");
  };

  const handleEditSubmit = async () => {
    if (!editForm.name.trim()) {
      setEditError("Area name is required.");
      return;
    }
    try {
      setEditLoader(true);
      setEditError("");
      await editArea(editingArea._id, { name: editForm.name.trim() });
      setAreas((prev) =>
        prev.map((a) =>
          a._id === editingArea._id ? { ...a, name: editForm.name.trim() } : a,
        ),
      );
      closeEdit();
    } catch (error) {
      setEditError("Failed to update. Please try again.");
    } finally {
      setEditLoader(false);
    }
  };
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async (force = false) => {
    const area = force ? forceDeleteArea?.area : confirmDeleteArea;
    console.log("handleDelete called", {
      force,
      area,
      forceDeleteArea,
      confirmDeleteArea,
    });
    if (!area) return;
    const areaId = area._id;

    try {
      setDeleteLoader(areaId);
      if (force) {
        setForceDeleteArea(null);
      } else {
        setConfirmDeleteArea(null);
      }

      const res = await deleteArea(areaId, force);
      console.log("delete response", res);

      if (res?.hasLinkedDoctors) {
        setForceDeleteArea({ area, doctorCount: res.doctorCount });
        return;
      }

      if (res?.success === false) {
        showToast(res.message, "error");
        return;
      }

      setAreas((prev) => prev.filter((a) => a._id !== areaId));
      setTotalDocuments((prev) => prev - 1);
      showToast("Area deleted successfully.", "success");
    } catch (error) {
      showToast(error.message || "Could not delete area. Try again.", "error");
    } finally {
      setDeleteLoader(null);
    }
  };
  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-hidden">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Areas</h1>
          <p className="text-gray-500 mt-1 italic">
            Manage your medical area and their information.
          </p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col min-h-0">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-medium text-gray-800">Areas List</h2>
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
              name="headQuarterName"
              value={filters.headQuarterName}
              onChange={handleFilterChange}
              placeholder="Filter by headquarter..."
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition w-48"
            />
            {(filters.name || filters.headQuarterName) && (
              <button
                onClick={() => setFilters({ name: "", headQuarterName: "" })}
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto flex-1 flex flex-col min-h-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size={40} borderWidth={4} />
              <p className="text-sm text-gray-500">Loading Areas...</p>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        HeadQuarter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {areas.length > 0 ? (
                      areas.map((area) => (
                        <tr
                          key={area._id}
                          className={`hover:bg-gray-50 transition-colors}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {area.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {area.headQuarterId.headQuarterName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => openEdit(e, area)}
                                title="Edit area"
                                className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteArea(area)}
                                title="Delete area"
                                disabled={deleteLoader === area._id}
                                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {deleteLoader === area._id ? (
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
                            No Area found.
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
                actualResultPerPage={areas.length}
                listName="Areas"
              />
            </>
          )}
        </div>
      </div>
      {editingArea && (
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
                <h2 className="text-base font-bold text-gray-900">Edit Area</h2>
              </div>
              <button
                onClick={closeEdit}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Field */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Area Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ name: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                />
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
      {confirmDeleteArea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setConfirmDeleteArea(null)}
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
                  Delete Area
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {confirmDeleteArea.name}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteArea(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(false)}
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
      {forceDeleteArea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setForceDeleteArea(null)}
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
                  Force Delete Area
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              <span className="font-semibold text-gray-900">
                {forceDeleteArea.area.name}
              </span>{" "}
              has{" "}
              <span className="font-semibold text-red-600">
                {forceDeleteArea.doctorCount} doctor(s)
              </span>{" "}
              associated with it. Deleting this area will also permanently
              delete all associated doctors.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setForceDeleteArea(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaList;
