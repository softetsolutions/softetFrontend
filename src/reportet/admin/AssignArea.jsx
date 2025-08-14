import { useState, useEffect } from "react";
import { getAllMrs } from "../api/mr";
import { getAreas, assignAreaToMR } from "../api/area";
import toast from "react-hot-toast";

const AssignArea = () => {
    const [mrs, setMrs] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedMr, setSelectedMr] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch MRs & Areas
    useEffect(() => {
        (async () => {
            try {
                const mrData = await getAllMrs();
                setMrs(mrData);

                const areaData = await getAreas();
                setAreas(areaData);
            } catch (err) {
                toast.error("Failed to load MRs or Areas");
            }
        })();
    }, []);

    const handleAssign = async () => {
        if (!selectedMr || !selectedArea) {
            toast.error("Please select both MR and Area");
            return;
        }
        setLoading(true);
        try {
            await assignAreaToMR(selectedMr, selectedArea);
            toast.success("Area assigned successfully!");
            setSelectedMr("");
            setSelectedArea("");
        } catch (err) {
            toast.error(err.message || "Failed to assign area");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Assign Area to MR</h2>
            <p className="text-gray-600 mb-6 pb-2 italic">
                Add multiple doctors to the list, then submit them all together.
            </p>
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                {/* MR Dropdown */}
                <div className="text-black">
                    <label className="block mb-1">Select MR:</label>
                    <select
                        value={selectedMr}
                        onChange={(e) => setSelectedMr({mr:e.target.value})}
                        className="w-full border p-2 rounded text-black"
                    >
                        <option value="" className="bg-white text-black">-- Select MR --</option>
                        {mrs.map((mr) => (
                            <option key={mr._id} value={mr._id}>
                               {mr.firstName} {mr.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Area Dropdown */}
                <div>
                    <label className="block mb-1">Select Area:</label>
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">-- Select Area --</option>
                        {areas.map((area) => (
                            <option key={area._id} value={area._id}>
                                {area.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleAssign}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Assigning..." : "Assign Area"}
                </button>
            </div>
        </div>
    );
};

export default AssignArea;
