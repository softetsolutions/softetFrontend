import { useState, useEffect, useCallback } from "react";
import PaginationComp from "../genericComps/paginationComp/PaginationComp";
import { getAreas } from "../api/area";
import Spinner from "../genericComps/Spinner";

const AreaList = () => {
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPageDocument: 5,
  });

  const fetchAreas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAreas({
        pageNo: paginationData.currentPage,
        limit: paginationData.perPageDocument,
      });

      setAreas(Array.isArray(data) ? data : data.areas || []);
      setTotalDocuments(data.areasCount);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  }, [paginationData]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  return (
    <div className="bg-gray-100 flex flex-col h-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Areas</h1>
          <p className="text-gray-500 mt-1 italic">
            Manage your medical area and their information.
          </p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <div className="overflow-x-auto h-full flex flex-col ">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size={40} borderWidth={4} />
              <p className="text-sm text-gray-500">Loading Areas...</p>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        HeadQuarter
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {areas.length > 0 ? (
                      areas.map((area) => (
                        <tr
                          key={area._id}
                          className={`hover:bg-gray-50 transition-colors}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {area.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {area.headQuarterId.headQuarterName}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No areas found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationComp
                totalDocuments={totalDocuments}
                perPageDocument={paginationData.perPageDocument}
                currentPage={paginationData.currentPage}
                paginationHandler={setPaginationData}
                actualResultPerPage={areas.length}
                listName="Areas"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaList;
