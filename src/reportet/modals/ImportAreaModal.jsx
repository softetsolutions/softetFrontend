import { useState } from "react";
import { Upload, X, Download } from "lucide-react";
import toast from "react-hot-toast";
import { importAreasFromExcel } from "../api/area";
import * as XLSX from "xlsx";
const ImportAreaModal = ({ onClose, onImported }) => {
  const [file, setFile] = useState(null);
  const [fromRow, setFromRow] = useState("2");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [hasImported, setHasImported] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["", "Area Name", "Headquarter Name"],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Areas");
    XLSX.writeFile(workbook, "areas_template.xlsx");
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select an Excel file first");
      return;
    }

    setImporting(true);
    setResult(null);
    try {
      const data = await importAreasFromExcel(file, fromRow);
      setResult(data);
      setHasImported(true);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to import areas");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    if (hasImported) onImported?.();
    onClose?.();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-indigo-600">Import Areas</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            <Download className="w-3.5 h-3.5" />
            Download Excel Template
          </button>
        </div>

        <label className="border-2 border-dashed border-indigo-300 rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-indigo-50 transition mb-4">
          <Upload className="w-6 h-6 text-indigo-500 mb-2" />
          <span className="text-sm font-medium text-gray-600">
            {file ? file.name : "Upload Excel (.xlsx)"}
          </span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">
              From Row
            </label>
            <input
              type="number"
              min="1"
              value={fromRow}
              onChange={(e) => setFromRow(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {result && (
          <div className="mb-5 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm space-y-2 max-h-64 overflow-y-auto">
            <p className="text-gray-700">
              <span className="font-semibold">
                {result.summary?.insertedCount ?? result.insertedCount ?? 0}
              </span>{" "}
              area(s) imported
            </p>

            {result.duplicates?.areas?.length > 0 && (
              <div>
                <p className="text-amber-600 font-semibold mb-1">
                  {result.duplicates.areas.length} duplicate area row(s)
                  skipped:
                </p>
                <ul className="space-y-1">
                  {result.duplicates.areas.map((dup, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1"
                    >
                      Row {dup.row}:{" "}
                      <span className="font-medium">{dup.name}</span> (
                      {dup.headquarter}) — {dup.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.skippedDueToUnmatchedHeadquarter?.length > 0 && (
              <div>
                <p className="text-red-600 font-semibold mb-1">
                  {result.skippedDueToUnmatchedHeadquarter.length} row(s)
                  skipped — headquarter not found:
                </p>
                <ul className="space-y-1">
                  {result.skippedDueToUnmatchedHeadquarter.map((row, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1"
                    >
                      Row {row.row}: "{row.areaName}" under "
                      {row.headQuarterName}"
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.skippedRows?.length > 0 && (
              <div>
                <p className="text-red-600 font-semibold mb-1">
                  {result.skippedRows.length} row(s) skipped:
                </p>
                <ul className="space-y-1">
                  {result.skippedRows.map((row, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1"
                    >
                      Row {row.row}: {row.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={importing || !file}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors disabled:opacity-50"
          >
            {importing ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportAreaModal;
