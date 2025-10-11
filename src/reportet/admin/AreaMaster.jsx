import { useState, useEffect } from "react";
import { getAreas, createArea, importAreasFromExcel } from "../api/area";
import toast from "react-hot-toast";
import { FaSearch,FaFileImport } from 'react-icons/fa';

const AreaMaster = () => {
  const [areaName, setAreaName] = useState("");
  const [areas, setAreas] = useState([]);
  const [newAreas, setNewAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [importing, setImporting] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState([]);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await getAreas();
      setAreas(res || []);
    } catch (err) {
      toast.error("Failed to fetch areas");
      console.error(err);
    }
  };

  const handleAddArea = () => {
    if (!areaName.trim()) {
      toast.error("Area name cannot be empty");
      return;
    }
    if (
      newAreas.includes(areaName.trim()) ||
      areas.some((a) => a.name.toLowerCase() === areaName.trim().toLowerCase())
    ) {
      toast.error("Area already exists");
      return;
    }
    setNewAreas((prev) => [...prev, areaName.trim()]);
    setAreaName("");
  };

  const handleSubmit = async () => {
    if (newAreas.length === 0) {
      toast.error("No new areas to submit");
      return;
    }
    try {
      await createArea({ names: newAreas });
      toast.success("Areas created successfully");
      setNewAreas([]);
      fetchAreas();
    } catch (err) {
      toast.error("Error creating areas");
      console.error(err);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const beforeIds = areas.map((a) => a._id); // track existing ids
      await importAreasFromExcel(file);
      toast.success("Areas imported successfully");

      // Refresh list
      const updatedAreas = await getAreas();
      setAreas(updatedAreas || []);

      // Find newly added ids
      const newIds = (updatedAreas || [])
        .filter((a) => !beforeIds.includes(a._id))
        .map((a) => a._id);

      setHighlightedIds(newIds);

      // Remove highlight after 2.5s
      setTimeout(() => setHighlightedIds([]), 2500);

    } catch (err) {
      toast.error("Failed to import areas");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const filteredAreas = areas.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800">Area Manager</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Add new areas, import from Excel, view existing ones, and search by name
      </p>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">

        {/* Import from Excel */}
        <div className="flex items-center gap-3 mb-4">
          <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-600 flex items-center gap-2">
            <FaFileImport />
            {importing ? "Importing..." : "Import from Excel"}
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
        {/* Add Area */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            placeholder="Enter area name"
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={handleAddArea}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>



        {/* New Areas List */}
        {newAreas.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">New Areas to Add:</h3>
            <table className="w-full border border-gray-300 rounded-md mb-4">
              <tbody>
                {newAreas.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleSubmit}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
          />
        </div>

        {/* Area List */}

        {filteredAreas.length > 0 ? (
          <table className="w-full border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Serial No.
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Area Name
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAreas.map((area, index) => (
                <tr
                  key={area._id}
                  className={`hover:bg-gray-50 transition-colors duration-500 ${highlightedIds.includes(area._id)
                      ? "bg-yellow-100"
                      : ""
                    }`}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {area.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No areas found</p>
        )}
      </div>
    </div>
  );
};

export default AreaMaster;

