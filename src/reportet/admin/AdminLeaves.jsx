import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  AlertCircle,
} from "lucide-react";
import { getAllLeavesForAdmin, actionOnLeaveByAdmin } from "../api/leave";
import { formatDate } from "../utils/helperFunctions";

const STATUS_TABS = ["all", "areaManager", "pending", "approved", "rejected"];

const leaveTypeBadge = {
  sick: "bg-red-100 text-red-600",
  casual: "bg-purple-100 text-purple-600",
  earned: "bg-blue-100 text-blue-700",
  unpaid: "bg-yellow-100 text-yellow-700",
};

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            Reject Leave
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium text-gray-800">
              {leave.employeeId?.firstName} {leave.employeeId?.lastName}
            </span>{" "}
            · {leave.employeeId?.employeeId}
          </p>
          <p className="capitalize">
            {leave.leaveType} leave &nbsp;·&nbsp; {formatDate(leave.startDate)}{" "}
            → {formatDate(leave.endDate)}
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
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
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

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [pageNo, setPageNo] = useState(1);
  const [actioningId, setActioningId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const LIMIT = 10;

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      let params = { pageNo, limit: LIMIT };

      if (activeTab === "areaManager") {
        params.role = "areaManager";
      } else if (activeTab !== "all") {
        params.status = activeTab;
      }

      const data = await getAllLeavesForAdmin(params);
      setLeaves(data.leaves || []);
      setTotalCount(data.totalCount || 0);
    } catch {
      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPageNo(1);
  }, [activeTab]);

  useEffect(() => {
    fetchLeaves();
  }, [activeTab, pageNo]);

  const handleApprove = async (leaveId) => {
    try {
      setActioningId(leaveId);
      const data = await actionOnLeaveByAdmin(leaveId, { action: "approved" });
      toast.success(data.message);
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
      const data = await actionOnLeaveByAdmin(leaveId, {
        action: "rejected",
        rejectionReason,
      });
      toast.success(data.message);
      setRejectTarget(null);
      fetchLeaves();
    } catch (err) {
      toast.error(err.message || "Failed to reject leave");
    } finally {
      setActioningId(null);
    }
  };

  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    <div className="bg-gray-100 flex flex-col h-full">
      {/* Header */}
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Leave Requests
          </h1>
          <p className="text-gray-500 mt-1 italic">
            Review and action employee leave applications.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-500 flex items-center gap-2">
          <Calendar size={14} className="text-blue-500" />
          {totalCount} total request{totalCount !== 1 ? "s" : ""}
        </div>
      </header>

      {/* Status tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 flex overflow-hidden">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {tab === "areaManager" ? "Area Manager" : tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md flex-1 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">
            Loading leave requests...
          </div>
        ) : leaves.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
            <AlertCircle size={32} className="text-gray-300" />
            <p className="text-sm">
              No {activeTab === "all" ? "" : activeTab} leave requests found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leaves.map((leave) => {
              const emp = leave.employeeId;
              const isPending = leave.status === "pending";
              const isActioning = actioningId === leave._id;

              return (
                <div
                  key={leave._id}
                  className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar + employee info */}
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

                  {/* Leave details */}
                  <div className="flex flex-wrap gap-3 flex-1 items-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        leaveTypeBadge[leave.leaveType] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {leave.leaveType}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={12} className="text-gray-400" />
                      {formatDate(leave.startDate)} →{" "}
                      {formatDate(leave.endDate)}
                    </div>

                    <span
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        statusBadge[leave.status]
                      }`}
                    >
                      {statusIcon[leave.status]}
                      {leave.status}
                    </span>
                  </div>

                  {/* Reason / rejection reason */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs text-gray-500 truncate"
                      title={leave.reason}
                    >
                      <span className="font-medium text-gray-600">
                        Reason:{" "}
                      </span>
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
                        {leave.actionByRole && ` by ${leave.actionByRole}`}
                      </p>
                    )}
                  </div>

                  {isPending ? (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(leave._id)}
                        disabled={isActioning}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        <Check size={13} />
                        {isActioning ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => setRejectTarget(leave)}
                        disabled={isActioning}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 rounded-md text-xs font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        <X size={13} /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="w-[120px] shrink-0" /> /* keeps layout stable */
                  )}
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              Page {pageNo} of {totalPages} &nbsp;·&nbsp; {totalCount} records
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPageNo((p) => Math.max(1, p - 1))}
                disabled={pageNo === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <button
                onClick={() => setPageNo((p) => Math.min(totalPages, p + 1))}
                disabled={pageNo === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

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
