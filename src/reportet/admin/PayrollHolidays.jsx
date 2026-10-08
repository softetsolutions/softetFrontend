import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CalendarDays,
  Copy,
  Download,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  applyHolidayPreset,
  copyPayrollHolidaysYear,
  deletePayrollHoliday,
  downloadHolidayTemplate,
  getHolidayPresets,
  getPayrollHolidays,
  importPayrollHolidays,
  previewHolidayPreset,
  upsertPayrollHoliday,
} from "../api/payroll";
import Spinner from "../genericComps/Spinner";
import { formatDate } from "../utils/helperFunctions";

const MOVABLE_WARNING =
  "Review movable festivals (Diwali, Holi, Eid…) before running payroll.";

const yearOptionsAround = (center, span = 4) =>
  Array.from({ length: span * 2 + 1 }, (_, i) => center - span + i);

/* ── Manual add / edit ─────────────────────────────────── */

const HolidayFormModal = ({ initial, onClose, onSaved }) => {
  const [date, setDate] = useState(initial?.date?.slice?.(0, 10) || "");
  const [name, setName] = useState(initial?.name || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      toast.error("Date is required");
      return;
    }
    if (!name.trim()) {
      toast.error("Holiday name is required");
      return;
    }
    try {
      setSubmitting(true);
      await upsertPayrollHoliday({ date, name: name.trim() });
      toast.success(initial ? "Holiday updated" : "Holiday added");
      onSaved?.();
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to save holiday");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            {initial ? "Edit holiday" : "Add holiday"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Republic Day"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>
          <p className="text-xs text-gray-500">
            Holidays are paid and do not count as LOP. Saving the same date
            updates the existing holiday. Weekly offs are set in Payroll
            Settings, not here.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting && (
                <Spinner
                  size={16}
                  borderWidth={2}
                  className="border-white border-t-transparent"
                />
              )}
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── India preset ──────────────────────────────────────── */

const PresetModal = ({ year, onClose, onApplied }) => {
  const [packs, setPacks] = useState([]);
  const [packId, setPackId] = useState("india_national");
  const [preview, setPreview] = useState([]);
  const [previewMeta, setPreviewMeta] = useState(null);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [overwrite, setOverwrite] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoadingPacks(true);
        const data = await getHolidayPresets();
        if (cancelled) return;
        const list = data.presets || data.packs || data.data || [];
        const normalized = Array.isArray(list) ? list : [];
        setPacks(normalized);
        const preferred =
          normalized.find((p) => (p.id || p.packId) === "india_national") ||
          normalized[0];
        if (preferred) {
          setPackId(preferred.id || preferred.packId);
        }
      } catch (err) {
        toast.error(err.message || "Failed to load presets");
        setPacks([{ id: "india_national", name: "India National" }]);
        setPackId("india_national");
      } finally {
        if (!cancelled) setLoadingPacks(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!packId || !year) return;
    let cancelled = false;
    const load = async () => {
      try {
        setLoadingPreview(true);
        const data = await previewHolidayPreset({ year, packId });
        if (cancelled) return;
        const list = data.holidays || data.preview || data.data || [];
        setPreview(Array.isArray(list) ? list : []);
        setPreviewMeta(data);
      } catch (err) {
        toast.error(err.message || "Failed to preview preset");
        setPreview([]);
        setPreviewMeta(null);
      } finally {
        if (!cancelled) setLoadingPreview(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [packId, year]);

  const handleApply = async () => {
    try {
      setApplying(true);
      const data = await applyHolidayPreset({ year, packId, overwrite });
      const warning = data.warning || MOVABLE_WARNING;
      toast.success(
        data.message ||
          `Preset applied${data.hasYearPack === false ? " (fixed dates only)" : ""}`,
      );
      onApplied?.(warning, data);
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to apply preset");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-800">
            Apply holiday preset
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            Seed holidays for <strong>{year}</strong>. Full festival packs cover
            2025–2027; other years get fixed-date holidays only.
          </p>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pack
            </label>
            {loadingPacks ? (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Spinner size={14} borderWidth={2} /> Loading packs…
              </div>
            ) : (
              <select
                value={packId}
                onChange={(e) => setPackId(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                {packs.length === 0 ? (
                  <option value="india_national">India National</option>
                ) : (
                  packs.map((p) => {
                    const id = p.id || p.packId;
                    return (
                      <option key={id} value={id}>
                        {p.name || p.label || id}
                      </option>
                    );
                  })
                )}
              </select>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
            />
            Overwrite existing dates
          </label>

          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Preview
            </h3>
            {loadingPreview ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
                <Spinner size={14} borderWidth={2} /> Loading preview…
              </div>
            ) : preview.length === 0 ? (
              <p className="text-sm text-gray-500">No holidays in this pack.</p>
            ) : (
              <div className="max-h-56 overflow-y-auto border border-gray-100 rounded-md">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500">
                      <th className="px-3 py-2 font-medium">Date</th>
                      <th className="px-3 py-2 font-medium">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((h, i) => (
                      <tr
                        key={`${h.date}-${i}`}
                        className="border-t border-gray-50"
                      >
                        <td className="px-3 py-1.5 whitespace-nowrap text-gray-700">
                          {formatDate(h.date)}
                        </td>
                        <td className="px-3 py-1.5 text-gray-800">{h.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {previewMeta?.hasYearPack === false && (
              <p className="mt-2 text-xs text-amber-700">
                This year has fixed-date holidays only. Add festivals via Excel
                or manually.
              </p>
            )}
          </div>

          <div className="rounded-md bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-800 flex gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{MOVABLE_WARNING}</span>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={applying || loadingPreview || preview.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {applying && (
                <Spinner
                  size={16}
                  borderWidth={2}
                  className="border-white border-t-transparent"
                />
              )}
              {applying ? "Applying…" : "Apply preset"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Copy year ─────────────────────────────────────────── */

const CopyYearModal = ({ toYear, onClose, onCopied }) => {
  const [fromYear, setFromYear] = useState(toYear - 1);
  const [overwrite, setOverwrite] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const years = yearOptionsAround(toYear, 5);

  const handleCopy = async () => {
    if (fromYear === toYear) {
      toast.error("From year and to year must be different");
      return;
    }
    if (
      !window.confirm(
        `Copy holidays from ${fromYear} → ${toYear}?\n\n${MOVABLE_WARNING}`,
      )
    ) {
      return;
    }
    try {
      setSubmitting(true);
      const data = await copyPayrollHolidaysYear({
        fromYear,
        toYear,
        overwrite,
      });
      const warning = data.warning || MOVABLE_WARNING;
      toast.success(
        data.message ||
          `Copied ${data.created ?? "?"} created, ${data.updated ?? data.skipped ?? "?"} skipped/updated`,
      );
      onCopied?.(warning, data);
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to copy holidays");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            Copy from previous year
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            Copies the same month-day into the new year (e.g. 2025-01-26 →
            2026-01-26).
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                From year
              </label>
              <select
                value={fromYear}
                onChange={(e) => setFromYear(Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                To year
              </label>
              <input
                value={toYear}
                disabled
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-600"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
            />
            Overwrite names when dates already exist
          </label>
          <div className="rounded-md bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-800 flex gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{MOVABLE_WARNING}</span>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting && (
                <Spinner
                  size={16}
                  borderWidth={2}
                  className="border-white border-t-transparent"
                />
              )}
              {submitting ? "Copying…" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Excel upload ──────────────────────────────────────── */

const UploadExcelModal = ({ onClose, onImported }) => {
  const [file, setFile] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const handleImport = async () => {
    if (!file) {
      toast.error("Select an Excel file first");
      return;
    }
    try {
      setImporting(true);
      setResult(null);
      const data = await importPayrollHolidays(file, overwrite);
      setResult(data);
      toast.success(
        data.message ||
          `Import done — ${data.created ?? 0} created, ${data.updated ?? 0} updated, ${data.skipped ?? 0} skipped`,
      );
      onImported?.(data);
    } catch (err) {
      toast.error(err.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-800">
            Upload holidays Excel
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            Columns: <strong>Date</strong> (YYYY-MM-DD), <strong>Name</strong>.
            Sheet name preferably “Holidays” (first sheet also works).
          </p>

          <div
            className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30"
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={22} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-700">
              {file ? file.name : "Click to choose .xlsx file"}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
            />
            Overwrite existing dates (default on)
          </label>

          {result && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-md bg-green-50 px-2 py-2">
                  <p className="text-lg font-semibold text-green-700">
                    {result.created ?? 0}
                  </p>
                  <p className="text-[11px] text-green-600 uppercase">Created</p>
                </div>
                <div className="rounded-md bg-blue-50 px-2 py-2">
                  <p className="text-lg font-semibold text-blue-700">
                    {result.updated ?? 0}
                  </p>
                  <p className="text-[11px] text-blue-600 uppercase">Updated</p>
                </div>
                <div className="rounded-md bg-gray-50 px-2 py-2">
                  <p className="text-lg font-semibold text-gray-700">
                    {result.skipped ?? 0}
                  </p>
                  <p className="text-[11px] text-gray-500 uppercase">Skipped</p>
                </div>
              </div>
              {Array.isArray(result.errors) && result.errors.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-red-600 mb-1">
                    Errors ({result.errors.length})
                  </p>
                  <div className="max-h-40 overflow-y-auto border border-red-100 rounded-md">
                    <table className="w-full text-xs">
                      <thead className="bg-red-50 sticky top-0">
                        <tr className="text-left text-red-700">
                          <th className="px-2 py-1.5 font-medium">Row</th>
                          <th className="px-2 py-1.5 font-medium">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.errors.map((err, i) => (
                          <tr
                            key={i}
                            className="border-t border-red-50 text-gray-700"
                          >
                            <td className="px-2 py-1.5">{err.row ?? "—"}</td>
                            <td className="px-2 py-1.5">
                              {err.reason || err.message || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              {result ? "Close" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || !file}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {importing && (
                <Spinner
                  size={16}
                  borderWidth={2}
                  className="border-white border-t-transparent"
                />
              )}
              {importing ? "Uploading…" : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Page ──────────────────────────────────────────────── */

const PayrollHolidays = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [showPreset, setShowPreset] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [banner, setBanner] = useState(null);

  const years = yearOptionsAround(year, 3);

  const fetchHolidays = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPayrollHolidays(year);
      const list = data.holidays || data.data || [];
      setHolidays(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.message || "Failed to load holidays");
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchHolidays();
    setBanner(null);
  }, [fetchHolidays]);

  const handleDelete = async (holidayId) => {
    if (!window.confirm("Delete this holiday?")) return;
    try {
      setDeletingId(holidayId);
      await deletePayrollHoliday(holidayId);
      toast.success("Holiday deleted");
      fetchHolidays();
    } catch (err) {
      toast.error(err.message || "Failed to delete holiday");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setDownloading(true);
      await downloadHolidayTemplate();
      toast.success("Template downloaded");
    } catch (err) {
      toast.error(err.message || "Failed to download template");
    } finally {
      setDownloading(false);
    }
  };

  const showMovableBanner = (warning) => {
    setBanner(warning || MOVABLE_WARNING);
  };

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-y-auto">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays size={22} className="text-blue-600" />
            <h1 className="text-3xl font-semibold text-gray-800">
              Holiday Calendar
            </h1>
          </div>
          <p className="text-gray-500 mt-1 italic text-sm">
            Org holidays are paid days (not LOP). Weekly offs live in Payroll
            Settings. After changes, regenerate draft payroll runs.
          </p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowPreset(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
        >
          <Sparkles size={14} /> Apply India preset
        </button>
        <button
          type="button"
          onClick={() => setShowCopy(true)}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 bg-white rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          <Copy size={14} /> Copy year
        </button>
        <button
          type="button"
          onClick={handleDownloadTemplate}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 bg-white rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {downloading ? (
            <Spinner size={14} borderWidth={2} />
          ) : (
            <Download size={14} />
          )}
          Download template
        </button>
        <button
          type="button"
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 bg-white rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          <Upload size={14} /> Upload Excel
        </button>
        <button
          type="button"
          onClick={() => setModal({})}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          <Plus size={14} /> Add holiday
        </button>
      </div>

      {banner && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-2 items-start">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{banner}</p>
            <p className="text-xs mt-1 text-amber-800">
              Preset/copy is a starting pack — add state or regional holidays
              manually or via Excel. Regenerate draft payroll runs so LOP
              recalculates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-amber-600 hover:text-amber-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
            <Spinner size={36} borderWidth={4} />
            <p className="text-sm">Loading holidays…</p>
          </div>
        ) : holidays.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-sm text-gray-600">
              No holidays for {year}. Apply India preset or upload Excel to get
              started.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreset(true)}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              >
                Apply India preset
              </button>
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Upload Excel
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h) => (
                  <tr key={h._id || h.date} className="border-b border-gray-50">
                    <td className="py-3 pr-4 text-gray-800 whitespace-nowrap">
                      {formatDate(h.date)}
                    </td>
                    <td className="py-3 pr-4 text-gray-800">{h.name}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setModal(h)}
                          className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(h._id)}
                          disabled={deletingId === h._id}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <HolidayFormModal
          initial={modal._id ? modal : null}
          onClose={() => setModal(null)}
          onSaved={fetchHolidays}
        />
      )}
      {showPreset && (
        <PresetModal
          year={year}
          onClose={() => setShowPreset(false)}
          onApplied={(warning) => {
            showMovableBanner(warning);
            fetchHolidays();
          }}
        />
      )}
      {showCopy && (
        <CopyYearModal
          toYear={year}
          onClose={() => setShowCopy(false)}
          onCopied={(warning) => {
            showMovableBanner(warning);
            fetchHolidays();
          }}
        />
      )}
      {showUpload && (
        <UploadExcelModal
          onClose={() => setShowUpload(false)}
          onImported={() => fetchHolidays()}
        />
      )}
    </div>
  );
};

export default PayrollHolidays;
