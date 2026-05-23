import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { getAllHeadquartersData } from "../api/headQuarter";

const HeadQuarterListing = () => {
  // Bound to your provided state structure
  const [headquarters, setHeadquarters] = useState([
    {
      id: Date.now(),
      name: "North American HQ",
      location: "New York City, USA",
      areas: [
        {
          id: Date.now() + 1,
          name: "Northeast Clinical Region",
          doctors: [
            { id: 101, name: "Dr. Sarah Jenkins", specialty: "Oncology" },
            { id: 102, name: "Dr. Marcus Thorne", specialty: "Cardiology" },
          ],
        },
      ],
    },
  ]);

  const [expandedHq, setExpandedHq] = useState(null);
  const [expandedArea, setExpandedArea] = useState(null);

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
      const headQuartersDetails = await getAllHeadquartersData();
      const newHeadQuarterDetailsState =
        headQuartersDetails?.data[0]?.headQuarterDetail?.map((headQuarter) => {
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
        });
      setHeadquarters(newHeadQuarterDetailsState);
      console.log("newHeadQuarterDetailsState", newHeadQuarterDetailsState);
    })();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-4 bg-[#f7f9fb] min-h-screen font-inter antialiased text-slate-900">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Network Directory</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search network..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Listing Section */}
      <div className="space-y-4">
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
    </div>
  );
};

export default HeadQuarterListing;
