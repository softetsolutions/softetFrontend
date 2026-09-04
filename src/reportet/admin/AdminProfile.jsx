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
  Image as ImageIcon,
  Palette,
  Mail as MailIcon,
} from "lucide-react";
import { useOrganization } from "../context/OrganizationContext";
import {
  updateBranding,
  getAllHeadQuarterNames,
  getUnassignedHierarchy,
  getHeadQuarterBudget,
  setHeadQuarterBudget,
  getConfiguredFinancialYears,
} from "../api/profile";
import {
  getNotificationSettings,
  updateNotificationEventSetting,
  uploadEventLogo,
} from "../api/notification";

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

const BIRTHDAY_EVENT_TYPE = "doctorBirthdayAdminAlert";

const EmailTemplateSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const [template, setTemplate] = useState({
    mode: "default",
    logoUrl: "",
    backgroundImageUrl: "",
    headerText: "",
    bodyMessage: "",
    footerText: "",
    accentColor: "#111827",
    bodyBackgroundColor: "#ffffff",
    bodyBackgroundImageUrl: "",
  });

  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingBodyBg, setUploadingBodyBg] = useState(false);

  const handleBodyBackgroundChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBodyBg(true);
    setStatus(null);
    try {
      const { logoUrl } = await uploadEventLogo(file);
      updateField("bodyBackgroundImageUrl", logoUrl);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to upload body background image",
      });
    } finally {
      setUploadingBodyBg(false);
    }
  };

  const handleBackgroundChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    setStatus(null);
    try {
      const { logoUrl } = await uploadEventLogo(file);
      updateField("backgroundImageUrl", logoUrl);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to upload background image",
      });
    } finally {
      setUploadingBg(false);
    }
  };

  const fetchTemplate = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await getNotificationSettings();
      const event = settings.events?.find(
        (e) => e.eventType === BIRTHDAY_EVENT_TYPE,
      );
      if (event?.emailTemplate) {
        setTemplate((prev) => ({ ...prev, ...event.emailTemplate }));
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to load email template",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  const updateField = (field, value) => {
    setTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const handleModeChange = (mode) => {
    updateField("mode", mode);
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const { logoUrl } = await uploadEventLogo(file);
      updateField("logoUrl", logoUrl);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to upload logo",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const updated = await updateNotificationEventSetting(
        BIRTHDAY_EVENT_TYPE,
        { emailTemplate: template },
      );
      const savedEvent = updated.events?.find(
        (e) => e.eventType === BIRTHDAY_EVENT_TYPE,
      );
      if (savedEvent?.emailTemplate) {
        setTemplate((prev) => ({ ...prev, ...savedEvent.emailTemplate }));
      }
      setStatus({ type: "success", message: "Email template saved" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to save email template",
      });
    } finally {
      setSaving(false);
    }
  };

  const isCustom = template.mode === "custom";

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm py-8 justify-center">
          <Loader2 size={18} className="animate-spin" />
          Loading email template...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Birthday Email Template
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Choose the default greeting email, or customize it with your own logo,
        text, and color.
      </p>

      <StatusBanner status={status} />

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleModeChange("default")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            !isCustom
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Use Default
        </button>
        <button
          onClick={() => handleModeChange("custom")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            isCustom
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Customize
        </button>
      </div>

      {isCustom && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <ImageIcon size={14} /> Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                  {template.logoUrl ? (
                    <img
                      src={`${ASSET_BASE_URL}${template.logoUrl}`}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-gray-400">No logo</span>
                  )}
                </div>
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                  {uploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {uploading ? "Uploading..." : "Upload logo"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleLogoChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* <div
              className="text-center py-4 px-4 mt-2 bg-cover bg-center"
              style={{
                backgroundColor: template.accentColor,
                backgroundImage: template.backgroundImageUrl
                  ? `url(${ASSET_BASE_URL}${template.backgroundImageUrl})`
                  : "none",
              }}
            >
              <p className="text-white font-bold text-base drop-shadow">
                {template.headerText || "🎂 Birthday Reminder"}
              </p>
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Header Text
              </label>
              <input
                type="text"
                value={template.headerText}
                onChange={(e) => updateField("headerText", e.target.value)}
                placeholder="🎂 Birthday Reminder"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Body Message
              </label>
              <textarea
                rows={4}
                value={template.bodyMessage}
                onChange={(e) => updateField("bodyMessage", e.target.value)}
                placeholder="Write the default message shown when no custom message is sent..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Footer Text
              </label>
              <input
                type="text"
                value={template.footerText}
                onChange={(e) => updateField("footerText", e.target.value)}
                placeholder="© 2026 Your Company. All rights reserved."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <Palette size={14} /> Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={template.accentColor}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={template.accentColor}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <MailIcon size={14} /> Preview
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-3">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                {template.logoUrl && (
                  <div className="flex justify-center pt-4">
                    <img
                      src={`${ASSET_BASE_URL}${template.logoUrl}`}
                      alt="Logo"
                      className="max-h-10 object-contain"
                    />
                  </div>
                )}
                <div
                  className="text-center py-4 px-4 mt-2 bg-cover bg-center"
                  style={{
                    backgroundColor: template.accentColor,
                    backgroundImage: template.backgroundImageUrl
                      ? `url(${ASSET_BASE_URL}${template.backgroundImageUrl})`
                      : "none",
                  }}
                >
                  <p className="text-white font-bold text-base drop-shadow">
                    {template.headerText || "🎂 Birthday Reminder"}
                  </p>
                </div>
                <div
                  className="px-5 py-5 text-sm text-gray-700 leading-relaxed bg-cover bg-center"
                  style={{
                    backgroundColor: template.bodyBackgroundColor,
                    backgroundImage: template.bodyBackgroundImageUrl
                      ? `url(${ASSET_BASE_URL}${template.bodyBackgroundImageUrl})`
                      : "none",
                  }}
                >
                  {template.bodyMessage ||
                    "Happy Birthday, Dr. {doctorName}! Wishing you a wonderful year ahead."}
                  <div className="mt-4 bg-gray-50 border border-gray-100 rounded-md px-3 py-2 text-xs">
                    <strong>Doctor:</strong> Dr. Example Name
                  </div>
                </div>
                <div className="bg-gray-100 text-center py-3 text-[11px] text-gray-500">
                  {template.footerText ||
                    "© 2026 Softet Solutions. All rights reserved."}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <ImageIcon size={14} /> Header Background Image
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {template.backgroundImageUrl ? (
                  <img
                    src={`${ASSET_BASE_URL}${template.backgroundImageUrl}`}
                    alt="Background preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-400">None</span>
                )}
              </div>
              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                {uploadingBg ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {uploadingBg ? "Uploading..." : "Upload background"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleBackgroundChange}
                  disabled={uploadingBg}
                  className="hidden"
                />
              </label>
              {template.backgroundImageUrl && (
                <button
                  type="button"
                  onClick={() => updateField("backgroundImageUrl", "")}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Shown behind the header banner text. Use SVG-free formats
              (PNG/JPG/WebP) — background images have limited support in some
              email clients.
            </p>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Palette size={14} /> Body Background
            </label>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="color"
                value={template.bodyBackgroundColor}
                onChange={(e) =>
                  updateField("bodyBackgroundColor", e.target.value)
                }
                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={template.bodyBackgroundColor}
                onChange={(e) =>
                  updateField("bodyBackgroundColor", e.target.value)
                }
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {template.bodyBackgroundImageUrl ? (
                  <img
                    src={`${ASSET_BASE_URL}${template.bodyBackgroundImageUrl}`}
                    alt="Body background preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-400">None</span>
                )}
              </div>
              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                {uploadingBodyBg ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {uploadingBodyBg ? "Uploading..." : "Upload background"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleBodyBackgroundChange}
                  disabled={uploadingBodyBg}
                  className="hidden"
                />
              </label>
              {template.bodyBackgroundImageUrl && (
                <button
                  type="button"
                  onClick={() => updateField("bodyBackgroundImageUrl", "")}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Fills the message area behind the body text. Use a light image or
              low contrast — small text over a busy image can be hard to read.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || uploading}
        className="flex items-center gap-2 px-5 py-2.5 mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        {saving ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        {saving ? "Saving..." : "Save Email Template"}
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
      <EmailTemplateSection />
    </div>
  );
};

export default AdminProfile;
