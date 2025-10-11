import { useState, useEffect } from "react";
import { getAllMrs } from "../api/mr";
import { getAreas, getAreaByMrId } from "../api/area";
import { getDoctorsWithRemarks } from "../api/doctor";

const VisitReport = () => {
  const [mrs, setMrs] = useState([]);
  const [areas, setAreas] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportFilters, setReportFilters] = useState({
    mr: "",
    area: "",
    dateFrom: "",
    dateTo: "",
    status: "",
  });

  // Fetch MR list on mount
  useEffect(() => {
    const fetchMrs = async () => {
      try {
        const mrRes = await getAllMrs();
        setMrs(mrRes || []);
      } catch (err) {
        console.error("Error fetching MR list:", err);
      }
    };
    fetchMrs();
  }, []);

  // Fetch areas based on selected MR
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        if (reportFilters.mr) {
          const areaRes = await getAreaByMrId(reportFilters.mr);
          setAreas(areaRes || []);
        } else {
          const allAreas = await getAreas();
          setAreas(allAreas || []);
        }
      } catch (err) {
        console.error("Error fetching areas:", err);
      }
    };
    fetchAreas();
  }, [reportFilters.mr]);

const handleReportSearch = async () => {
    try {
      setReportData([]);
      if (!reportFilters.mr || !reportFilters.area || !reportFilters.dateFrom || !reportFilters.dateTo) {
        alert("Please select MR, Area, Date From, and Date To");
        return;
      }

      const data = await getDoctorsWithRemarks(
        reportFilters.mr,
        reportFilters.area,
        reportFilters.dateFrom,
        reportFilters.dateTo
      );
      
      const formatted = data.map((item, idx) => ({
        id: idx,
        dr: item.doctorId.name || "",
        remark: item.remark || "",
      }));

      setReportData(formatted);
    } catch (err) {
      console.error("Search error:", err);
    }
  };
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800">VISIT REPORT</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Filter and review past visit records by MR, area, date, and status.
      </p>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Select MR */}
        <label className="block mt-3">Select MR</label>
        <select
          value={reportFilters.mr}
          onChange={(e) =>
            setReportFilters({ ...reportFilters, mr: e.target.value })
          }
          className="border w-full p-2 rounded"
        >
          <option value="">--Select MR--</option>
          {mrs.map((mr) => (
            <option key={mr._id} value={mr._id}>
              {mr.firstName} {mr.lastName}
            </option>
          ))}
        </select>

        {/* Select Area */}
        <label className="block mt-3">Select Area</label>
        <select
          value={reportFilters.area}
          onChange={(e) =>
            setReportFilters({ ...reportFilters, area: e.target.value })
          }
          className="border w-full p-2 rounded"
        >
          <option value="">--Select Area--</option>
          {areas.map((area) => (
            <option key={area._id} value={area._id}>
              {area.name}
            </option>
          ))}
        </select>

        {/* Date Between */}
        <label className="block mt-3">Date Between</label>
        <div className="flex gap-2">
          <input
            type="date"
            value={reportFilters.dateFrom}
            onChange={(e) =>
              setReportFilters({ ...reportFilters, dateFrom: e.target.value })
            }
            className="border w-full p-2 rounded"
          />
          <input
            type="date"
            value={reportFilters.dateTo}
            onChange={(e) =>
              setReportFilters({ ...reportFilters, dateTo: e.target.value })
            }
            className="border w-full p-2 rounded"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleReportSearch}
          className="mt-4 w-full bg-blue-900 text-white py-2 rounded"
        >
          SEARCH LIST
        </button>

        {/* Report Table */}
        <div className="mt-3 p-2 overflow-x-auto">
          {reportData.length > 0 ? (
            <table className="min-w-full text-sm border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">DR Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Remark</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">{r.dr}</td>
                    <td className="border border-gray-300 px-3 py-2">{r.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-xs">No records found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitReport;
