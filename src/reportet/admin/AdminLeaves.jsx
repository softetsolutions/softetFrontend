import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  Users,
  User,
} from "lucide-react";
import {
  actionOnLeave,
  getLeaveTypes,
  getSubordinateLeaves,
} from "../api/leave";
import { formatDate } from "../utils/helperFunctions";
import Spinner from "../genericComps/Spinner";

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const statusBadge = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

const statusIcon = {
  pending: <Clock size={12} />,
  approved: <Check size={12} />,
  rejected: <X size={12} />,
};

const leaveTypeLabel = (leaveType) => {
  if (!leaveType) return "Leave";
  if (typeof leaveType === "string") return leaveType;
  return leaveType.name || leaveType.code || "Leave";
};

const leaveTypeCode = (leaveType) => {
  if (!leaveType || typeof leaveType === "string") return null;
  return leaveType.code || null;
};

const RejectModal = ({ leave, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    setSubmitting(true);
    await onConfirm(leave._id, reason.trim());
    setSubmitting(false);
  };

  const emp = leave.employeeId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            Reject Leave
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium text-gray-800">
              {emp?.firstName} {emp?.lastName}
            </span>{" "}
            · {emp?.employeeId}
          </p>
          <p>
            {leaveTypeLabel(leave.leaveType)}
            &nbsp;·&nbsp; {formatDate(leave.leaveDate)}
          </p>
        </div>

        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Rejection Reason
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="State why this leave is being rejected..."
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
        />

        <div className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <X size={14} /> {submitting ? "Rejecting..." : "Reject Leave"}
          </button>
        </div>
      </div>
    </div>
  );
};

const LeaveRow = ({ leave, actioningId, onApprove, onReject }) => {
  const emp = leave.employeeId;
  const isPending = leave.status === "pending";
  const isActioning = actioningId === leave._id;
  const code = leaveTypeCode(leave.leaveType);

  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">
          {emp?.firstName?.[0]}
          {emp?.lastName?.[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 leading-tight">
            {emp?.firstName} {emp?.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {emp?.employeeId} ·{" "}
            <span className="capitalize">{emp?.role}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 flex-1 items-center">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          {leaveTypeLabel(leave.leaveType)}
          {code ? ` (${code})` : ""}
        </span>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={12} className="text-gray-400" />
          {formatDate(leave.leaveDate)}
        </div>

        <span
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
            statusBadge[leave.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {statusIcon[leave.status]}
          {leave.status}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 truncate" title={leave.reason}>
          <span className="font-medium text-gray-600">Reason: </span>
          {leave.reason}
        </p>
        {leave.status === "rejected" && leave.rejectionReason && (
          <p
            className="text-xs text-red-500 truncate mt-0.5"
            title={leave.rejectionReason}
          >
            <span className="font-medium">Rejected: </span>
            {leave.rejectionReason}
          </p>
        )}
        {leave.status !== "pending" && leave.actionAt && (
          <p className="text-xs text-gray-400 mt-0.5">
            Actioned {formatDate(leave.actionAt)}
            {leave.approvedByRole && ` by ${leave.approvedByRole}`}
          </p>
        )}
      </div>

      {isPending ? (
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onApprove(leave._id)}
            disabled={isActioning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            <Check size={13} />
            {isActioning ? "..." : "Approve"}
          </button>
          <button
            type="button"
            onClick={() => onReject(leave)}
            disabled={isActioning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 rounded-md text-xs font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            <X size={13} /> Reject
          </button>
        </div>
      ) : (
        <div className="w-[120px] shrink-0" />
      )}
    </div>
  );
};

const LeaveSection = ({
  title,
  subtitle,
  icon,
  leaves,
  emptyText,
  actioningId,
  onApprove,
  onReject,
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-blue-600">{icon}</span>
        <div>
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <span className="text-xs text-gray-400">
        {leaves.length} request{leaves.length !== 1 ? "s" : ""}
      </span>
    </div>

    {leaves.length === 0 ? (
      <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
        <AlertCircle size={28} className="text-gray-300" />
        <p className="text-sm">{emptyText}</p>
      </div>
    ) : (
      <div className="divide-y divide-gray-100">
        {leaves.map((leave) => (
          <LeaveRow
            key={leave._id}
            leave={leave}
            actioningId={actioningId}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </div>
    )}
  </div>
);

const AdminLeaves = () => {
  const [directReports, setDirectReports] = useState([]);
  const [otherReports, setOtherReports] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const [filters, setFilters] = useState({
    status: "pending",
    leaveType: "",
    fromDate: "",
    toDate: "",
  });

  const totalCount = directReports.length + otherReports.length;

  const activeLeaveTypes = useMemo(
    () => leaveTypes.filter((t) => t.active !== false),
    [leaveTypes],
  );

  const fetchLeaveTypes = useCallback(async () => {
    try {
      const data = await getLeaveTypes({ includeInactive: true });
      const list = Array.isArray(data)
        ? data
        : data.leaveTypes || data.types || data.data || [];
      setLeaveTypes(list);
    } catch {
      // Filter dropdown can stay empty; list still works
      setLeaveTypes([]);
    }
  }, []);

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSubordinateLeaves({
        ...(filters.status && { status: filters.status }),
        ...(filters.leaveType && { leaveType: filters.leaveType }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
      });
      setDirectReports(data.directReports || []);
      setOtherReports(data.otherReports || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch leaves");
      setDirectReports([]);
      setOtherReports([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeaveTypes();
  }, [fetchLeaveTypes]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
    });
  };

  const handleApprove = async (leaveId) => {
    try {
      setActioningId(leaveId);
      const data = await actionOnLeave(leaveId, { action: "approved" });
      toast.success(data.message || "Leave approved");
      fetchLeaves();
    } catch (err) {
      toast.error(err.message || "Failed to approve leave");
    } finally {
      setActioningId(null);
    }
  };

  const handleRejectConfirm = async (leaveId, rejectionReason) => {
    try {
      setActioningId(leaveId);
      const data = await actionOnLeave(leaveId, {
        action: "rejected",
        rejectionReason,
      });
      toast.success(data.message || "Leave rejected");
      setRejectTarget(null);
      fetchLeaves();
    } catch (err) {
      toast.error(err.message || "Failed to reject leave");
    } finally {
      setActioningId(null);
    }
  };

  const hasActiveFilters =
    Boolean(filters.status) ||
    Boolean(filters.leaveType) ||
    Boolean(filters.fromDate) ||
    Boolean(filters.toDate);

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-auto">
      <header className="mb-6 flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Leave Requests
          </h1>
          <p className="text-gray-500 mt-1 italic">
            Review subordinate leaves — ZMs first, then other reports.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-500 flex items-center gap-2">
          <Calendar size={14} className="text-blue-500" />
          {totalCount} total request{totalCount !== 1 ? "s" : ""}
        </div>
      </header>

      {/* Filters (API-backed) — not separate page sections */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="mt-1 block w-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {STATUS_FILTERS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Leave type
            </label>
            <select
              value={filters.leaveType}
              onChange={(e) => handleFilterChange("leaveType", e.target.value)}
              className="mt-1 block w-48 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">All types</option>
              {activeLeaveTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name} ({type.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              From date
            </label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              className="mt-1 block border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              To date
            </label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
              className="mt-1 block border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-md transition"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md py-16 flex flex-col items-center justify-center gap-3">
          <Spinner size={40} borderWidth={4} />
          <p className="text-sm text-gray-400">Loading leave requests...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-6">
          <LeaveSection
            title="Direct reports"
            subtitle="Zonal Managers reporting to you"
            icon={<Users size={18} />}
            leaves={directReports}
            emptyText="No direct-report leave requests for these filters."
            actioningId={actioningId}
            onApprove={handleApprove}
            onReject={setRejectTarget}
          />

          <LeaveSection
            title="Other reports"
            subtitle="Area Managers and MRs further down the hierarchy"
            icon={<User size={18} />}
            leaves={otherReports}
            emptyText="No other-report leave requests for these filters."
            actioningId={actioningId}
            onApprove={handleApprove}
            onReject={setRejectTarget}
          />
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          leave={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
};

export default AdminLeaves;
