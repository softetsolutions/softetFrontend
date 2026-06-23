import { useState, useEffect } from "react";
import { createStockist } from "../api/stockist";
import { getAllHeadQuartersNames } from "../api/headQuarter";
import toast from "react-hot-toast";
import Spinner from "../genericComps/Spinner";

function CreateStockist() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    state: "",
    headQuarter: "",
  });
  const [headQuarterOptions, setHeadQuarterOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const { name, address, state, headQuarter } = formData;
      if (!name || !address || !state || !headQuarter) {
        toast.error("All fields are mandatory. Pls fill required fields");
        return;
      }
      setLoading(true);
      const data = await createStockist(formData);
      if (data?.success) {
        toast.success("Stockist added successfully");
        setFormData({ name: "", address: "", state: "", headQuarter: "" });
      }
    } catch (err) {
      console.error("Unable to create stockist got some problem", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeadQuarterNames = async () => {
    try {
      const headQuartersOptions = await getAllHeadQuartersNames();
      setHeadQuarterOptions(headQuartersOptions?.headQuarterNames);
    } catch (error) {
      console.error("Unable to fetch the headquarters.", error);
      toast.error("Unable to fetch the headquarters.Pls refresh the page");
    }
  };

  useEffect(() => {
    fetchHeadQuarterNames();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Create Stockist</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">Add stockist.</p>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Stockist Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
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

        <div>
          <label htmlFor="headQuarter" className="block text-sm font-medium">
            Choose HeadQuarter <span className=" text-red-500">*</span>
          </label>
          <select
            name="headQuarter"
            className="w-full p-2 border rounded mt-1"
            onChange={handleChange}
            value={formData?.headQuarter}
          >
            <option value="">Choose Headquarter</option>
            {headQuarterOptions?.map((headQuarter) => (
              <option key={headQuarter?._id} value={headQuarter?._id}>
                {headQuarter?.headQuarterName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading && (
              <Spinner
                size={16}
                borderWidth={2}
                className="border-white border-t-transparent"
              />
            )}
            {loading ? "Saving..." : "Save "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateStockist;
