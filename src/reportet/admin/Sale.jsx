import { useState, useEffect } from "react";
import { createSaleByAdmin, alreadySubmitedSaleByAdmin } from "../api/Sale";
import { getAllStockists } from "../api/stockist";
import toast from "react-hot-toast";
import Spinner from "../genericComps/Spinner";

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function CreateSale() {
  const [formData, setFormData] = useState({
    stockist: "",
    month: "",
    saleAmount: "",
  });
  const [stockistOptions, setStockistOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const { stockist, month, saleAmount } = formData;
      if (!stockist || !month || !saleAmount) {
        toast.error("All fields are mandatory. Pls fill required fields");
        return;
      }
      setLoading(true);
      const data = await createSaleByAdmin(formData);
      if (data?.success) {
        toast.success("Sale added successfully");
        setFormData({
          stockist: "",
          month: "",
          saleAmount: "",
        });
        setAlreadySubmitted(false);
      }
    } catch (err) {
      console.error("Unable to create sale got some problem", err);
      toast.error(err?.message || "Unable to create sale, try again");
    } finally {
      setLoading(false);
    }
  };

  const fetchStockists = async (abortController) => {
    try {
      // requesting a large page size since this list just feeds a dropdown
      const stockistData = await getAllStockists(abortController, {
        pageNumber: 1,
        rowsPerPage: 100,
      });
      setStockistOptions(stockistData?.data || []);
    } catch (error) {
      if (error?.name === "AbortError") return;
      console.error("Unable to fetch the stockists.", error);
      toast.error("Unable to fetch the stockists. Pls refresh the page");
    }
  };

  const checkAlreadySubmitted = async (stockist) => {
    try {
      setCheckingStatus(true);
      const data = await alreadySubmitedSaleByAdmin({ stockist });
      setAlreadySubmitted(Boolean(data?.isAlreadySunmitedSales));
    } catch (error) {
      console.error("Unable to check already submitted sale status", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchStockists(abortController);
    return () => abortController.abort();
  }, []);

  // Re-check submission status whenever a stockist is chosen
  useEffect(() => {
    if (formData.stockist) {
      checkAlreadySubmitted(formData.stockist);
    } else {
      setAlreadySubmitted(false);
    }
  }, [formData.stockist]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Create Sale (Admin)</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Add a sale directly for any stockist in your organization.
      </p>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Stockist */}
        <div>
          <label
            htmlFor="stockist"
            className="block text-sm font-medium text-gray-700"
          >
            Stockist <span className="text-red-500">*</span>
          </label>
          <select
            name="stockist"
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
            onChange={handleChange}
            value={formData.stockist}
          >
            <option value="">Choose Stockist</option>
            {stockistOptions?.map((stockist) => (
              <option key={stockist?._id} value={stockist?._id}>
                {stockist?.name}
              </option>
            ))}
          </select>
        </div>

        {checkingStatus && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner size={16} borderWidth={2} />
            Checking existing submissions...
          </div>
        )}

        {!checkingStatus && alreadySubmitted && (
          <p className="text-sm text-amber-600">
            You have already submitted this month's sale for this stockist.
          </p>
        )}

        {/* Month */}
        <div>
          <label
            htmlFor="month"
            className="block text-sm font-medium text-gray-700"
          >
            Month <span className="text-red-500">*</span>
          </label>
          <select
            name="month"
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
            onChange={handleChange}
            value={formData.month}
          >
            <option value="">Choose Month</option>
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sale Amount */}
        <div>
          <label
            htmlFor="saleAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Sale Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="saleAmount"
            value={formData.saleAmount}
            onChange={handleChange}
            placeholder="Enter sale amount"
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading || alreadySubmitted}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <Spinner
                size={16}
                borderWidth={2}
                className="border-white border-t-transparent"
              />
            )}
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSale;
