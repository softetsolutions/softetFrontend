import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
  Pencil,
  X,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  getAllHeadquartersData,
  editHeadQuarter,
  deleteHeadQuarter,
} from "../api/headQuarter";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";

// let headQuarterListingStructure = [
//     {
//       id: Date.now(),
//       name: "North American HQ",
//       location: "New York City, USA",
//       areas: [
//         {
//           id: Date.now() + 1,
//           name: "Northeast Clinical Region",
//           doctors: [
//             { id: 101, name: "Dr. Sarah Jenkins", specialty: "Oncology" },
//             { id: 102, name: "Dr. Marcus Thorne", specialty: "Cardiology" },
//           ],
//         },
//       ],
//     },
//   ]

const HeadQuarterListing = () => {
  // Bound to your provided state structure
  const [headquarters, setHeadquarters] = useState([]);

  const [expandedHq, setExpandedHq] = useState(null);
  const [expandedArea, setExpandedArea] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [filters, setFilters] = useState({ headQuarterName: "", location: "" });

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 5,
  });
  const [loader, setLoader] = useState(false);
  const [editingHq, setEditingHq] = useState(null);
  const [editForm, setEditForm] = useState({
    headQuarterName: "",
    location: "",
  });
  const [editLoader, setEditLoader] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteLoader, setDeleteLoader] = useState(null);

  // Helper to calculate totals from nested state
  const getTotals = (hq) => {
    const areaCount = hq.areas.length;
    const doctorCount = hq.areas.reduce(
      (acc, area) => acc + area.doctors.length,
      0,
    );
    return { areaCount, doctorCount };
  };

  useEffect(() => {
    (async () => {
      try {
        setLoader(true);
        const headQuartersDetails = await getAllHeadquartersData({
          pageNo: paginationData.currentPage,
          perPageDocument: paginationData.perPageDocument,
          headQuarterName: filters.headQuarterName,
          location: filters.location,
        });
        const newHeadQuarterDetailsState =
          headQuartersDetails?.data[0]?.headQuarterDetail?.map(
            (headQuarter) => {
              const areaWiseDoctor = {};

              headQuarter?.allDoctors?.forEach((currentValue) => {
                currentValue = {
                  id: currentValue._id,
                  name: currentValue.name,
                  specialty: currentValue.specialty,
                  areaId: currentValue.areaId,
                };
                if (areaWiseDoctor[currentValue.areaId]) {
                  areaWiseDoctor[currentValue.areaId].push(currentValue);
                } else {
                  areaWiseDoctor[currentValue.areaId] = [currentValue];
                }
              });

              return {
                id: headQuarter._id,
                name: headQuarter.headQuarterName,
                location: headQuarter.location,
                areas: headQuarter.areas.map((area) => {
                  return {
                    id: area._id,
                    name: area.name,
                    doctors: areaWiseDoctor[area._id] || [],
                  };
                }),
              };
            },
          );
        setHeadquarters(newHeadQuarterDetailsState);
        setTotalDocuments(
          headQuartersDetails?.data[0]?.totalCount[0]?.totalHeadquarters,
        );
        setLoader(false);
      } catch (error) {
        setLoader(false);
        console.error("Error in fetching the headQuarterlist", error);
      }
    })();
  }, [paginationData, filters]);

  const openEdit = (e, hq) => {
    e.stopPropagation();
    setEditingHq(hq);
    setEditForm({ headQuarterName: hq.name, location: hq.location });
    setEditError("");
  };

  const closeEdit = () => {
    setEditingHq(null);
    setEditForm({ headQuarterName: "", location: "" });
    setEditError("");
  };

  const handleEditSubmit = async () => {
    if (!editForm.headQuarterName.trim()) {
      setEditError("Headquarter name is required.");
      return;
    }
    try {
      setEditLoader(true);
      setEditError("");
      await editHeadQuarter(editingHq.id, {
        headQuarterName: editForm.headQuarterName.trim(),
        location: editForm.location.trim(),
      });
      setHeadquarters((prev) =>
        prev.map((hq) =>
          hq.id === editingHq.id
            ? {
                ...hq,
                name: editForm.headQuarterName.trim(),
                location: editForm.location.trim(),
              }
            : hq,
        ),
      );
      closeEdit();
    } catch (error) {
      setEditError("Failed to update. Please try again.");
    } finally {
      setEditLoader(false);
    }
  };
  const handleDelete = async (e, hqId) => {
    e.stopPropagation();

    try {
      setDeleteLoader(hqId);
      await deleteHeadQuarter(hqId);
      setHeadquarters((prev) => prev.filter((hq) => hq.id !== hqId));
      setTotalDocuments((prev) => prev - 1);
    } catch (error) {
      console.error("Delete headquarter error:", error);
    } finally {
      setDeleteLoader(null);
    }
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="flex flex-col gap-2 h-full  w-full max-w-5xl mx-auto space-y-4 bg-[#f7f9fb] font-inter antialiased text-slate-900">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
        <h1 className="text-2xl pl-2 font-bold text-slate-900">
          Network Directory
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="headQuarterName"
              value={filters.headQuarterName}
              onChange={handleFilterChange}
              placeholder="Search by name..."
              className="pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-100 outline-none w-52 shadow-sm"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Filter by location..."
              className="pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-100 outline-none w-52 shadow-sm"
            />
          </div>

          {(filters.headQuarterName || filters.location) && (
            <button
              onClick={() => setFilters({ headQuarterName: "", location: "" })}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-md transition"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {loader && (
        <div
          style={{ height: "calc(100% - 106px)", overflow: "auto" }}
          className="flex flex-col justify-center items-center gap-3"
        >
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading HeadQuarters...</p>
        </div>
      )}

      {/* Main Listing Section */}
      {!loader && (
        <div style={{ height: "calc(100% - 106px)", overflow: "auto" }}>
          {headquarters.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-2">
              <Building2 className="w-10 h-10" />
              <p className="text-sm font-medium">No Headquarters found.</p>
            </div>
          )}
          {headquarters.map((hq) => {
            const { areaCount, doctorCount } = getTotals(hq);
            return (
              <div
                key={hq.id}
                className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Headquarter Row */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() =>
                    setExpandedHq(expandedHq === hq.id ? null : hq.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => openEdit(e, hq)}
                      title="Edit headquarter"
                      className="p-2 rounded-md text-slate-400 hover:text-[#0F52BA] hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(e, hq.id)}
                      title="Delete headquarter"
                      disabled={deleteLoader === hq.id}
                      className="p-2 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deleteLoader === hq.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[#0F52BA]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">
                        {hq.name || "Unnamed Headquarter"}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {hq.location || "No location set"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* HQ Stats Bar */}
                    <div className="hidden sm:flex items-center gap-4 border-r border-slate-100 pr-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          {areaCount}{" "}
                          <span className="text-slate-400 font-medium">
                            Areas
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          {doctorCount}{" "}
                          <span className="text-slate-400 font-medium">
                            Doctors
                          </span>
                        </span>
                      </div>
                    </div>
                    {expandedHq === hq.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Areas */}
                {expandedHq === hq.id && (
                  <div className="px-6 pb-6 pt-1 space-y-3 bg-slate-50/30">
                    {hq.areas.map((area) => (
                      <div
                        key={area.id}
                        className="border border-slate-200 rounded-md bg-white shadow-sm overflow-hidden"
                      >
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedArea(
                              expandedArea === area.id ? null : area.id,
                            );
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-slate-400" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">
                              {area.name || "Unnamed Area"}
                            </h4>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">
                              {area.doctors.length} Doctors
                            </span>
                            {expandedArea === area.id ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Doctor Table Section */}
                        {expandedArea === area.id && (
                          <div className="border-t border-slate-100">
                            <table className="w-full text-left">
                              <thead className="bg-slate-50/80 border-b border-slate-100">
                                <tr>
                                  <th className="px-5 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Doctor Name
                                  </th>
                                  <th className="px-5 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Specialty
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {area.doctors.length > 0 ? (
                                  area.doctors.map((doc) => (
                                    <tr
                                      key={doc.id}
                                      className="hover:bg-slate-50/50 transition-colors"
                                    >
                                      <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                          <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                                            <Users className="w-3.5 h-3.5 text-[#0F52BA]" />
                                          </div>
                                          <span className="text-sm font-semibold text-slate-700">
                                            {doc.name}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-5 py-3">
                                        <span className="text-sm text-slate-500 font-medium italic">
                                          {doc.specialty || "N/A"}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="2"
                                      className="px-5 py-6 text-center text-sm text-slate-400 italic"
                                    >
                                      No doctors assigned to this area
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {editingHq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={closeEdit}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-[#0F52BA]" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Edit Headquarter
                </h2>
              </div>
              <button
                onClick={closeEdit}
                className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Headquarter Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.headQuarterName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      headQuarterName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                  />
                </div>
              </div>
              {editError && (
                <p className="text-xs text-red-500 font-medium">{editError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeEdit}
                disabled={editLoader}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={editLoader}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0F52BA] hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
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

      <PaginationComp
        totalDocuments={totalDocuments}
        perPageDocument={paginationData.perPageDocument}
        currentPage={paginationData.currentPage}
        paginationHandler={setPaginationData}
        actualResultPerPage={headquarters.length}
        listName="Headquarters"
      />
    </div>
  );
};

export default HeadQuarterListing;
