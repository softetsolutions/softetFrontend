import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  AlertTriangle,
  X,
  Check,
  Radio,
  Gauge,
  Clock,
  RefreshCw,
  Flag,
  MapPin,
  Footprints,
  Car,
  Users,
  Circle,
} from "lucide-react";
import Spinner from "../genericComps/Spinner";
import {
  getTripByDate,
  getTripRaw,
  openLiveLocationsStream,
  getTrackingEmployees,
  enableOrgLiveTracking,
  disableOrgLiveTracking,
} from "../api/trackingApi";
import { getEmployeeListOptions } from "../api/employee";
import TrackingMap from "../modals/TrackingMap";

/** Calendar day in Asia/Kolkata as YYYY-MM-DD (contract date key). */
const todayStr = () => {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

const formatTimeAgo = (isoOrDate) => {
  if (!isoOrDate) return "—";
  const diffMs = Date.now() - new Date(isoOrDate).getTime();
  const s = Math.max(0, Math.round(diffMs / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
};

const formatDistance = (meters = 0) => {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

const formatDuration = (totalSeconds = 0) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m} m`;
  return `${h}h ${m}m`;
};

const formatClock = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const employeeDisplayName = (emp) =>
  emp?.displayName ||
  [emp?.firstName, emp?.lastName].filter(Boolean).join(" ") ||
  emp?.name ||
  "Unknown";

function normalizeEmployeeOptions(data) {
  const list = Array.isArray(data)
    ? data
    : data?.options || data?.employees || data?.data || [];
  return list
    .map((e) => ({
      id: e._id || e.id || e.value,
      label:
        e.label ||
        e.displayName ||
        [e.firstName, e.lastName].filter(Boolean).join(" ") ||
        e.name ||
        e.employeeId ||
        "Unnamed",
    }))
    .filter((e) => e.id);
}

/** Build map markers only from contract `markers` (+ optional live tip). */
function markersFromTrip(tripMarkers, path, isLive) {
  const out = [];
  if (!tripMarkers) {
    if (path?.length) {
      const first = path[0];
      const last = path[path.length - 1];
      out.push({
        lat: first.lat,
        lng: first.lng,
        color: "green",
        label: "Start",
        type: "major",
      });
      out.push({
        lat: last.lat,
        lng: last.lng,
        color: isLive ? "blue" : "darkred",
        label: isLive ? "Live" : "End",
        type: "major",
        pulse: isLive,
      });
    }
    return out;
  }

  if (tripMarkers.start) {
    out.push({
      lat: tripMarkers.start.lat,
      lng: tripMarkers.start.lng,
      color: "green",
      label: tripMarkers.start.placeName
        ? `Start · ${tripMarkers.start.placeName}`
        : "Start",
      type: "major",
    });
  }

  (tripMarkers.stops || []).forEach((s) => {
    out.push({
      lat: s.lat,
      lng: s.lng,
      color: "orange",
      label: s.placeName
        ? `Stop · ${s.placeName}`
        : `Stop${s.durationSeconds ? ` · ${formatDuration(s.durationSeconds)}` : ""}`,
      type: "major",
    });
  });

  if (isLive && path?.length) {
    const last = path[path.length - 1];
    out.push({
      lat: last.lat,
      lng: last.lng,
      color: "blue",
      label: "Live",
      type: "major",
      pulse: true,
    });
  } else if (tripMarkers.end) {
    out.push({
      lat: tripMarkers.end.lat,
      lng: tripMarkers.end.lng,
      color: "darkred",
      label: tripMarkers.end.placeName
        ? `End · ${tripMarkers.end.placeName}`
        : "End",
      type: "major",
    });
  }

  return out;
}

const ACTIVITY_ICON = {
  still: { Icon: MapPin, ring: "text-red-600 border-red-500", solid: true },
  walking: {
    Icon: Footprints,
    ring: "text-gray-600 border-gray-400",
    solid: false,
  },
  driving: {
    Icon: Car,
    ring: "text-gray-400 border-gray-300",
    solid: false,
    dotOnly: true,
  },
  unknown: {
    Icon: Circle,
    ring: "text-gray-400 border-gray-300",
    solid: false,
  },
};

const TYPE_ICON = {
  started: {
    Icon: Radio,
    ring: "text-green-600 border-green-500",
    solid: false,
  },
  completed: {
    Icon: Flag,
    ring: "text-gray-900 border-gray-900",
    solid: true,
  },
};

function timelineIconConfig(item) {
  if (item.type === "started" || item.type === "completed") {
    return TYPE_ICON[item.type];
  }
  return ACTIVITY_ICON[item.activity] || ACTIVITY_ICON.unknown;
}

function TimelineRow({ item }) {
  const cfg = timelineIconConfig(item);
  const { Icon } = cfg;
  const badgeLabel =
    item.type === "segment" && item.activity
      ? String(item.activity).toUpperCase()
      : null;

  let rightLabel = null;
  let rightValue = null;
  if (item.meta?.precisionLabel) {
    rightLabel = "Accuracy";
    rightValue = item.meta.precisionLabel;
  } else if (item.meta?.accuracyMeters != null) {
    rightLabel = "Accuracy";
    rightValue = `±${item.meta.accuracyMeters}m`;
  } else if (item.meta?.avgSpeedKmh != null) {
    rightLabel = "Avg Speed";
    rightValue = `${Math.round(item.meta.avgSpeedKmh)} km/h`;
  }

  return (
    <div className="flex gap-4 relative pb-6 last:pb-0">
      <div className="flex flex-col items-center">
        <span
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white shrink-0 ${cfg.ring}`}
        >
          {cfg.dotOnly ? (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          ) : (
            <Icon size={12} />
          )}
        </span>
        <span className="w-px flex-1 bg-gray-200 last:hidden" />
      </div>

      <div className="flex-1 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-gray-400 font-medium">
            {formatClock(item.startTime)}
          </div>
          <div className="text-sm font-semibold text-gray-900 mt-0.5">
            {item.title || item.type}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {badgeLabel && (
              <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                {badgeLabel}
              </span>
            )}
            {item.placeName && (
              <span className="text-xs text-gray-500">{item.placeName}</span>
            )}
          </div>
        </div>
        {rightLabel && (
          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase tracking-wide text-gray-400">
              {rightLabel}
            </div>
            <div className="text-sm font-semibold text-gray-800">
              {rightValue}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TripAnalysisPanel({
  tripData,
  selectedEmployee,
  tripDate,
  markers,
  isLive,
}) {
  const [showRawGps, setShowRawGps] = useState(false);
  const [rawPoints, setRawPoints] = useState(null);
  const [rawLoading, setRawLoading] = useState(false);
  const [rawError, setRawError] = useState(null);

  const tripCode =
    tripData.trip?.id ||
    tripData.trip?.tripId ||
    (tripData.trip?._id
      ? `T-${String(tripData.trip._id).slice(-4)}`
      : "—");

  const timeline = Array.isArray(tripData.timeline) ? tripData.timeline : [];

  useEffect(() => {
    setShowRawGps(false);
    setRawPoints(null);
    setRawError(null);
  }, [tripData]);

  const loadRaw = async () => {
    if (showRawGps) {
      setShowRawGps(false);
      return;
    }
    setShowRawGps(true);
    if (rawPoints) return;
    setRawLoading(true);
    setRawError(null);
    try {
      const data = await getTripRaw({
        employeeId: selectedEmployee.id,
        date: tripDate,
      });
      setRawPoints(data.points || []);
    } catch (err) {
      setRawError(err.message || "Failed to load raw GPS");
      setRawPoints([]);
    } finally {
      setRawLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 flex-1 min-h-0">
      <div className="xl:col-span-3 relative min-h-[420px]">
        <TrackingMap
          markers={markers}
          route={tripData.path}
          height="100%"
          className="h-full"
          emptyLabel="No location pings recorded for this trip"
        />
        <div className="absolute top-4 left-4 z-[500] bg-white rounded-lg shadow-md px-4 py-2.5 flex items-center gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Employee
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {tripData.employee?.employeeId || selectedEmployee.id}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Trip ID
            </div>
            <div className="text-sm font-semibold text-gray-900">{tripCode}</div>
          </div>
          {isLive && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <Radio size={10} /> LIVE
            </span>
          )}
        </div>
      </div>

      <div className="xl:col-span-2 bg-white p-6 flex flex-col min-h-0 border-l border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Trip Analysis</h3>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isLive
                  ? "bg-green-50 text-green-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {isLive
                ? "LIVE"
                : tripData.trip?.status === "active"
                  ? "IN PROGRESS"
                  : "COMPLETED"}
            </span>
            <div className="text-[10px] text-gray-400 mt-1">Status</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Total Distance
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDistance(tripData.trip?.totalDistanceMeters)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Duration
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDuration(tripData.trip?.durationSeconds)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
            Activity Timeline
          </div>
          <button
            type="button"
            onClick={loadRaw}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            {showRawGps ? "Hide Raw GPS" : "View Raw GPS"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {timeline.length === 0 ? (
            <div className="text-sm text-gray-500 py-6 text-center">
              No activity timeline for this trip.
            </div>
          ) : (
            timeline.map((item, i) => <TimelineRow key={i} item={item} />)
          )}
        </div>

        {showRawGps && (
          <div className="overflow-x-auto border border-gray-100 rounded-lg mt-4 max-h-64 overflow-y-auto">
            {rawLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                <Spinner size={20} borderWidth={3} /> Loading raw GPS…
              </div>
            ) : rawError ? (
              <div className="py-6 text-center text-sm text-red-600">
                {rawError}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Speed
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acc.
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(rawPoints || []).map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {p.timestamp
                          ? new Date(p.timestamp).toLocaleTimeString()
                          : "—"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {p.activity || "—"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {p.speed != null
                          ? `${Math.round(p.speed * 3.6)} km/h`
                          : "—"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {p.accuracy != null ? `±${Math.round(p.accuracy)}m` : "—"}
                      </td>
                    </tr>
                  ))}
                  {rawPoints?.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No raw points returned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const LiveTrackingDashboard = () => {
  const [liveByEmployee, setLiveByEmployee] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [toast, setToast] = useState(null);

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tripDate, setTripDate] = useState(todayStr());
  const [tripLoading, setTripLoading] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [orgLiveTrackingEnabled, setOrgLiveTrackingEnabled] = useState(false);
  const [orgToggleLoading, setOrgToggleLoading] = useState(false);
  const [orgStatusLoading, setOrgStatusLoading] = useState(true);

  const eventSourceRef = useRef(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const controller = new AbortController();
    getTrackingEmployees(controller.signal)
      .then((data) => {
        setOrgLiveTrackingEnabled(!!data.orgLiveTrackingEnabled);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          showToast(err.message || "Could not load org tracking status");
        }
      })
      .finally(() => setOrgStatusLoading(false));
    return () => controller.abort();
  }, []);

  const handleToggleOrgTracking = async () => {
    const turnOn = !orgLiveTrackingEnabled;
    setOrgToggleLoading(true);
    try {
      const data = turnOn
        ? await enableOrgLiveTracking()
        : await disableOrgLiveTracking();
      setOrgLiveTrackingEnabled(
        data.liveTrackingEnabled != null
          ? !!data.liveTrackingEnabled
          : turnOn,
      );
      showToast(
        turnOn ? "Org live tracking enabled" : "Org live tracking disabled",
        "success",
      );
    } catch (error) {
      showToast(error.message || "Failed to update org tracking");
    } finally {
      setOrgToggleLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getEmployeeListOptions(controller)
      .then((data) => setEmployeeOptions(normalizeEmployeeOptions(data)))
      .catch((err) => {
        if (err.name !== "AbortError")
          showToast(err.message || "Failed to load employees");
      })
      .finally(() => setEmployeesLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const es = openLiveLocationsStream();
    eventSourceRef.current = es;
    setConnectionStatus("connecting");

    const upsertFromLiveRow = (row) => {
      const emp = row.employeeId;
      const id = typeof emp === "object" ? emp?._id || emp?.id : emp;
      if (!id) return null;
      return {
        id,
        name: employeeDisplayName(typeof emp === "object" ? emp : null),
        employeeCode:
          typeof emp === "object" ? emp?.employeeId : undefined,
        role: typeof emp === "object" ? emp?.role : undefined,
        coordinates: row.location?.coordinates || row.coordinates,
        speed: row.speed,
        heading: row.heading,
        isOnline: row.isOnline !== false,
        lastPingAt: row.lastPingAt || row.timestamp,
        sessionId: row.sessionId,
      };
    };

    es.addEventListener("snapshot", (evt) => {
      setConnectionStatus("open");
      let payload;
      try {
        payload = JSON.parse(evt.data);
      } catch {
        return;
      }
      const rows = Array.isArray(payload)
        ? payload
        : payload?.locations || payload?.employees || [payload];
      setLiveByEmployee((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          const mapped = upsertFromLiveRow(row);
          if (mapped) next[mapped.id] = { ...next[mapped.id], ...mapped };
        }
        return next;
      });
    });

    es.addEventListener("mr:started", (evt) => {
      const data = JSON.parse(evt.data);
      setLiveByEmployee((prev) => ({
        ...prev,
        [data.employeeId]: {
          ...(prev[data.employeeId] || {
            id: data.employeeId,
            name: `Employee ${String(data.employeeId).slice(-4)}`,
          }),
          coordinates: data.coordinates,
          isOnline: true,
          sessionId: data.sessionId,
          lastPingAt: data.timestamp,
        },
      }));
    });

    es.addEventListener("mr:location", (evt) => {
      const data = JSON.parse(evt.data);
      setLiveByEmployee((prev) => ({
        ...prev,
        [data.employeeId]: {
          ...(prev[data.employeeId] || {
            id: data.employeeId,
            name: `Employee ${String(data.employeeId).slice(-4)}`,
          }),
          coordinates: data.coordinates,
          speed: data.speed,
          heading: data.heading,
          isOnline: true,
          sessionId: data.sessionId,
          lastPingAt: data.timestamp,
        },
      }));
    });

    es.addEventListener("mr:ended", (evt) => {
      const data = JSON.parse(evt.data);
      setLiveByEmployee((prev) =>
        prev[data.employeeId]
          ? {
              ...prev,
              [data.employeeId]: {
                ...prev[data.employeeId],
                isOnline: false,
                sessionId: null,
                lastPingAt: data.timestamp,
              },
            }
          : prev,
      );
    });

    es.onerror = () => setConnectionStatus("error");

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, []);

  const liveList = useMemo(
    () =>
      Object.values(liveByEmployee).sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        return (a.name || "").localeCompare(b.name || "");
      }),
    [liveByEmployee],
  );
  const onlineCount = liveList.filter((e) => e.isOnline).length;

  const liveMapMarkers = useMemo(
    () =>
      liveList
        .filter((e) => Array.isArray(e.coordinates) && e.coordinates.length >= 2)
        .map((e) => ({
          id: e.id,
          lat: e.coordinates[1],
          lng: e.coordinates[0],
          label: `${e.name}${e.isOnline ? "" : " (offline)"}`,
          isOnline: e.isOnline,
        })),
    [liveList],
  );

  const loadTrip = useCallback(async (employeeId, date) => {
    if (!employeeId || !date) return;
    setTripLoading(true);
    setTripData(null);
    try {
      const data = await getTripByDate({ employeeId, date });
      setTripData(data);
    } catch (error) {
      setTripData(null);
      if (error?.status !== 404)
        showToast(error.message || "Failed to load trip");
    } finally {
      setTripLoading(false);
    }
  }, []);

  const handleSelectFromLive = (emp) => {
    setSelectedEmployee({ id: emp.id, name: emp.name });
    setTripDate(todayStr());
    loadTrip(emp.id, todayStr());
  };

  const handleEmployeeSelect = (e) => {
    const id = e.target.value;
    if (!id) {
      setSelectedEmployee(null);
      setTripData(null);
      return;
    }
    const opt = employeeOptions.find((o) => o.id === id);
    setSelectedEmployee({ id, name: opt?.label || null });
    loadTrip(id, tripDate);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setTripDate(date);
    if (selectedEmployee) loadTrip(selectedEmployee.id, date);
  };

  const isToday = tripDate === todayStr();

  useEffect(() => {
    if (!selectedEmployee || !isToday) return;
    const live = liveByEmployee[selectedEmployee.id];
    if (!live?.coordinates || !live?.lastPingAt) return;

    setTripData((prev) => {
      if (!prev?.path) return prev;
      const last = prev.path[prev.path.length - 1];
      if (
        last &&
        new Date(last.timestamp).getTime() ===
          new Date(live.lastPingAt).getTime()
      ) {
        return prev;
      }
      const newPoint = {
        lat: live.coordinates[1],
        lng: live.coordinates[0],
        speed: live.speed,
        heading: live.heading,
        timestamp: live.lastPingAt,
        activity: null,
        placeName: null,
      };
      return {
        ...prev,
        path: [...prev.path, newPoint],
        trip: {
          ...prev.trip,
          status: live.isOnline ? "active" : prev.trip?.status,
        },
      };
    });
  }, [selectedEmployee, isToday, liveByEmployee]);

  const isLive = isToday && tripData?.trip?.status === "active";

  const tripMapMarkers = useMemo(
    () =>
      tripData
        ? markersFromTrip(tripData.markers, tripData.path, isLive)
        : [],
    [tripData, isLive],
  );

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-hidden">
      <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
            Live Tracking
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                connectionStatus === "open"
                  ? "bg-green-50 text-green-700"
                  : connectionStatus === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              <Radio size={12} />
              {connectionStatus === "open"
                ? `${onlineCount} online`
                : connectionStatus === "error"
                  ? "Disconnected"
                  : "Connecting..."}
            </span>
          </h1>
          <p className="text-gray-500 mt-1 italic">
            Watch field reps in real time and pull up any saved trip.
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleOrgTracking}
          disabled={orgToggleLoading || orgStatusLoading}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60 ${
            orgLiveTrackingEnabled
              ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
          }`}
          title={
            orgLiveTrackingEnabled
              ? "Disable live tracking for the organization"
              : "Enable live tracking for the organization"
          }
        >
          {orgToggleLoading || orgStatusLoading ? (
            <Spinner size={14} borderWidth={2} />
          ) : (
            <Radio size={14} />
          )}
          Org tracking: {orgLiveTrackingEnabled ? "On" : "Off"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0 overflow-y-auto pb-6">
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2 flex flex-col gap-5 min-h-0">
          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-3">
              Trip Lookup
            </h2>
            <div className="flex flex-col gap-2">
              <select
                value={selectedEmployee?.id || ""}
                onChange={handleEmployeeSelect}
                disabled={employeesLoading}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white"
              >
                <option value="">
                  {employeesLoading
                    ? "Loading employees…"
                    : "Select an employee…"}
                </option>
                {employeeOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={tripDate}
                max={todayStr()}
                onChange={handleDateChange}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-medium text-gray-800">Field Reps</h2>
              <span className="text-xs text-gray-400">
                {liveList.length} tracked today
              </span>
            </div>

            <div className="overflow-y-auto flex-1 -mx-2 px-2 divide-y divide-gray-100">
              {liveList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-sm text-gray-500 gap-2">
                  <RefreshCw size={20} className="text-gray-300" />
                  No one has started tracking today yet.
                </div>
              ) : (
                liveList.map((emp) => (
                  <div
                    key={emp.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${emp.isOnline ? "bg-green-500" : "bg-gray-300"}`}
                        title={emp.isOnline ? "Online" : "Offline"}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {emp.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                          {emp.employeeCode && <span>{emp.employeeCode}</span>}
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {formatTimeAgo(emp.lastPingAt)}
                          </span>
                          {emp.isOnline && emp.speed != null && (
                            <span className="flex items-center gap-1">
                              <Gauge size={11} /> {Math.round(emp.speed * 3.6)}{" "}
                              km/h
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectFromLive(emp)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition shrink-0 ${
                        selectedEmployee?.id === emp.id
                          ? "text-blue-700 bg-blue-100"
                          : "text-blue-700 bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md lg:col-span-3 flex flex-col min-h-0 overflow-hidden">
          {!selectedEmployee ? (
            <div className="relative flex-1 min-h-[420px]">
              <TrackingMap
                markers={liveMapMarkers}
                height="100%"
                className="h-full"
                emptyLabel="No live locations yet"
              />
              <div className="absolute top-4 left-4 z-[500] bg-white rounded-lg shadow-md px-4 py-2.5 flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-900">
                  {onlineCount} online
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-[500] bg-white/95 rounded-lg shadow-md px-4 py-2 text-xs text-gray-500 text-center">
                Select a rep to see their live location or a past trip.
              </div>
            </div>
          ) : tripLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3 min-h-[420px]">
              <Spinner size={40} borderWidth={4} />
              <p className="text-sm text-gray-500">Loading trip...</p>
            </div>
          ) : !tripData ? (
            <div className="relative flex-1 min-h-[420px]">
              <TrackingMap
                markers={[]}
                height="100%"
                className="h-full"
                emptyLabel="No location data"
              />
              <div className="absolute bottom-4 left-4 right-4 z-[500] bg-white/95 rounded-lg shadow-md px-4 py-2 text-xs text-gray-500 text-center">
                No trip recorded for{" "}
                {selectedEmployee.name || selectedEmployee.id} on {tripDate}.
              </div>
            </div>
          ) : (
            <TripAnalysisPanel
              tripData={tripData}
              selectedEmployee={selectedEmployee}
              tripDate={tripDate}
              markers={tripMapMarkers}
              isLive={isLive}
            />
          )}
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
          ${toast.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
          <button
            type="button"
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

export default LiveTrackingDashboard;
