import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { getAllStockists } from "../api/stockist"; // Adjust path if needed

const StockistMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockists, setStockists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stockists from API
  useEffect(() => {
    const fetchStockists = async () => {
      try {
        setLoading(true);
        const data = await getAllStockists();
        setStockists(Array.isArray(data) ? data : data.stockists || []);
      } catch (error) {
        console.error("Error fetching stockists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockists();
  }, []);

  // Filter stockists based on search term
  const filteredStockists = stockists.filter(
    (stockist) =>
      stockist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockist.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockist.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      {/* Header Section */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Stockist Master</h1>
          <p className="text-gray-500 mt-1 italic">
            Manage your stockists and their details.
          </p>
        </div>
      </header>

      {/* Stockist List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">Stockists List</h2>
          <div className="flex items-center space-x-4">
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
          </div>
        </div>

        {/* Stockist Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              Loading stockists...
            </div>
          ) : (
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
                    GST Number
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStockists.length > 0 ? (
                  filteredStockists.map((stockist) => (
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
                        {stockist.gstNumber}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default StockistMaster;
