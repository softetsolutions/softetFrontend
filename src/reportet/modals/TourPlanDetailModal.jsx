import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  Check,
  MapPin,
  Stethoscope,
  X,
  AlertCircle,
} from "lucide-react";
import {
  actionOnTourPlan,
  getSubordinateTourPlanDetail,
} from "../api/tourPlan";
import { formatDate } from "../utils/helperFunctions";
import Spinner from "../genericComps/Spinner";

const STATUS_BADGE = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

const ROLE_LABELS = {
  mr: "MR",
  areaManager: "Area Manager",
  zonalManager: "Zonal Manager",
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const RejectRemarkModal = ({ plan, onClose, onConfirm, submitting }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error("Rejection remark is required");
      return;
    }
    onConfirm(reason.trim());
  };

  const emp = plan?.employee;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">
            Reject Tour Plan
          </h3>
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
              {emp?.displayName ||
                `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim()}
            </span>{" "}
            · {emp?.employeeId}
          </p>
          <p>
            {MONTH_NAMES[(plan?.month || 1) - 1]} {plan?.year}
          </p>
        </div>

        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Rejection Remark
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain why this tour plan is being rejected..."
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
        />

        <div className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
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
            <X size={14} /> {submitting ? "Rejecting..." : "Reject Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DayPlanRow = ({ day }) => {
  const areas = day.areas || [];
  const doctors = day.doctors || [];

  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={14} className="text-blue-500" />
        <span className="text-sm font-medium text-gray-800">
          {formatDate(day.date)}
        </span>
      </div>

      {areas.length > 0 ? (
        <div className="mb-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
            <MapPin size={10} /> Areas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {areas.map((area) => (
              <span
                key={area.areaId || area._id}
                className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700"
              >
                {area.displayLabel || area.name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic mb-2">No areas planned</p>
      )}

      {doctors.length > 0 ? (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
            <Stethoscope size={10} /> Doctors
          </p>
          <ul className="space-y-1">
            {doctors.map((doc) => (
              <li
                key={doc.doctorId || doc._id}
                className="text-xs text-gray-700"
              >
                {doc.name}
                {doc.specialty && (
                  <span className="text-gray-400"> · {doc.specialty}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">No doctors planned</p>
      )}
    </div>
  );
};

const TourPlanDetailModal = ({ planId, onClose, onActionComplete }) => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [actioning, setActioning] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const loadPlan = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSubordinateTourPlanDetail(planId);
      setPlan(data.data || data.plan || data);
    } catch (err) {
      toast.error(err.message || "Failed to load tour plan");
      if (err.status === 404) onClose?.();
    } finally {
      setLoading(false);
    }
  }, [planId, onClose]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const handleApprove = async () => {
    try {
      setActioning(true);
      const data = await actionOnTourPlan(planId, { action: "approved" });
      toast.success(data.message || "Tour plan approved");
      const updated = data.data || data.plan || data;
      setPlan(updated);
      onActionComplete?.(updated);
    } catch (err) {
      toast.error(err.message || "Failed to approve tour plan");
      if (err.status === 409) loadPlan();
    } finally {
      setActioning(false);
    }
  };

  const handleReject = async (rejectionReason) => {
    try {
      setActioning(true);
      const data = await actionOnTourPlan(planId, {
        action: "rejected",
        rejectionReason,
      });
      toast.success(data.message || "Tour plan rejected");
      setShowRejectModal(false);
      const updated = data.data || data.plan || data;
      setPlan(updated);
      onActionComplete?.(updated);
    } catch (err) {
      toast.error(err.message || "Failed to reject tour plan");
      if (err.status === 409) loadPlan();
    } finally {
      setActioning(false);
    }
  };

  const emp = plan?.employee;
  const isSubmitted = plan?.status === "submitted";
  const plannedDays = plan?.days || [];
  const sortedDays = [...plannedDays].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Tour Plan Details
              </h2>
              {plan && (
                <p className="text-sm text-gray-500 mt-1">
                  {MONTH_NAMES[(plan.month || 1) - 1]} {plan.year}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6">
            {loading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <Spinner size={36} borderWidth={4} />
                <p className="text-sm text-gray-400">Loading tour plan...</p>
              </div>
            ) : !plan ? (
              <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
                <AlertCircle size={28} />
                <p className="text-sm">Tour plan not found</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-base font-medium text-gray-800">
                      {emp?.displayName ||
                        `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {emp?.employeeId} ·{" "}
                      {ROLE_LABELS[emp?.role] || emp?.role}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        STATUS_BADGE[plan.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {plan.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {plan.summary?.plannedDaysCount ?? 0} /{" "}
                      {plan.summary?.totalWorkingDays ?? 0} days planned
                    </span>
                  </div>
                </div>

                {plan.submittedAt && (
                  <p className="text-xs text-gray-400 mb-4">
                    Submitted {formatDate(plan.submittedAt)}
                  </p>
                )}

                {plan.status === "rejected" && plan.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                      Rejection reason
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      {plan.rejectionReason}
                    </p>
                  </div>
                )}

                {plan.reviewedAt && (
                  <p className="text-xs text-gray-400 mb-4">
                    Reviewed {formatDate(plan.reviewedAt)}
                    {plan.reviewedByRole && ` by ${plan.reviewedByRole}`}
                  </p>
                )}

                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Day-by-day plan
                </h3>

                {sortedDays.length === 0 ? (
                  <p className="text-sm text-gray-400 italic py-8 text-center">
                    No planned days in this tour plan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sortedDays.map((day) => (
                      <DayPlanRow key={day.date} day={day} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {plan && isSubmitted && (
            <div className="flex gap-2 p-6 border-t border-gray-100 shrink-0 justify-end">
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                disabled={actioning}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-600 rounded-md text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <X size={14} /> Reject
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={actioning}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Check size={14} />
                {actioning ? "Processing..." : "Approve"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showRejectModal && plan && (
        <RejectRemarkModal
          plan={plan}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleReject}
          submitting={actioning}
        />
      )}
    </>
  );
};

export default TourPlanDetailModal;
