import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Settings2 } from "lucide-react";
import {
  getNotificationSettings,
  toggleNotificationFeature,
  updateNotificationEvent,
} from "../api/notifications";
import Spinner from "../genericComps/Spinner";

const EVENT_META = {
  doctorBirthdayAdminAlert: {
    title: "Doctor birthday (admin alert)",
    description:
      "Creates an org inbox alert when a doctor’s birthday falls today. Requires the master toggle above.",
    adminGated: true,
  },
  leaveActionResult: {
    title: "Leave approved / rejected",
    description:
      "Notifies the employee in the mobile app when their leave is actioned. Always available when enabled here.",
    adminGated: false,
  },
  tourPlanActionResult: {
    title: "Tour plan approved / rejected",
    description:
      "Notifies the employee in the mobile app when their monthly tour plan is actioned.",
    adminGated: false,
  },
};

const NotificationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  const load = useCallback(async (signal) => {
    try {
      setLoading(true);
      const data = await getNotificationSettings({ signal });
      setSettings(data);
    } catch (err) {
      if (err.name === "AbortError") return;
      toast.error(err.message || "Failed to load settings");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const events = useMemo(() => settings?.events || [], [settings]);

  const handleToggleFeature = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const next = await toggleNotificationFeature(!settings.featureEnabled);
      setSettings(next);
      toast.success(
        next.featureEnabled
          ? "Org notification alerts enabled"
          : "Org notification alerts disabled",
      );
    } catch (err) {
      toast.error(err.message || "Failed to update feature toggle");
    } finally {
      setSaving(false);
    }
  };

  const handleEventChange = async (eventType, patch) => {
    try {
      setSaving(true);
      const next = await updateNotificationEvent(eventType, patch);
      setSettings(next);
      toast.success("Event settings saved");
    } catch (err) {
      toast.error(err.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Settings2 size={20} className="text-blue-600" />
          Notification settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Control org inbox alerts and employee in-app notifications.
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-gray-800">Master toggle</p>
            <p className="text-sm text-gray-500 mt-1">
              Gates org-level alerts (doctor birthdays). Employee leave / tour
              plan alerts use their own event switches below.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={handleToggleFeature}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              settings?.featureEnabled ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-pressed={Boolean(settings?.featureEnabled)}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                settings?.featureEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      <div className="space-y-3">
        {events.map((event) => {
          const meta = EVENT_META[event.eventType] || {
            title: event.eventType,
            description: "",
            adminGated: false,
          };
          const blockedByMaster =
            meta.adminGated && !settings?.featureEnabled;

          return (
            <section
              key={event.eventType}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-800">{meta.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {meta.description}
                  </p>
                  {blockedByMaster && (
                    <p className="text-xs text-amber-600 mt-2">
                      Turn on the master toggle to activate this alert.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    handleEventChange(event.eventType, {
                      enabled: !event.enabled,
                    })
                  }
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    event.enabled ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                      event.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {event.eventType === "doctorBirthdayAdminAlert" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm text-gray-600">
                    Send time (IST)
                    <input
                      type="time"
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      value={event.sendTime || "09:00"}
                      disabled={saving || !settings?.featureEnabled}
                      onChange={(e) =>
                        handleEventChange(event.eventType, {
                          sendTime: e.target.value,
                        })
                      }
                    />
                  </label>
                  <div className="text-sm text-gray-600">
                    Channels
                    <div className="mt-2 flex gap-4">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={event.channels?.inApp !== false}
                          disabled={saving || !settings?.featureEnabled}
                          onChange={(e) =>
                            handleEventChange(event.eventType, {
                              channels: { inApp: e.target.checked },
                            })
                          }
                        />
                        In-app
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(event.channels?.email)}
                          disabled={saving || !settings?.featureEnabled}
                          onChange={(e) =>
                            handleEventChange(event.eventType, {
                              channels: { email: e.target.checked },
                            })
                          }
                        />
                        Email
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationSettings;
