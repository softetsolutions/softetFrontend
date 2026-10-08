import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Check,
  CheckCheck,
  Cake,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  sendDoctorBirthdayGreeting,
} from "../api/notifications";
import Spinner from "../genericComps/Spinner";

const formatWhen = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(value);
  }
};

const GreetingModal = ({ notification, onClose, onSent }) => {
  const doctorName = notification?.metadata?.doctorName || "Doctor";
  const [subject, setSubject] = useState("Happy Birthday!");
  const [message, setMessage] = useState(
    `Dear Dr. ${doctorName},\n\nWishing you a wonderful birthday!\n\nBest regards`,
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSend = async () => {
    const doctorId = notification?.metadata?.doctorId;
    if (!doctorId) {
      toast.error("Doctor id missing on this notification");
      return;
    }
    try {
      setSubmitting(true);
      await sendDoctorBirthdayGreeting(doctorId, {
        subject: subject.trim(),
        message: message.trim(),
        notificationId: notification._id,
      });
      toast.success("Birthday greeting sent");
      onSent?.(notification._id);
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to send greeting");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            Send birthday greeting
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Email Dr. {doctorName} a greeting. One send per doctor per day.
        </p>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Subject
        </label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Message
        </label>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[140px] mb-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSend}
            className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send greeting"}
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationInbox = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [greetingFor, setGreetingFor] = useState(null);

  const load = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        const data = await getNotifications({
          unread: unreadOnly,
          page: 1,
          limit: 50,
          signal,
        });
        setItems(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (err) {
        if (err.name === "AbortError") return;
        toast.error(err.message || "Failed to load notifications");
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [unreadOnly],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const handleMarkRead = async (id) => {
    try {
      setBusyId(id);
      await markNotificationRead(id);
      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      toast.error(err.message || "Failed to mark as read");
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAll = async () => {
    try {
      setBusyId("all");
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All marked as read");
    } catch (err) {
      toast.error(err.message || "Failed to mark all as read");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setBusyId(id);
      await deleteNotification(id);
      setItems((prev) => {
        const target = prev.find((n) => n._id === id);
        if (target && !target.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n._id !== id);
      });
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Bell size={20} className="text-blue-600" />
            Notification inbox
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Org alerts such as doctor birthdays. {unreadCount} unread.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2 rounded-lg border border-gray-200 bg-white">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
            />
            Unread only
          </label>
          <button
            type="button"
            disabled={busyId === "all" || unreadCount === 0}
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-50"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No notifications yet. Enable birthday alerts in Notification Settings
          to start receiving org alerts.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const isBirthday =
              item.eventType === "doctorBirthdayAdminAlert" &&
              item.metadata?.doctorId;
            return (
              <li
                key={item._id}
                className={`rounded-xl border bg-white p-4 ${
                  item.isRead
                    ? "border-gray-100"
                    : "border-blue-200 bg-blue-50/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      {!item.isRead && (
                        <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                      {item.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatWhen(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isBirthday && (
                      <button
                        type="button"
                        onClick={() => setGreetingFor(item)}
                        className="p-2 rounded-lg text-pink-600 hover:bg-pink-50"
                        title="Send greeting"
                      >
                        <Cake size={16} />
                      </button>
                    )}
                    {!item.isRead && (
                      <button
                        type="button"
                        disabled={busyId === item._id}
                        onClick={() => handleMarkRead(item._id)}
                        className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                        title="Mark read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busyId === item._id}
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {greetingFor && (
        <GreetingModal
          notification={greetingFor}
          onClose={() => setGreetingFor(null)}
          onSent={(id) => {
            setItems((prev) =>
              prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
            );
            setUnreadCount((c) => Math.max(0, c - 1));
          }}
        />
      )}
    </div>
  );
};

export default NotificationInbox;
