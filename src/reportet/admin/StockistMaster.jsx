import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Pencil, X, Check, Loader2, Trash2, AlertTriangle } from "lucide-react";
import {
  getAllStockists,
  updateStockist,
  deleteStockist,
} from "../api/stockist"; // Adjust path if needed
import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import Spinner from "../genericComps/Spinner";

const StockistMaster = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [stockists, setStockists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStockist, setTotalStockist] = useState(0);
  const [editingStockist, setEditingStockist] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLoader, setEditLoader] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteLoader, setDeleteLoader] = useState(null);
  const [confirmDeleteStockist, setConfirmDeleteStockist] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    state: "",
    address: "",
    headQuarter: "",
  });
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 5,
  });

  useEffect(() => {
    if (
      totalStockist > 0 &&
      paginationData.currentPage >
        Math.ceil(totalStockist / paginationData.perPageDocument)
    ) {
      setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [totalStockist]);

  // Fetch stockists from API
  useEffect(() => {
    const fetchStockists = async (abortController) => {
      try {
        setLoading(true);
        const res = await getAllStockists(abortController, {
          pageNo: paginationData.currentPage,
          limit: paginationData.perPageDocument,
          name: filters.name,
          state: filters.state,
          address: filters.address,
          headQuarter: filters.headQuarter,
        });
        setStockists(res?.data);
        setTotalStockist(res?.stockistCount);
      } catch (error) {
        console.error("Error fetching stockists:", error);
      } finally {
        setLoading(false);
      }
    };

    const abortController = new AbortController();
    fetchStockists(abortController);
  }, [paginationData, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Filter stockists based on search term
  // const filteredStockists = stockists.filter(
  //   (stockist) =>
  //     stockist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     stockist.address
  //       ?.toLowerCase()
  //       .includes(searchTerm.toLocaleLowerCase()) ||
  //     stockist.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     stockist.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  // );
  const openEdit = (stockist) => {
    setEditingStockist(stockist);
    setEditName(stockist.name);
    setEditError("");
  };

  const closeEdit = () => {
    setEditingStockist(null);
    setEditName("");
    setEditError("");
  };

  const handleEditSubmit = async () => {
    if (!editName.trim()) {
      setEditError("Stockist name is required.");
      return;
    }
    try {
      setEditLoader(true);
      setEditError("");
      await updateStockist(editingStockist._id, { name: editName.trim() });
      setStockists((prev) =>
        prev.map((s) =>
          s._id === editingStockist._id ? { ...s, name: editName.trim() } : s,
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

  const handleDelete = async () => {
    const stockistId = confirmDeleteStockist._id;
    try {
      setDeleteLoader(stockistId);
      setConfirmDeleteStockist(null);
      await deleteStockist(stockistId);
      setStockists((prev) => prev.filter((s) => s._id !== stockistId));
      setTotalStockist((prev) => prev - 1);
      showToast("Stockist deleted successfully.", "success");
    } catch (error) {
      showToast(
        error.message || "Could not delete stockist. Try again.",
        "error",
      );
    } finally {
      setDeleteLoader(null);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col max-h-full">
      {/* Header Section */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Stockist Master
          </h1>
          <p className="text-gray-500 mt-1 italic">
            Manage your stockists and their details.
          </p>
        </div>
      </header>

      {/* Stockist List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">Stockists List</h2>
          {/* <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search stockists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
              />
            </div>
          </div> */}
        </div>

        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by name..."
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition w-56"
            />
          </div>

          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition text-gray-600 w-44"
          >
            <option value="">All States</option>
            {[...new Set(stockists.map((s) => s.state).filter(Boolean))].map(
              (state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ),
            )}
          </select>

          <select
            name="address"
            value={filters.address}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition text-gray-600 w-44"
          >
            <option value="">All Addresses</option>
            {[...new Set(stockists.map((s) => s.address).filter(Boolean))].map(
              (address) => (
                <option key={address} value={address}>
                  {address}
                </option>
              ),
            )}
          </select>

          <select
            name="headQuarter"
            value={filters.headQuarter}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition text-gray-600 w-44"
          >
            <option value="">All Headquarters</option>
            {[
              ...new Map(
                stockists
                  .filter((s) => s.headQuarter?._id)
                  .map((s) => [s.headQuarter._id, s.headQuarter]),
              ).values(),
            ].map((hq) => (
              <option key={hq._id} value={hq._id}>
                {hq.headQuarterName}
              </option>
            ))}
          </select>

          {(filters.name ||
            filters.state ||
            filters.address ||
            filters.headQuarter) && (
            <button
              onClick={() =>
                setFilters({
                  name: "",
                  state: "",
                  address: "",
                  headQuarter: "",
                })
              }
              className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition"
            >
              Clear
            </button>
          )}
        </div>
        {/* Stockist Table */}
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size={40} borderWidth={4} />
              <p className="text-sm text-gray-500">Loading stockists...</p>
            </div>
          ) : (
            <>
              <div className="max-h-4/5 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Headquarter Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockists.length > 0 ? (
                      stockists.map((stockist) => (
                        <tr key={stockist._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {stockist.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stockist.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stockist.state}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stockist?.headQuarter?.headQuarterName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEdit(stockist)}
                                title="Edit stockist"
                                className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmDeleteStockist(stockist)
                                }
                                title="Delete stockist"
                                disabled={deleteLoader === stockist._id}
                                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {deleteLoader === stockist._id ? (
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
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No stockists found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationComp
                totalDocuments={totalStockist}
                perPageDocument={paginationData.perPageDocument}
                currentPage={paginationData.currentPage}
                paginationHandler={setPaginationData}
                actualResultPerPage={stockists.length}
                listName="Stockist"
              />
            </>
          )}
        </div>
      </div>
      {editingStockist && (
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
                  Edit Stockist
                </h2>
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
                  Stockist Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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
      {confirmDeleteStockist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setConfirmDeleteStockist(null)}
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
                  Delete Stockist
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {confirmDeleteStockist.name}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteStockist(null)}
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

export default StockistMaster;
