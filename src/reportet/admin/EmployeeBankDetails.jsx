import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Landmark } from "lucide-react";
import {
  getEmployeeBankDetails,
  upsertEmployeeBankDetails,
} from "../api/payroll";
import Spinner from "../genericComps/Spinner";

const emptyBank = {
  accountHolderName: "",
  accountNumber: "",
  ifsc: "",
  bankName: "",
  accountType: "savings",
};

const EmployeeBankDetails = ({ employeeMongoId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyBank);
  const [saved, setSaved] = useState(null);

  const fetchBank = useCallback(async () => {
    if (!employeeMongoId) return;
    try {
      setLoading(true);
      const data = await getEmployeeBankDetails(employeeMongoId);
      const bank = data.bankDetails || data.data || data;
      if (bank && (bank.accountNumber || bank.accountHolderName)) {
        const next = {
          accountHolderName: bank.accountHolderName || "",
          accountNumber: bank.accountNumber || "",
          ifsc: bank.ifsc || "",
          bankName: bank.bankName || "",
          accountType: bank.accountType || "savings",
        };
        setSaved(next);
        setForm(next);
      } else {
        setSaved(null);
        setForm(emptyBank);
      }
    } catch (err) {
      if (err.status === 404) {
        setSaved(null);
        setForm(emptyBank);
      } else {
        toast.error(err.message || "Failed to load bank details");
      }
    } finally {
      setLoading(false);
    }
  }, [employeeMongoId]);

  useEffect(() => {
    fetchBank();
  }, [fetchBank]);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.accountHolderName.trim()) {
      toast.error("Account holder name is required");
      return;
    }
    if (!form.accountNumber.trim()) {
      toast.error("Account number is required");
      return;
    }
    if (!form.ifsc.trim()) {
      toast.error("IFSC is required");
      return;
    }

    const payload = {
      accountHolderName: form.accountHolderName.trim(),
      accountNumber: form.accountNumber.trim(),
      ifsc: form.ifsc.trim().toUpperCase(),
      accountType: form.accountType || "savings",
    };
    if (form.bankName.trim()) payload.bankName = form.bankName.trim();

    try {
      setSaving(true);
      await upsertEmployeeBankDetails(employeeMongoId, payload);
      toast.success("Bank details saved");
      setEditMode(false);
      await fetchBank();
    } catch (err) {
      toast.error(err.message || "Failed to save bank details");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(saved || emptyBank);
    setEditMode(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Landmark size={16} className="text-gray-400" />
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Bank Details
          </h3>
        </div>
        {!loading &&
          (editMode ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 disabled:opacity-50"
              >
                {saving && (
                  <Spinner
                    size={12}
                    borderWidth={2}
                    className="border-white border-t-transparent"
                  />
                )}
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
            >
              {saved ? "Edit" : "Add bank details"}
            </button>
          ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
          <Spinner size={16} borderWidth={2} /> Loading…
        </div>
      ) : editMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Account holder <span className="text-red-500">*</span>
            </label>
            <input
              value={form.accountHolderName}
              onChange={(e) => setField("accountHolderName", e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Account number <span className="text-red-500">*</span>
            </label>
            <input
              value={form.accountNumber}
              onChange={(e) => setField("accountNumber", e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              IFSC <span className="text-red-500">*</span>
            </label>
            <input
              value={form.ifsc}
              onChange={(e) => setField("ifsc", e.target.value.toUpperCase())}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm uppercase"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bank name
            </label>
            <input
              value={form.bankName}
              onChange={(e) => setField("bankName", e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Account type
            </label>
            <select
              value={form.accountType}
              onChange={(e) => setField("accountType", e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>
          </div>
        </div>
      ) : !saved ? (
        <p className="text-sm text-gray-500">
          No bank details yet. Required for bank file export.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Account holder
            </p>
            <p className="mt-1 text-gray-800">{saved.accountHolderName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Account number
            </p>
            <p className="mt-1 text-gray-800">{saved.accountNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">IFSC</p>
            <p className="mt-1 text-gray-800">{saved.ifsc}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Bank
            </p>
            <p className="mt-1 text-gray-800">{saved.bankName || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Type
            </p>
            <p className="mt-1 text-gray-800 capitalize">
              {saved.accountType || "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeBankDetails;
