import { useState } from "react";
import { createStockist } from "../api/stockist";

function CreateStockist() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    state: "",
    gstNo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await createStockist(formData);
      alert(`Stockist created successfully: ${data.name}`);
      setFormData({ name: "", address: "", state: "", gstNo: "" });
    } catch (err) {
      alert(err.message || "Error creating stockist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Stockist Master
      </h2>
      <p className="text-gray-600 mb-6 pb-2 italic">Keep track of your stockist partners and their business info.</p>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Stockist Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stockist Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter stockist name"
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
          />
        </div>

        {/* Stockist Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stockist Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
          />
        </div>

        {/* Stockist State */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stockist State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
          />
        </div>

        {/* Stockist GST No */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stockist GST No.
          </label>
          <input
            type="text"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleChange}
            placeholder="Enter GST number"
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save / Update"}
          </button>
          <button className="bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateStockist;
