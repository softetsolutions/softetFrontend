import { useState, useEffect } from "react";
import { addDoctors } from "../api/doctor";
import { getAreas } from "../api/area";
import toast from "react-hot-toast";

const AddDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    area: "",
    svr: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch areas on mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await getAreas();
        setAreas(res || []);
      } catch (err) {
        console.error("Failed to fetch areas:", err);
      }
    };
    fetchAreas();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDoctor = () => {
    if (!formData.name.trim()) {
      alert("Doctor name is required");
      return;
    }
    setDoctors((prev) => [...prev, { ...formData }]);
    setFormData({ name: "", degree: "", area: "", svr: "" });
  };

  const handleSubmit = async () => {
    if (doctors.length === 0) {
      alert("Please add at least one doctor before submitting");
      return;
    }
    try {
      setLoading(true);

      const payload = {
        doctors: doctors.map((doc) => ({
          name: doc.name,
          specialty: doc.degree,
          areaId: doc.area,
        })),
      };

      await addDoctors(payload);
      toast.success("Doctors saved successfully");
      setDoctors([]);
    } catch (error) {
      console.error("Error saving doctors:", error);
      alert(error.message || "Failed to save doctors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800">Add Doctors</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Add multiple doctors to the list, then submit them all together.
      </p>

      {/* Add Doctor Form */}
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <Input
          label="Doctor Name"
          placeholder="Enter doctor name"
          value={formData.name}
          onChange={(val) => handleChange("name", val)}
        />
        <Input
          label="Specialization"
          placeholder="Enter doctor's speciality"
          value={formData.degree}
          onChange={(val) => handleChange("degree", val)}
        />

        {/* Area Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Area</label>
          <select
            value={formData.area}
            onChange={(e) => handleChange("area", e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
          >
            <option value="">-- Select Area --</option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between space-x-4 mt-6">
          <button
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            onClick={handleAddDoctor}
          >
            Add Doctor
          </button>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit All"}
          </button>
        </div>
      </div>

      {/* List of Added Doctors */}
      {doctors.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-4 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-3">Doctors to Submit:</h3>
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left border-b">Name</th>
                <th className="px-4 py-2 text-left border-b">Speciality</th>
                <th className="px-4 py-2 text-left border-b">Area</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{doc.name}</td>
                  <td className="px-4 py-2 border-b">{doc.degree}</td>
                  <td className="px-4 py-2 border-b">
                    {areas.find((a) => a._id === doc.area)?.name || doc.area}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

const Input = ({ label, placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
    />
  </div>
);

export default AddDoctor;
