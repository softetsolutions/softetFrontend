import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Settings2 } from "lucide-react";
import {
  getPayrollSettings,
  updatePayrollSettings,
} from "../api/payroll";
import Spinner from "../genericComps/Spinner";
import { WEEKDAYS } from "../utils/payrollHelpers";

const PayrollSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weeklyOffWeekdays, setWeeklyOffWeekdays] = useState([0]);
  const [lopDivisorMethod, setLopDivisorMethod] = useState("calendar_days");

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPayrollSettings();
      const settings = data.settings || data.data || data;
      setWeeklyOffWeekdays(
        Array.isArray(settings.weeklyOffWeekdays)
          ? settings.weeklyOffWeekdays
          : [0],
      );
      setLopDivisorMethod(settings.lopDivisorMethod || "calendar_days");
    } catch (err) {
      toast.error(err.message || "Failed to load payroll settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const toggleWeekday = (day) => {
    setWeeklyOffWeekdays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b),
    );
  };

  const handleSave = async () => {
    if (weeklyOffWeekdays.length === 0) {
      toast.error("Select at least one weekly off day");
      return;
    }
    try {
      setSaving(true);
      await updatePayrollSettings({ weeklyOffWeekdays, lopDivisorMethod });
      toast.success("Payroll settings saved");
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-y-auto">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 size={22} className="text-blue-600" />
            <h1 className="text-3xl font-semibold text-gray-800">
              Payroll Settings
            </h1>
          </div>
          <p className="text-gray-500 mt-1 italic text-sm">
            Weekly offs and LOP divisor for payroll calculation.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {saving && (
            <Spinner
              size={16}
              borderWidth={2}
              className="border-white border-t-transparent"
            />
          )}
          {saving ? "Saving…" : "Save settings"}
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <Spinner size={36} borderWidth={4} />
          <p className="text-sm">Loading settings…</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
              Weekly offs
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              These days are paid and never count as LOP. Default is Sunday.
            </p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => {
                const active = weeklyOffWeekdays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleWeekday(day.value)}
                    className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                      active
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
              LOP divisor method
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              LOP amount = (gross ÷ divisor) × final LOP days.
            </p>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="lopDivisor"
                  checked={lopDivisorMethod === "calendar_days"}
                  onChange={() => setLopDivisorMethod("calendar_days")}
                  className="mt-1"
                />
                <span>
                  <span className="text-sm font-medium text-gray-800 block">
                    Calendar days
                  </span>
                  <span className="text-xs text-gray-500">
                    Divisor = days in the month (default).
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="lopDivisor"
                  checked={lopDivisorMethod === "working_days"}
                  onChange={() => setLopDivisorMethod("working_days")}
                  className="mt-1"
                />
                <span>
                  <span className="text-sm font-medium text-gray-800 block">
                    Working days
                  </span>
                  <span className="text-xs text-gray-500">
                    Divisor = working days in the month (excl. weekly offs &amp;
                    holidays).
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-800 space-y-1">
            <p className="font-medium">Day priority (highest first)</p>
            <p>
              Weekly off → Holiday → Present (visit) → Paid leave → Unpaid leave
              → Absent
            </p>
            <p className="pt-1">
              Suggested LOP = unpaid leave + absent expected working days. Admin
              can set final LOP to 0 (or any value) before finalize.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollSettings;
