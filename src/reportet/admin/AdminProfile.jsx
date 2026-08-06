import { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  UserX,
  Plus,
} from "lucide-react";
import { useOrganization } from "../admin/OrganizationContext";
import {
  updateBranding,
  getAllHeadQuarterNames,
  getUnassignedHierarchy,
  getHeadQuarterBudget,
  setHeadQuarterBudget,
  getConfiguredFinancialYears,
} from "../api/profile";

const API_BASE_URL = import.meta.env.VITE_REPORTET_BASE_URL;

const ASSET_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

const FY_MONTHS = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

const getCurrentFinancialYear = () => {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${year}-${year + 1}`;
};

const buildDefaultFinancialYearRange = () => {
  const currentStartYear = parseInt(
    getCurrentFinancialYear().split("-")[0],
    10,
  );
  const options = [];
  for (let offset = -10; offset <= 3; offset++) {
    const start = currentStartYear + offset;
    options.push(`${start}-${start + 1}`);
  }
  return options.sort().reverse();
};

const isValidFYFormat = (fy) => {
  if (!/^\d{4}-\d{4}$/.test(fy)) return false;
  const [start, end] = fy.split("-").map(Number);
  return end === start + 1;
};

const StatusBanner = ({ status }) => {
  if (!status) return null;
  const isError = status.type === "error";
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium mb-4 ${
        isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
      }`}
    >
      {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      {status.message}
    </div>
  );
};

const BrandingSection = () => {
  const { organization, refreshOrganization } = useOrganization();

  const [brandName, setBrandName] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Sync state whenever the active organization context changes
  useEffect(() => {
    if (organization) {
      setBrandName(organization.brandName || "");
      if (organization.logoUrl) {
        const cacheBuster = `?t=${new Date().getTime()}`;
        setLogoPreview(
          `${ASSET_BASE_URL}${organization.logoUrl}${cacheBuster}`,
        );
      } else {
        setLogoPreview(null);
      }
    } else {
      setBrandName("");
      setLogoPreview(null);
    }
  }, [organization]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!brandName.trim() && !logoFile) {
      setStatus({
        type: "error",
        message: "Provide a brand name or logo to update",
      });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      const formData = new FormData();
      if (brandName.trim()) formData.append("brandName", brandName.trim());
      if (logoFile) formData.append("logo", logoFile);

      await updateBranding(formData);

      // Re-fetch organization context to propagate changes everywhere in the app
      await refreshOrganization();

      setLogoFile(null);
      setStatus({ type: "success", message: "Branding updated successfully" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to update branding",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Branding</h2>
      <p className="text-sm text-gray-500 mb-5">
        Customize your organization's display name and logo.
      </p>

      <StatusBanner status={status} />

      <div className="flex items-center gap-5 mb-5">
        <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Organization logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xs text-gray-400 text-center px-2">
              No logo
            </span>
          )}
        </div>
        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
          <Upload size={16} />
          Upload logo
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Brand Name
        </label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="ReportET"
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        {saving ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        {saving ? "Saving..." : "Save Branding"}
      </button>
    </div>
  );
};
const BudgetSection = () => {
  const [headquarters, setHeadquarters] = useState([]);
  const [selectedHQ, setSelectedHQ] = useState("");
  const [financialYear, setFinancialYear] = useState(getCurrentFinancialYear());
  const [fyOptions, setFyOptions] = useState(buildDefaultFinancialYearRange());
  const [showAddYear, setShowAddYear] = useState(false);
  const [customYearInput, setCustomYearInput] = useState("");
  const [customYearError, setCustomYearError] = useState("");
  const [months, setMonths] = useState(
    FY_MONTHS.map((month) => ({ month, allocatedBudget: 0 })),
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [hasExistingBudget, setHasExistingBudget] = useState(false);

  useEffect(() => {
    const fetchHQs = async () => {
      try {
        const data = await getAllHeadQuarterNames();
        const list = data.headQuarterNames || [];
        setHeadquarters(list);
        if (list.length) setSelectedHQ(list[0]._id);
      } catch (err) {
        setStatus({
          type: "error",
          message: err.message || "Failed to load headquarters",
        });
      }
    };
    fetchHQs();
  }, []);

  useEffect(() => {
    const mergeConfiguredYears = async () => {
      try {
        const res = await getConfiguredFinancialYears();
        const configured = res.financialYears || [];
        if (!configured.length) return;
        setFyOptions((prev) => {
          const merged = new Set([...prev, ...configured]);
          return [...merged].sort().reverse();
        });
      } catch (err) {
        console.error(
          "Failed to fetch configured financial years:",
          err.message,
        );
      }
    };
    mergeConfiguredYears();
  }, []);

  const handleAddCustomYear = () => {
    const trimmed = customYearInput.trim();
    if (!isValidFYFormat(trimmed)) {
      setCustomYearError("Use the format YYYY-YYYY, e.g. 2015-2016");
      return;
    }
    setFyOptions((prev) => {
      if (prev.includes(trimmed)) return prev;
      return [...prev, trimmed].sort().reverse();
    });
    setFinancialYear(trimmed);
    setCustomYearInput("");
    setCustomYearError("");
    setShowAddYear(false);
  };

  const fetchBudget = useCallback(async () => {
    if (!selectedHQ || !financialYear) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await getHeadQuarterBudget(selectedHQ, financialYear);
      if (res) {
        setMonths(res.data.months);
        setHasExistingBudget(true);
      } else {
        setMonths(FY_MONTHS.map((month) => ({ month, allocatedBudget: 0 })));
        setHasExistingBudget(false);
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to load budget",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedHQ, financialYear]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const handleMonthChange = (monthName, value) => {
    setMonths((prev) =>
      prev.map((m) =>
        m.month === monthName
          ? { ...m, allocatedBudget: Number(value) || 0 }
          : m,
      ),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await setHeadQuarterBudget(selectedHQ, { financialYear, months });
      setHasExistingBudget(true);
      setStatus({ type: "success", message: "Budget saved successfully" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to save budget",
      });
    } finally {
      setSaving(false);
    }
  };

  const total = months.reduce((sum, m) => sum + (m.allocatedBudget || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Monthly Budget Management
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Set the allocated budget for each headquarter, month by month, for a
        financial year.
      </p>

      <StatusBanner status={status} />

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Headquarter
          </label>
          <select
            value={selectedHQ}
            onChange={(e) => setSelectedHQ(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[220px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {headquarters.map((hq) => (
              <option key={hq._id} value={hq._id}>
                {hq.headQuarterName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Financial Year
          </label>
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fyOptions.map((fy) => (
              <option key={fy} value={fy}>
                {fy}
              </option>
            ))}
          </select>
        </div>

        {!showAddYear ? (
          <button
            onClick={() => setShowAddYear(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Other year
          </button>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customYearInput}
                onChange={(e) => setCustomYearInput(e.target.value)}
                placeholder="e.g. 2015-2016"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddCustomYear}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddYear(false);
                  setCustomYearError("");
                  setCustomYearInput("");
                }}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            {customYearError && (
              <span className="text-xs text-red-600 mt-1">
                {customYearError}
              </span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm py-8 justify-center">
          <Loader2 size={18} className="animate-spin" />
          Loading budget...
        </div>
      ) : (
        <>
          {!hasExistingBudget && (
            <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-4 py-2 mb-4">
              No budget configured yet for {financialYear}. Fill in the months
              below and save.
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {months.map(({ month, allocatedBudget }) => (
              <div key={month}>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {month}
                </label>
                <input
                  type="number"
                  min="0"
                  value={allocatedBudget}
                  onChange={(e) => handleMonthChange(month, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-600">
              Total for {financialYear}:{" "}
              <span className="font-semibold text-gray-900">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !selectedHQ}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : "Save Budget"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const UnassignedHierarchySection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getUnassignedHierarchy();
        setData(res.data);
      } catch (err) {
        setStatus({
          type: "error",
          message: err.message || "Failed to load hierarchy gaps",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Coverage Gaps
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Headquarters without an Area Manager, and Area Managers without a
        Medical Representative.
      </p>

      <StatusBanner status={status} />

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm py-8 justify-center">
          <Loader2 size={18} className="animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-amber-600" />
              <h3 className="text-sm font-semibold text-gray-800">
                Headquarters without Area Manager
              </h3>
            </div>
            {data?.headquartersWithoutAreaManager?.length ? (
              <ul className="space-y-2">
                {data.headquartersWithoutAreaManager.map((hq) => (
                  <li
                    key={hq._id}
                    className="flex items-center justify-between px-3 py-2 bg-amber-50 rounded-lg text-sm"
                  >
                    <span className="text-gray-800 font-medium">
                      {hq.headQuarterName}
                    </span>
                    {hq.location && (
                      <span className="text-gray-500 text-xs">
                        {hq.location}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">
                All headquarters are covered.
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserX size={16} className="text-red-600" />
              <h3 className="text-sm font-semibold text-gray-800">
                Area Managers without MR Coverage
              </h3>
            </div>
            {data?.areaManagersWithoutMR?.length ? (
              <ul className="space-y-2">
                {data.areaManagersWithoutMR.map((am) => (
                  <li
                    key={am._id}
                    className="px-3 py-2 bg-red-50 rounded-lg text-sm"
                  >
                    <div className="font-medium text-gray-800">{am.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Missing MR at:{" "}
                      {am.headquartersWithoutMR
                        .map((hq) => hq.headQuarterName)
                        .join(", ")}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">
                All Area Managers are covered.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminProfile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your organization's branding, budgets, and team coverage.
        </p>
      </div>

      <BrandingSection />
      <BudgetSection />
      <UnassignedHierarchySection />
    </div>
  );
};

export default AdminProfile;
