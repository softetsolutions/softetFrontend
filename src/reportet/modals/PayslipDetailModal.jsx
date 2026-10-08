import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Printer, X } from "lucide-react";
import { getPayslip, updatePayslip } from "../api/payroll";
import Spinner from "../genericComps/Spinner";
import {
  employeeDisplayName,
  formatINR,
  monthLabel,
  payslipStatusClass,
  sumLineItems,
} from "../utils/payrollHelpers";

const AttendanceGrid = ({ attendance }) => {
  if (!attendance) return null;
  const rows = [
    ["Calendar days", attendance.calendarDays],
    ["Weekly offs", attendance.weeklyOffDays],
    ["Holidays", attendance.holidayDays],
    ["Present", attendance.presentDays],
    ["Paid leave", attendance.paidLeaveDays],
    ["Unpaid leave", attendance.unpaidLeaveDays],
    ["Absent", attendance.absentDays],
    ["Working days", attendance.workingDaysInMonth],
    ["Suggested LOP", attendance.suggestedLopDays],
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
        >
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            {label}
          </p>
          <p className="text-sm font-medium text-gray-800 mt-0.5">
            {value ?? "—"}
          </p>
        </div>
      ))}
    </div>
  );
};

const PayslipDetailModal = ({
  runId,
  payslipId,
  runStatus,
  onClose,
  onSaved,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [payslip, setPayslip] = useState(null);
  const [orgMeta, setOrgMeta] = useState(null);
  const [finalLopDays, setFinalLopDays] = useState("0");
  const [status, setStatus] = useState("draft");
  const [holdReason, setHoldReason] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const isDraftRun = runStatus === "draft";
  const canEdit = isDraftRun && payslip?.status !== "finalized";

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPayslip(runId, payslipId);
        if (cancelled) return;
        const slip = data.payslip || data.data || data;
        setPayslip(slip);
        setOrgMeta(data.organization || data.org || null);
        setFinalLopDays(
          String(
            slip.finalLopDays ?? slip.attendance?.suggestedLopDays ?? 0,
          ),
        );
        setStatus(slip.status || "draft");
        setHoldReason(slip.holdReason || "");
        setAdminNote(slip.adminNote || "");
      } catch (err) {
        toast.error(err.message || "Failed to load payslip");
        onClose?.();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [runId, payslipId, onClose]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canEdit) return;

    const lop = Number(finalLopDays);
    if (!Number.isFinite(lop) || lop < 0) {
      toast.error("Final LOP days must be a non-negative number");
      return;
    }
    if (status === "onHold" && !holdReason.trim()) {
      toast.error("Hold reason is required when status is On hold");
      return;
    }

    const payload = {
      finalLopDays: lop,
      status,
      adminNote: adminNote.trim() || undefined,
    };
    if (status === "onHold") payload.holdReason = holdReason.trim();

    try {
      setSaving(true);
      const data = await updatePayslip(runId, payslipId, payload);
      toast.success(data.message || "Payslip updated");
      onSaved?.(data.payslip || data);
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to update payslip");
    } finally {
      setSaving(false);
    }
  };

  const emp = payslip?.employee || payslip?.employeeId;
  const earnings = payslip?.earnings || payslip?.salaryStructure?.earnings || [];
  const deductions =
    payslip?.deductions || payslip?.structureDeductions || [];
  const gross =
    payslip?.gross ?? payslip?.grossPay ?? sumLineItems(earnings);
  const structureDed =
    payslip?.structureDeductionsTotal ?? sumLineItems(deductions);
  const lopAmount = payslip?.lopAmount ?? payslip?.lopDeduction;
  const net = payslip?.netPay ?? payslip?.net;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 print:static print:bg-white print:p-0">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto print:shadow-none print:max-w-none print:max-h-none print:rounded-none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 print:hidden sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-gray-800">
            Payslip detail
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              <Printer size={14} /> Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <Spinner size={36} borderWidth={4} />
            <p className="text-sm">Loading payslip…</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="px-6 py-5 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                {(orgMeta?.brandName || orgMeta?.name) && (
                  <p className="text-lg font-semibold text-gray-900">
                    {orgMeta.brandName || orgMeta.name}
                  </p>
                )}
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {employeeDisplayName(emp)}
                  {emp?.employeeId ? (
                    <span className="text-gray-400 font-normal">
                      {" "}
                      · {emp.employeeId}
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {monthLabel(payslip?.month, payslip?.year)}
                </p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${payslipStatusClass(payslip?.status)}`}
              >
                {payslip?.status || "—"}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Attendance
              </h3>
              <AttendanceGrid attendance={payslip?.attendance} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Earnings
                </h3>
                <ul className="space-y-1 text-sm">
                  {earnings.length === 0 ? (
                    <li className="text-gray-500">—</li>
                  ) : (
                    earnings.map((row, i) => (
                      <li
                        key={`${row.code}-${i}`}
                        className="flex justify-between gap-2"
                      >
                        <span className="text-gray-600">
                          {row.label || row.code}
                        </span>
                        <span className="font-medium text-gray-800">
                          {formatINR(row.amount)}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
                <p className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t">
                  <span>Gross</span>
                  <span>{formatINR(gross)}</span>
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Deductions
                </h3>
                <ul className="space-y-1 text-sm">
                  {deductions.length === 0 ? (
                    <li className="text-gray-500">Structure deductions —</li>
                  ) : (
                    deductions.map((row, i) => (
                      <li
                        key={`${row.code}-${i}`}
                        className="flex justify-between gap-2"
                      >
                        <span className="text-gray-600">
                          {row.label || row.code}
                        </span>
                        <span className="font-medium text-gray-800">
                          {formatINR(row.amount)}
                        </span>
                      </li>
                    ))
                  )}
                  <li className="flex justify-between gap-2 text-red-700">
                    <span>LOP</span>
                    <span className="font-medium">{formatINR(lopAmount)}</span>
                  </li>
                </ul>
                <p className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t">
                  <span>Structure deductions</span>
                  <span>{formatINR(structureDed)}</span>
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 flex flex-wrap justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  Net pay
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatINR(net)}
                </p>
              </div>
              <div className="text-right text-xs text-gray-500 self-end">
                Bank:{" "}
                {payslip?.hasBankDetails === false ||
                payslip?.hasBank === false
                  ? "Missing"
                  : "Available"}
              </div>
            </div>

            {canEdit ? (
              <div className="space-y-3 border-t border-gray-100 pt-4 print:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Final LOP days
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={finalLopDays}
                      onChange={(e) => setFinalLopDays(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Suggested:{" "}
                      {payslip?.attendance?.suggestedLopDays ?? "—"} · Set 0 to
                      waive
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="draft">Draft</option>
                      <option value="onHold">On hold</option>
                    </select>
                  </div>
                </div>
                {status === "onHold" && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hold reason <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={holdReason}
                      onChange={(e) => setHoldReason(e.target.value)}
                      placeholder="Pending clarification"
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin note
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={2}
                    placeholder="Waived LOP as per manager"
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
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
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving && (
                      <Spinner
                        size={16}
                        borderWidth={2}
                        className="border-white border-t-transparent"
                      />
                    )}
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 border-t pt-3 print:hidden">
                {payslip?.adminNote && (
                  <p className="mb-1">Note: {payslip.adminNote}</p>
                )}
                {payslip?.holdReason && (
                  <p>Hold reason: {payslip.holdReason}</p>
                )}
                {!isDraftRun && (
                  <p className="mt-1">Run is finalized — payslip is locked.</p>
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default PayslipDetailModal;
