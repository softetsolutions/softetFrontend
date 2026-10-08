import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IndianRupee, Plus, Trash2, X } from "lucide-react";
import {
  createSalaryStructure,
  getCurrentSalaryStructure,
  getSalaryStructures,
} from "../api/payroll";
import Spinner from "../genericComps/Spinner";
import { formatDate } from "../utils/helperFunctions";
import { formatINR, sumLineItems } from "../utils/payrollHelpers";

const emptyLine = () => ({ code: "", label: "", amount: "" });

const SalaryStructureFormModal = ({ onClose, onSaved }) => {
  const [effectiveFrom, setEffectiveFrom] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [currency] = useState("INR");
  const [earnings, setEarnings] = useState([
    { code: "BASIC", label: "Basic", amount: "" },
  ]);
  const [deductions, setDeductions] = useState([
    { code: "PF", label: "PF", amount: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const updateLine = (kind, index, key, value) => {
    const setter = kind === "earnings" ? setEarnings : setDeductions;
    setter((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );
  };

  const addLine = (kind) => {
    const setter = kind === "earnings" ? setEarnings : setDeductions;
    setter((prev) => [...prev, emptyLine()]);
  };

  const removeLine = (kind, index) => {
    const setter = kind === "earnings" ? setEarnings : setDeductions;
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const normalizeLines = (rows, required) => {
    const cleaned = rows
      .map((row) => ({
        code: row.code.trim().toUpperCase(),
        label: row.label.trim(),
        amount: Number(row.amount),
      }))
      .filter((row) => row.code || row.label || row.amount);

    if (required && cleaned.length === 0) {
      throw new Error("Add at least one earning line");
    }

    for (const row of cleaned) {
      if (!row.code || !row.label) {
        throw new Error("Each line needs a code and label");
      }
      if (!Number.isFinite(row.amount) || row.amount < 0) {
        throw new Error(`Invalid amount for ${row.code}`);
      }
    }
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!effectiveFrom) {
      toast.error("Effective from date is required");
      return;
    }

    try {
      const payload = {
        effectiveFrom,
        currency,
        earnings: normalizeLines(earnings, true),
        deductions: normalizeLines(deductions, false),
      };
      setSubmitting(true);
      await onSaved(payload);
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to save salary structure");
    } finally {
      setSubmitting(false);
    }
  };

  const LineEditor = ({ title, kind, rows }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => addLine(kind)}
          className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
        >
          <Plus size={12} /> Add line
        </button>
      </div>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center">
            <input
              placeholder="CODE"
              value={row.code}
              onChange={(e) =>
                updateLine(kind, index, "code", e.target.value.toUpperCase())
              }
              className="col-span-3 border border-gray-300 rounded-md px-2 py-1.5 text-xs uppercase"
            />
            <input
              placeholder="Label"
              value={row.label}
              onChange={(e) =>
                updateLine(kind, index, "label", e.target.value)
              }
              className="col-span-4 border border-gray-300 rounded-md px-2 py-1.5 text-xs"
            />
            <input
              type="number"
              min="0"
              placeholder="Amount"
              value={row.amount}
              onChange={(e) =>
                updateLine(kind, index, "amount", e.target.value)
              }
              className="col-span-4 border border-gray-300 rounded-md px-2 py-1.5 text-xs"
            />
            <button
              type="button"
              onClick={() => removeLine(kind, index)}
              disabled={rows.length <= 1 && kind === "earnings"}
              className="col-span-1 text-red-500 hover:text-red-700 disabled:opacity-30"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-800">
            New salary structure
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
              Effective from <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Promotion does not change salary — create a new structure for
              hikes.
            </p>
          </div>

          <LineEditor title="Earnings" kind="earnings" rows={earnings} />
          <LineEditor title="Deductions" kind="deductions" rows={deductions} />

          <div className="flex justify-end gap-2 pt-2 border-t">
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
              {submitting ? "Saving…" : "Create version"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StructureSummary = ({ structure }) => {
  if (!structure) return null;
  const earnings = structure.earnings || [];
  const deductions = structure.deductions || [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Earnings
        </p>
        <ul className="space-y-1">
          {earnings.map((row, i) => (
            <li key={`${row.code}-${i}`} className="flex justify-between gap-2">
              <span className="text-gray-600">{row.label || row.code}</span>
              <span className="font-medium">{formatINR(row.amount)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between font-semibold mt-2 pt-2 border-t text-gray-800">
          <span>Gross</span>
          <span>{formatINR(sumLineItems(earnings))}</span>
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Deductions
        </p>
        {deductions.length === 0 ? (
          <p className="text-gray-500">None</p>
        ) : (
          <ul className="space-y-1">
            {deductions.map((row, i) => (
              <li
                key={`${row.code}-${i}`}
                className="flex justify-between gap-2"
              >
                <span className="text-gray-600">{row.label || row.code}</span>
                <span className="font-medium">{formatINR(row.amount)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="flex justify-between font-semibold mt-2 pt-2 border-t text-gray-800">
          <span>Total deductions</span>
          <span>{formatINR(sumLineItems(deductions))}</span>
        </p>
      </div>
    </div>
  );
};

const EmployeeSalaryStructure = ({ employeeMongoId }) => {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchData = useCallback(async () => {
    if (!employeeMongoId) return;
    try {
      setLoading(true);
      const [currentRes, historyRes] = await Promise.all([
        getCurrentSalaryStructure(employeeMongoId).catch((err) => {
          if (err.status === 404) return null;
          throw err;
        }),
        getSalaryStructures(employeeMongoId),
      ]);

      const currentStruct =
        currentRes?.salaryStructure ||
        currentRes?.structure ||
        currentRes?.data ||
        currentRes;
      setCurrent(
        currentStruct && (currentStruct.earnings || currentStruct._id)
          ? currentStruct
          : null,
      );

      const list =
        historyRes?.salaryStructures ||
        historyRes?.structures ||
        historyRes?.data ||
        [];
      setHistory(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.message || "Failed to load salary structures");
      setCurrent(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [employeeMongoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (payload) => {
    await createSalaryStructure(employeeMongoId, payload);
    toast.success("Salary structure created");
    await fetchData();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <IndianRupee size={16} className="text-gray-400" />
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Salary Structure
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
        >
          <Plus size={12} /> New version
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
          <Spinner size={16} borderWidth={2} /> Loading…
        </div>
      ) : (
        <>
          {current ? (
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-3">
                Current · effective{" "}
                {formatDate(current.effectiveFrom || current.effectiveDate)}
                {current.currency ? ` · ${current.currency}` : ""}
              </p>
              <StructureSummary structure={current} />
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              No salary structure. Employee will be skipped in payroll runs until
              one is set.
            </p>
          )}

          {history.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Version history
              </h4>
              <ul className="space-y-2">
                {history.map((item) => (
                  <li
                    key={item._id}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm border border-gray-100 rounded-md px-3 py-2"
                  >
                    <span className="text-gray-700">
                      Effective {formatDate(item.effectiveFrom)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      Gross {formatINR(sumLineItems(item.earnings))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {showForm && (
        <SalaryStructureFormModal
          onClose={() => setShowForm(false)}
          onSaved={handleCreate}
        />
      )}
    </div>
  );
};

export default EmployeeSalaryStructure;
