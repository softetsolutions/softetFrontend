import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BadgeDollarSign,
  Download,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Lock,
  X,
} from "lucide-react";
import {
  createPayrollRun,
  exportBankFile,
  exportPayslipsExcel,
  finalizePayrollRun,
  getPayrollRun,
  getPayrollRuns,
  regeneratePayrollRun,
} from "../api/payroll";
import Spinner from "../genericComps/Spinner";
import PayslipDetailModal from "../modals/PayslipDetailModal";
import {
  MONTHS,
  employeeDisplayName,
  formatINR,
  monthLabel,
  payslipStatusClass,
  runStatusClass,
} from "../utils/payrollHelpers";

const CreateRunModal = ({ onClose, onCreated }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [submitting, setSubmitting] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 1 + i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = await createPayrollRun({ month: Number(month), year: Number(year) });
      const skipped = data.skippedNoStructure || [];
      toast.success(
        data.message ||
          `Draft run created for ${monthLabel(month, year)}`,
      );
      if (skipped.length > 0) {
        toast(
          `${skipped.length} employee(s) skipped — no salary structure`,
          { icon: "⚠️", duration: 5000 },
        );
      }
      onCreated?.(data.run || data.data || data);
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to create payroll run");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            Create payroll run
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Creates a draft run with payslips from attendance and current salary
            structures. Employees without a structure are skipped.
          </p>
          <div className="flex justify-end gap-2">
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
              {submitting ? "Creating…" : "Create draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PayrollRunDetail = ({ runId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [run, setRun] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [missingBank, setMissingBank] = useState([]);
  const [selectedPayslipId, setSelectedPayslipId] = useState(null);

  const fetchRun = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPayrollRun(runId);
      const r = data.run || data.data || data;
      setRun(r);
      setPayslips(data.payslips || r.payslips || []);
      setMissingBank(data.missingBankDetails || r.missingBankDetails || []);
    } catch (err) {
      toast.error(err.message || "Failed to load payroll run");
      onBack?.();
    } finally {
      setLoading(false);
    }
  }, [runId, onBack]);

  useEffect(() => {
    fetchRun();
  }, [fetchRun]);

  const handleRegenerate = async () => {
    if (!window.confirm("Rebuild all draft payslips from attendance & salary?"))
      return;
    try {
      setBusy("regenerate");
      await regeneratePayrollRun(runId);
      toast.success("Payroll run regenerated");
      await fetchRun();
    } catch (err) {
      toast.error(err.message || "Regenerate failed");
    } finally {
      setBusy("");
    }
  };

  const handleFinalize = async () => {
    if (
      !window.confirm(
        "Finalize this run? Draft slips will lock. On-hold slips stay on hold. Bank file becomes available.",
      )
    )
      return;
    try {
      setBusy("finalize");
      await finalizePayrollRun(runId);
      toast.success("Payroll run finalized");
      await fetchRun();
    } catch (err) {
      toast.error(err.message || "Finalize failed");
    } finally {
      setBusy("");
    }
  };

  const handleBankExport = async () => {
    try {
      setBusy("bank");
      const meta = await exportBankFile(runId);
      const skipped = Number(meta.skipped) || 0;
      toast.success(
        skipped > 0
          ? `Bank file downloaded (${meta.rows || "?"} rows, ${skipped} skipped)`
          : `Bank file downloaded (${meta.rows || "?"} rows)`,
      );
      if (meta.skippedJson) {
        try {
          const parsed = JSON.parse(meta.skippedJson);
          if (Array.isArray(parsed) && parsed.length) {
            console.info("Bank file skipped:", parsed);
          }
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      toast.error(err.message || "Bank file export failed");
    } finally {
      setBusy("");
    }
  };

  const handlePayslipExport = async () => {
    try {
      setBusy("excel");
      await exportPayslipsExcel(runId);
      toast.success("Payslip Excel downloaded");
    } catch (err) {
      toast.error(err.message || "Payslip export failed");
    } finally {
      setBusy("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <Spinner size={36} borderWidth={4} />
        <p className="text-sm">Loading run…</p>
      </div>
    );
  }

  if (!run) return null;

  const isDraft = run.status === "draft";
  const isFinalized = run.status === "finalized";

  return (
    <>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeft size={14} /> Back to runs
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-semibold text-gray-800">
              {monthLabel(run.month, run.year)}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${runStatusClass(run.status)}`}
            >
              {run.status}
            </span>
          </div>
          <p className="text-gray-500 mt-1 text-sm italic">
            Review attendance, waive LOP, hold slips, then finalize.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isDraft && (
            <>
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={Boolean(busy)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {busy === "regenerate" ? (
                  <Spinner size={14} borderWidth={2} />
                ) : (
                  <RefreshCw size={14} />
                )}
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleFinalize}
                disabled={Boolean(busy)}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {busy === "finalize" ? (
                  <Spinner
                    size={14}
                    borderWidth={2}
                    className="border-white border-t-transparent"
                  />
                ) : (
                  <Lock size={14} />
                )}
                Finalize
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handlePayslipExport}
            disabled={Boolean(busy)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {busy === "excel" ? (
              <Spinner size={14} borderWidth={2} />
            ) : (
              <FileSpreadsheet size={14} />
            )}
            Excel
          </button>
          <button
            type="button"
            onClick={handleBankExport}
            disabled={!isFinalized || Boolean(busy)}
            title={
              isFinalized
                ? "Download bank CSV"
                : "Finalize the run before downloading the bank file"
            }
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy === "bank" ? (
              <Spinner
                size={14}
                borderWidth={2}
                className="border-white border-t-transparent"
              />
            ) : (
              <Download size={14} />
            )}
            Bank CSV
          </button>
        </div>
      </header>

      {missingBank.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="font-medium">
            {missingBank.length} employee(s) missing bank details
          </p>
          <p className="text-xs mt-1">
            They will be skipped in the bank file until details are added on
            their profile.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[960px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 border-b bg-gray-50">
                <th className="px-3 py-3 font-medium">Employee</th>
                <th className="px-2 py-3 font-medium text-right">Present</th>
                <th className="px-2 py-3 font-medium text-right">Paid leave</th>
                <th className="px-2 py-3 font-medium text-right">WO</th>
                <th className="px-2 py-3 font-medium text-right">Holiday</th>
                <th className="px-2 py-3 font-medium text-right">Sug. LOP</th>
                <th className="px-2 py-3 font-medium text-right">Final LOP</th>
                <th className="px-2 py-3 font-medium text-right">Gross</th>
                <th className="px-2 py-3 font-medium text-right">LOP amt</th>
                <th className="px-2 py-3 font-medium text-right">Net</th>
                <th className="px-2 py-3 font-medium">Bank</th>
                <th className="px-2 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payslips.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    No payslips in this run.
                  </td>
                </tr>
              ) : (
                payslips.map((slip) => {
                  const att = slip.attendance || {};
                  const emp = slip.employee || slip.employeeId;
                  const hasBank =
                    slip.hasBankDetails !== false && slip.hasBank !== false;
                  return (
                    <tr
                      key={slip._id}
                      onClick={() => setSelectedPayslipId(slip._id)}
                      className="border-b border-gray-50 hover:bg-blue-50/50 cursor-pointer"
                    >
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-gray-800">
                          {employeeDisplayName(emp)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {emp?.employeeId || ""}
                        </p>
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        {att.presentDays ?? "—"}
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        {att.paidLeaveDays ?? "—"}
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        {att.weeklyOffDays ?? "—"}
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        {att.holidayDays ?? "—"}
                      </td>
                      <td className="px-2 py-2.5 text-right text-amber-700">
                        {att.suggestedLopDays ?? "—"}
                      </td>
                      <td className="px-2 py-2.5 text-right font-medium">
                        {slip.finalLopDays ?? "—"}
                      </td>
                      <td className="px-2 py-2.5 text-right whitespace-nowrap">
                        {formatINR(slip.gross ?? slip.grossPay)}
                      </td>
                      <td className="px-2 py-2.5 text-right whitespace-nowrap text-red-600">
                        {formatINR(slip.lopAmount ?? slip.lopDeduction)}
                      </td>
                      <td className="px-2 py-2.5 text-right whitespace-nowrap font-medium">
                        {formatINR(slip.netPay ?? slip.net)}
                      </td>
                      <td className="px-2 py-2.5">
                        <span
                          className={`text-xs ${hasBank ? "text-green-600" : "text-red-600"}`}
                        >
                          {hasBank ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${payslipStatusClass(slip.status)}`}
                        >
                          {slip.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPayslipId && (
        <PayslipDetailModal
          runId={runId}
          payslipId={selectedPayslipId}
          runStatus={run.status}
          onClose={() => setSelectedPayslipId(null)}
          onSaved={fetchRun}
        />
      )}
    </>
  );
};

const PayrollRuns = () => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState(null);

  const fetchRuns = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPayrollRuns();
      const list = data.runs || data.data || [];
      setRuns(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.message || "Failed to load payroll runs");
      setRuns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedRunId) fetchRuns();
  }, [fetchRuns, selectedRunId]);

  if (selectedRunId) {
    return (
      <div className="bg-gray-100 flex flex-col h-full overflow-y-auto">
        <PayrollRunDetail
          runId={selectedRunId}
          onBack={() => setSelectedRunId(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-y-auto">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BadgeDollarSign size={22} className="text-blue-600" />
            <h1 className="text-3xl font-semibold text-gray-800">
              Payroll Runs
            </h1>
          </div>
          <p className="text-gray-500 mt-1 italic text-sm">
            Create monthly runs, review LOP, finalize, then export bank file.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          <Plus size={16} /> Create run
        </button>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
            <Spinner size={36} borderWidth={4} />
            <p className="text-sm">Loading runs…</p>
          </div>
        ) : runs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">
            No payroll runs yet. Create one for a month after setting salary
            structures.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                  <th className="pb-3 pr-4 font-medium">Period</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium text-right">Payslips</th>
                  <th className="pb-3 font-medium text-right">Created</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr
                    key={run._id}
                    onClick={() => setSelectedRunId(run._id)}
                    className="border-b border-gray-50 hover:bg-blue-50/50 cursor-pointer"
                  >
                    <td className="py-3 pr-4 font-medium text-gray-800">
                      {monthLabel(run.month, run.year)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${runStatusClass(run.status)}`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right text-gray-600">
                      {run.payslipCount ??
                        run.payslipsCount ??
                        run.payslips?.length ??
                        "—"}
                    </td>
                    <td className="py-3 text-right text-gray-500 text-xs">
                      {run.createdAt
                        ? new Date(run.createdAt).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateRunModal
          onClose={() => setShowCreate(false)}
          onCreated={(run) => {
            fetchRuns();
            if (run?._id) setSelectedRunId(run._id);
          }}
        />
      )}
    </div>
  );
};

export default PayrollRuns;
