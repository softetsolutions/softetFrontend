import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Settings2, X } from "lucide-react";
import {
  createLeaveType,
  getLeaveTypes,
  updateLeaveType,
} from "../api/leave";
import Spinner from "../genericComps/Spinner";

const emptyForm = {
  name: "",
  code: "",
  annualQuota: "",
  paid: true,
  creditWindow: "YEARLY",
  creditAmount: "",
  carryForward: false,
  maxCarryForward: "0",
  active: true,
};

const toForm = (type) => ({
  name: type.name || "",
  code: type.code || "",
  annualQuota: type.annualQuota ?? "",
  paid: type.paid !== false,
  creditWindow: type.creditWindow || "YEARLY",
  creditAmount:
    type.creditAmount !== undefined && type.creditAmount !== null
      ? type.creditAmount
      : "",
  carryForward: Boolean(type.carryForward),
  maxCarryForward: type.maxCarryForward ?? 0,
  active: type.active !== false,
});

const LeaveTypeFormModal = ({ mode, initial, onClose, onSaved }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = mode === "edit";

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const code = form.code.trim().toUpperCase();
    const annualQuota = Number(form.annualQuota);

    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (!isEdit && !code) {
      toast.error("Code is required");
      return;
    }
    if (!Number.isFinite(annualQuota) || annualQuota < 0) {
      toast.error("Annual quota must be a valid number");
      return;
    }

    const payload = {
      name,
      annualQuota,
      paid: Boolean(form.paid),
      creditWindow: form.creditWindow || "YEARLY",
      carryForward: Boolean(form.carryForward),
      maxCarryForward: Number(form.maxCarryForward) || 0,
      active: Boolean(form.active),
    };

    if (!isEdit) payload.code = code;

    if (form.creditAmount !== "" && form.creditAmount !== null) {
      const creditAmount = Number(form.creditAmount);
      if (!Number.isFinite(creditAmount) || creditAmount < 0) {
        toast.error("Credit amount must be a valid number");
        return;
      }
      payload.creditAmount = creditAmount;
    }

    try {
      setSubmitting(true);
      if (isEdit) {
        await updateLeaveType(initial._id, payload);
        toast.success("Leave type updated");
      } else {
        await createLeaveType(payload);
        toast.success("Leave type created — balances seeded for active employees");
      }
      onSaved?.();
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to save leave type");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            {isEdit ? "Edit Leave Type" : "Add Leave Type"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Casual Leave"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code {!isEdit && <span className="text-red-500">*</span>}
              </label>
              <input
                value={form.code}
                onChange={(e) => setField("code", e.target.value.toUpperCase())}
                placeholder="CL"
                disabled={isEdit}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm uppercase focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-500"
                required={!isEdit}
              />
              {isEdit && (
                <p className="text-[11px] text-gray-400 mt-1">
                  Code cannot be changed after create
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Annual quota <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.annualQuota}
                onChange={(e) => setField("annualQuota", e.target.value)}
                placeholder="12"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit window
              </label>
              <select
                value={form.creditWindow}
                onChange={(e) => setField("creditWindow", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="YEARLY">YEARLY</option>
                <option value="MONTHLY">MONTHLY</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit amount
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.creditAmount}
                onChange={(e) => setField("creditAmount", e.target.value)}
                placeholder="Defaults to annual quota"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max carry forward
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.maxCarryForward}
                onChange={(e) => setField("maxCarryForward", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.paid}
                onChange={(e) => setField("paid", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Paid leave
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.carryForward}
                onChange={(e) => setField("carryForward", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Carry forward
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setField("active", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Active
            </label>
          </div>

          {isEdit && (
            <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-md px-3 py-2">
              Changing annual quota adjusts every employee balance by the
              delta. Reactivating seeds missing balances.
            </p>
          )}

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
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Create leave type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LeaveSettings = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode: 'create'|'edit', type? }

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLeaveTypes({ includeInactive: true });
      const list = Array.isArray(data)
        ? data
        : data.types || data.leaveTypes || data.data || [];
      setTypes(list);
    } catch (err) {
      toast.error(err.message || "Failed to load leave types");
      setTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const openCreate = () => setModal({ mode: "create", type: null });
  const openEdit = (type) => setModal({ mode: "edit", type });

  const handleToggleActive = async (type) => {
    try {
      await updateLeaveType(type._id, { active: !type.active });
      toast.success(
        type.active ? "Leave type deactivated" : "Leave type activated",
      );
      fetchTypes();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-hidden">
      <header className="mb-6 flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            <Settings2 size={28} className="text-blue-600" />
            Leave Settings
          </h1>
          <p className="text-gray-500 mt-1 italic">
            Configure leave types and yearly quotas for your organization.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Leave Type
        </button>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">Leave Types</h2>
          <span className="text-sm text-gray-400">
            {types.length} type{types.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spinner size={40} borderWidth={4} />
            <p className="text-sm text-gray-400">Loading leave types…</p>
          </div>
        ) : types.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <Settings2 size={32} className="text-gray-300" />
            <p className="text-sm">No leave types yet.</p>
            <button
              type="button"
              onClick={openCreate}
              className="text-sm text-blue-600 hover:underline"
            >
              Create your first leave type
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 min-h-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quota
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carry forward
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {types.map((type) => (
                  <tr key={type._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {type.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-xs">
                        {type.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {type.annualQuota}
                      <span className="text-xs text-gray-400 ml-1">
                        / {type.creditWindow || "YEARLY"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          type.paid
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {type.paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {type.carryForward
                        ? `Yes (max ${type.maxCarryForward ?? 0})`
                        : "No"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(type)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          type.active !== false
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title="Click to toggle active"
                      >
                        {type.active !== false ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(type)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <LeaveTypeFormModal
          key={`${modal.mode}-${modal.type?._id || "new"}`}
          mode={modal.mode}
          initial={
            modal.mode === "edit"
              ? { ...toForm(modal.type), _id: modal.type._id }
              : emptyForm
          }
          onClose={() => setModal(null)}
          onSaved={fetchTypes}
        />
      )}
    </div>
  );
};

export default LeaveSettings;
