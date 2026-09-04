import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  Cake,
  AlertTriangle,
  Settings,
  ArrowLeft,
  Mail,
} from "lucide-react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendDoctorBirthdayGreeting,
  getNotificationSettings,
  toggleNotificationFeature,
  updateNotificationEventSetting,
} from "../api/notification";

const DEFAULT_GREETING = (doctorName) =>
  `Happy Birthday, Dr. ${doctorName}! Wishing you a wonderful year ahead.`;

const EVENT_LABELS = {
  doctorBirthdayAdminAlert: {
    label: "Doctor Birthday Alerts",
    description: "Notify admins when it's a doctor's birthday",
    icon: Cake,
  },
};

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("list"); // "list" | "settings"
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [actionLoaderId, setActionLoaderId] = useState(null);
  const [greetingComposer, setGreetingComposer] = useState(null);
  const [greetingLoader, setGreetingLoader] = useState(false);
  const [greetingError, setGreetingError] = useState("");
  const [toast, setToast] = useState(null);

  // settings state
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [featureToggleLoading, setFeatureToggleLoading] = useState(false);
  const [eventLoadingId, setEventLoadingId] = useState(null);

  const panelRef = useRef(null);
  const bellRef = useRef(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchNotifications = useCallback(async (pageNo = 1, append = false) => {
    try {
      setLoading(true);
      const data = await getNotifications({ page: pageNo, limit: 10 });
      const list = data.notifications || [];
      setNotifications((prev) => (append ? [...prev, ...list] : list));
      setUnreadCount(data.unreadCount || 0);
      setHasMore(list.length === 10);
    } catch (error) {
      showToast(error.message || "Could not load notifications.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      setSettingsLoading(true);
      const data = await getNotificationSettings();
      setSettings(data);
    } catch (error) {
      showToast(
        error.message || "Could not load notification settings.",
        "error",
      );
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1, false);
    const interval = setInterval(() => {
      if (!open) fetchNotifications(1, false);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setView("list");
      setPage(1);
      fetchNotifications(1, false);
    }
  };

  const openSettingsView = () => {
    setView("settings");
    fetchSettings();
  };

  const backToList = () => {
    setView("list");
  };

  const handleMarkRead = async (id) => {
    try {
      setActionLoaderId(id);
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      showToast(error.message || "Could not update notification.", "error");
    } finally {
      setActionLoaderId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkAllLoading(true);
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      showToast(error.message || "Could not update notifications.", "error");
    } finally {
      setMarkAllLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoaderId(id);
      await deleteNotification(id);
      setNotifications((prev) => {
        const target = prev.find((n) => n._id === id);
        if (target && !target.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n._id !== id);
      });
    } catch (error) {
      showToast(error.message || "Could not delete notification.", "error");
    } finally {
      setActionLoaderId(null);
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchNotifications(next, true);
  };

  const openGreetingComposer = (notification) => {
    const doctorName = notification.metadata?.doctorName || "the doctor";
    setGreetingComposer({
      notification,
      message: DEFAULT_GREETING(doctorName),
    });
    setGreetingError("");
  };

  const closeGreetingComposer = () => {
    setGreetingComposer(null);
    setGreetingError("");
  };

  const handleSendGreeting = async () => {
    const { notification, message } = greetingComposer;
    const doctorId = notification.metadata?.doctorId;
    if (!doctorId) {
      setGreetingError("Doctor reference is missing on this notification.");
      return;
    }
    if (!message.trim()) {
      setGreetingError("Message cannot be empty.");
      return;
    }
    try {
      setGreetingLoader(true);
      setGreetingError("");
      await sendDoctorBirthdayGreeting(doctorId, {
        message: message.trim(),
        notificationId: notification._id,
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      closeGreetingComposer();
      showToast("Birthday greeting sent.", "success");
    } catch (error) {
      setGreetingError(error.message || "Failed to send greeting.");
    } finally {
      setGreetingLoader(false);
    }
  };

  const handleFeatureToggle = async () => {
    if (!settings) return;
    const next = !settings.featureEnabled;
    try {
      setFeatureToggleLoading(true);
      const updated = await toggleNotificationFeature(next);
      setSettings(updated);
      showToast(
        next ? "Notifications enabled." : "Notifications disabled.",
        "success",
      );
    } catch (error) {
      showToast(error.message || "Could not update feature toggle.", "error");
    } finally {
      setFeatureToggleLoading(false);
    }
  };

  const handleEventToggle = async (eventType, currentEnabled) => {
    try {
      setEventLoadingId(eventType);
      const updated = await updateNotificationEventSetting(eventType, {
        enabled: !currentEnabled,
      });
      setSettings(updated);
    } catch (error) {
      showToast(error.message || "Could not update event setting.", "error");
    } finally {
      setEventLoadingId(null);
    }
  };

  const handleEmailChannelToggle = async (eventType, currentChannels) => {
    try {
      setEventLoadingId(eventType);
      const updated = await updateNotificationEventSetting(eventType, {
        channels: { ...currentChannels, email: !currentChannels.email },
      });
      setSettings(updated);
    } catch (error) {
      showToast(error.message || "Could not update email channel.", "error");
    } finally {
      setEventLoadingId(null);
    }
  };

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={toggleOpen}
        title="Notifications"
        className="relative p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-100 z-50 flex flex-col max-h-[28rem]"
        >
          {/* ===== Header ===== */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            {view === "list" ? (
              <>
                <h3 className="text-sm font-semibold text-gray-800">
                  Notifications
                </h3>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      disabled={markAllLoading}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                      {markAllLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCheck className="w-3.5 h-3.5" />
                      )}
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={openSettingsView}
                    title="Notification settings"
                    className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={backToList}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Settings
                </button>
              </>
            )}
          </div>

          {/* ===== Body ===== */}
          {view === "list" ? (
            <>
              <div className="overflow-y-auto flex-1">
                {loading && notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    <p className="text-xs text-gray-500">
                      Loading notifications...
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-sm text-gray-500">
                    No notifications yet.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {notifications.map((n) => {
                      const isBirthdayAlert =
                        n.eventType === "doctorBirthdayAdminAlert";
                      return (
                        <li
                          key={n._id}
                          className={`px-4 py-3 transition-colors ${
                            n.isRead ? "bg-white" : "bg-blue-50/50"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                isBirthdayAlert
                                  ? "bg-pink-50 text-pink-500"
                                  : "bg-blue-50 text-blue-500"
                              }`}
                            >
                              {isBirthdayAlert ? (
                                <Cake className="w-3.5 h-3.5" />
                              ) : (
                                <Bell className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {n.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[11px] text-gray-400">
                                  {timeAgo(n.createdAt)}
                                </span>
                                <div className="flex items-center gap-1">
                                  {isBirthdayAlert && (
                                    <button
                                      onClick={() => openGreetingComposer(n)}
                                      className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                    >
                                      Send Greeting
                                    </button>
                                  )}
                                  {!n.isRead && (
                                    <button
                                      onClick={() => handleMarkRead(n._id)}
                                      title="Mark as read"
                                      disabled={actionLoaderId === n._id}
                                      className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(n._id)}
                                    title="Delete"
                                    disabled={actionLoaderId === n._id}
                                    className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    {actionLoaderId === n._id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {hasMore && !loading && notifications.length > 0 && (
                <button
                  onClick={loadMore}
                  className="py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 border-t border-gray-100 transition-colors"
                >
                  Load more
                </button>
              )}
            </>
          ) : (
            /* ===== Settings view ===== */
            <div className="overflow-y-auto flex-1">
              {settingsLoading && !settings ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  <p className="text-xs text-gray-500">Loading settings...</p>
                </div>
              ) : !settings ? (
                <div className="flex items-center justify-center h-32 text-sm text-gray-500">
                  Could not load settings.
                </div>
              ) : (
                <div className="px-4 py-3">
                  {/* Master toggle */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Enable notifications
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Turn on to start receiving alerts
                      </p>
                    </div>
                    <button
                      onClick={handleFeatureToggle}
                      disabled={featureToggleLoading}
                      className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-50 shrink-0 ${
                        settings.featureEnabled ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          settings.featureEnabled
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {!settings.featureEnabled && (
                    <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 mt-3">
                      Enable notifications above to customize alert types below.
                    </p>
                  )}

                  {/* Per-event settings */}
                  <div
                    className={`mt-1 ${
                      !settings.featureEnabled
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    {settings.events?.map((event) => {
                      const meta = EVENT_LABELS[event.eventType] || {
                        label: event.eventType,
                        description: "",
                        icon: Bell,
                      };
                      const Icon = meta.icon;
                      const isRowLoading = eventLoadingId === event.eventType;

                      return (
                        <div
                          key={event.eventType}
                          className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {meta.label}
                              </p>
                              {meta.description && (
                                <p className="text-[11px] text-gray-500 truncate">
                                  {meta.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <button
                              onClick={() =>
                                handleEmailChannelToggle(
                                  event.eventType,
                                  event.channels,
                                )
                              }
                              disabled={isRowLoading}
                              title="Also send via email"
                              className={`p-1.5 rounded-md transition-colors ${
                                event.channels?.email
                                  ? "text-blue-600 bg-blue-50"
                                  : "text-gray-400 hover:bg-gray-50"
                              }`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                handleEventToggle(
                                  event.eventType,
                                  event.enabled,
                                )
                              }
                              disabled={isRowLoading}
                              className={`relative w-9 h-5 rounded-full transition-colors disabled:opacity-50 ${
                                event.enabled ? "bg-blue-600" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                  event.enabled
                                    ? "translate-x-4"
                                    : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {greetingComposer && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={closeGreetingComposer}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-50 rounded flex items-center justify-center">
                  <Cake className="w-4 h-4 text-pink-500" />
                </div>
                <h2 className="text-base font-bold text-gray-900">
                  Send Birthday Greeting
                </h2>
              </div>
              <button
                onClick={closeGreetingComposer}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={greetingComposer.message}
                  onChange={(e) =>
                    setGreetingComposer((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition resize-none"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Edit this or leave it as-is to send the default greeting.
                </p>
              </div>
              {greetingError && (
                <p className="text-xs text-red-500 font-medium">
                  {greetingError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeGreetingComposer}
                disabled={greetingLoader}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendGreeting}
                disabled={greetingLoader}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {greetingLoader ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[70] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
            ${
              toast.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
          <button
            onClick={() => setToast(null)}
            className="ml-2 opacity-50 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
