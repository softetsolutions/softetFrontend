/* eslint-disable react/prop-types */
const PaginationComp = ({
  totalDocuments,
  perPageDocument,
  currentPage,
  paginationHandler,
  actualResultPerPage,
  listName = "Entries",
}) => {
  const totalPages = Math.ceil(totalDocuments / perPageDocument);
  const showingLowerValue = perPageDocument * currentPage - perPageDocument + 1;
  const showingUperValue = showingLowerValue - 1 + actualResultPerPage;

  const handlePagination = (type, pageNo) => {
    if (currentPage === pageNo) return;

    if (type === "next") {
      paginationHandler((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    } else if (type === "prev") {
      paginationHandler((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
    } else {
      paginationHandler((prev) => ({ ...prev, currentPage: pageNo }));
    }
  };

  return (
    <div className="flex justify-between">
      <div>
        {"Showing "}
        <span className="font-bold">
          {showingLowerValue} - {showingUperValue}{" "}
        </span>
        of
        <span className="font-bold"> {totalDocuments}</span> {listName}
      </div>
      <div className="flex gap-2" style={{ maxWidth: "50%" }}>
        <button
          className={`p-2 border border-slate-300 hover:bg-slate-200 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          disabled={currentPage === 1}
          onClick={() => handlePagination("prev")}
        >
          {"<"}
        </button>
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((value) => (
            <button
              className={`cursor-pointer p-2 border border-slate-300 ${currentPage === value ? " bg-blue-500 text-white" : " hover:bg-slate-200"}`}
              key={value}
              onClick={() => handlePagination("normal", value)}
            >
              {value}
            </button>
          ))}
        </div>
        <button
          className={`p-2 border border-slate-300 hover:bg-slate-200 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          disabled={currentPage === totalPages}
          onClick={() => handlePagination("next")}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default PaginationComp;
