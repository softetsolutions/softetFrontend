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
} from "lucide-react";
import Spinner from "../genericComps/Spinner";
import { getTripByDate, openLiveLocationsStream } from "../api/trackingApi";
import { getEmployeeListOptions } from "../api/employee";
import MapboxMap from "../modals/MapboxMap";

const todayStr = () => new Date().toISOString().slice(0, 10);

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

const formatDistance = (meters = 0) =>
  meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;

const formatDuration = (totalSeconds = 0) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

const formatClock = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const placeLabel = (point) =>
  point?.placeName || `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`;

const employeeDisplayName = (emp) =>
  emp?.displayName ||
  [emp?.firstName, emp?.lastName].filter(Boolean).join(" ") ||
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

const KMH = (ms) => (ms == null ? null : ms * 3.6);
const classify = (speedMs) => {
  const kmh = KMH(speedMs);
  if (kmh == null) return "unknown";
  if (kmh < 2) return "stopped";
  if (kmh < 7) return "walking";
  return "driving";
};
const avg = (arr) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

function buildActivityTimeline(path) {
  if (!path?.length) return [];

  const events = [
    { type: "start", point: path[0], timestamp: path[0].timestamp },
  ];

  let segStart = 0;
  let currentType = classify(path[0].speed);

  const flushSegment = (endIdxInclusive) => {
    const seg = path.slice(segStart, endIdxInclusive + 1);
    if (!seg.length) return;
    const durationSec =
      (new Date(seg[seg.length - 1].timestamp) - new Date(seg[0].timestamp)) /
      1000;
    const speeds = seg.map((p) => p.speed).filter((s) => s != null);

    if (currentType === "stopped" && durationSec >= 60) {
      events.push({
        type: "stop",
        startTime: seg[0].timestamp,
        durationSec,
        point: seg[0],
      });
    } else if (currentType === "walking" && durationSec >= 30) {
      events.push({
        type: "walking",
        startTime: seg[0].timestamp,
        durationSec,
        avgSpeedMs: avg(speeds),
        point: seg[0],
      });
    } else if (currentType === "driving" && durationSec >= 30) {
      events.push({
        type: "driving",
        startTime: seg[0].timestamp,
        durationSec,
        avgSpeedMs: avg(speeds),
        point: seg[0],
      });
    }
  };

  for (let i = 1; i < path.length; i++) {
    const type = classify(path[i].speed);
    if (type !== currentType) {
      flushSegment(i - 1);
      segStart = i;
      currentType = type;
    }
  }
  flushSegment(path.length - 1);

  events.push({
    type: "completed",
    point: path[path.length - 1],
    timestamp: path[path.length - 1].timestamp,
  });

  return events;
}

function buildTripMarkers(path, timeline, isLive) {
  if (!path?.length) return [];

  const markers = [];
  const stopPoints = new Set(
    timeline.filter((e) => e.type === "stop").map((e) => e.point.timestamp),
  );

  path.forEach((p, i) => {
    const isFirst = i === 0;
    const isLast = i === path.length - 1;
    const isStop = stopPoints.has(p.timestamp);

    if (isFirst) {
      markers.push({
        lat: p.lat,
        lng: p.lng,
        color: "green",
        label: "Start",
        type: "major",
      });
    } else if (isLast) {
      markers.push({
        lat: p.lat,
        lng: p.lng,
        color: isLive ? "blue" : "darkred",
        label: isLive ? "Live" : "End",
        type: "major",
        pulse: isLive,
      });
    } else if (isStop) {
      markers.push({
        lat: p.lat,
        lng: p.lng,
        color: "orange",
        label: "Stop",
        type: "major",
      });
    } else {
      markers.push({
        lat: p.lat,
        lng: p.lng,
        color: "blue",
        label: `${formatClock(p.timestamp)}${
          p.speed != null ? ` · ${Math.round(p.speed * 3.6)} km/h` : ""
        }`,
        type: "ping",
      });
    }
  });

  return markers;
}

const TIMELINE_ICON = {
  start: { Icon: Radio, ring: "text-green-600 border-green-500", solid: false },
  stop: { Icon: MapPin, ring: "text-red-600 border-red-500", solid: true },
  driving: {
    Icon: Car,
    ring: "text-gray-400 border-gray-300",
    solid: false,
    dotOnly: true,
  },
  walking: {
    Icon: Footprints,
    ring: "text-gray-600 border-gray-400",
    solid: false,
  },
  completed: { Icon: Flag, ring: "text-gray-900 border-gray-900", solid: true },
};

function TimelineRow({ event }) {
  const cfg = TIMELINE_ICON[event.type];
  const { Icon } = cfg;

  let title, meta, rightLabel, rightValue, badgeLabel;
  switch (event.type) {
    case "start":
      title = "Trip Started";
      meta = placeLabel(event.point);
      rightLabel = "Accuracy";
      rightValue = "GPS";
      break;
    case "stop":
      title = `Stop (Still) for ${Math.round(event.durationSec / 60)} min${
        Math.round(event.durationSec / 60) === 1 ? "" : "s"
      }`;
      meta = placeLabel(event.point);
      badgeLabel = "STILL";
      rightLabel = "Speed";
      rightValue = "0 km/h";
      break;
    case "driving":
      title = "Continued Journey";
      badgeLabel = "DRIVING";
      rightLabel = "Avg Speed";
      rightValue = `${Math.round(KMH(event.avgSpeedMs))} km/h`;
      break;
    case "walking":
      title = `Walking for ${Math.round(event.durationSec / 60)} min${
        Math.round(event.durationSec / 60) === 1 ? "" : "s"
      }`;
      badgeLabel = "WALKING";
      rightLabel = "Speed";
      rightValue = `${Math.round(KMH(event.avgSpeedMs))} km/h`;
      break;
    case "completed":
      title = "Trip Completed";
      meta = placeLabel(event.point);
      break;
    default:
      title = event.type;
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
            {formatClock(event.startTime || event.timestamp)}
          </div>
          <div className="text-sm font-semibold text-gray-900 mt-0.5">
            {title}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {badgeLabel && (
              <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                {badgeLabel}
              </span>
            )}
            {meta && <span className="text-xs text-gray-500">{meta}</span>}
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
  timeline,
  markers,
  isLive,
}) {
  const [showRawGps, setShowRawGps] = useState(false);

  const tripCode =
    tripData.trip.tripId ||
    (tripData.trip._id ? `T-${tripData.trip._id.toString().slice(-4)}` : "—");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 flex-1 min-h-0">
      {/* Map + overlay card */}
      <div className="xl:col-span-3 relative min-h-[420px]">
        <MapboxMap
          markers={markers}
          route={tripData.path}
          height="100%"
          className="h-full"
          emptyLabel="No location pings recorded for this trip"
        />
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-4 py-2.5 flex items-center gap-6">
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
            <div className="text-sm font-semibold text-gray-900">
              {tripCode}
            </div>
          </div>
          {isLive && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <Radio size={10} /> LIVE
            </span>
          )}
        </div>
      </div>

      {/* Analysis panel */}
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
                : tripData.trip.status === "active"
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
              {formatDistance(tripData.trip.totalDistanceMeters)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Duration
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDuration(tripData.trip.durationSeconds)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
            Activity Timeline
          </div>
          <button
            onClick={() => setShowRawGps((v) => !v)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            {showRawGps ? "Hide Raw GPS" : "View Raw GPS"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {timeline.length === 0 ? (
            <div className="text-sm text-gray-500 py-6 text-center">
              No location pings recorded for this trip.
            </div>
          ) : (
            timeline.map((event, i) => <TimelineRow key={i} event={event} />)
          )}
        </div>

        {showRawGps && (
          <div className="overflow-x-auto border border-gray-100 rounded-lg mt-4 max-h-64 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Place
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tripData.path.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(p.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 max-w-[220px] truncate">
                      {placeLabel(p)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {p.speed != null
                        ? `${Math.round(p.speed * 3.6)} km/h`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

  const eventSourceRef = useRef(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
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

    es.addEventListener("snapshot", (evt) => {
      setConnectionStatus("open");
      const rows = JSON.parse(evt.data);
      setLiveByEmployee((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          const emp = row.employeeId;
          const id = emp?._id || emp;
          if (!id) continue;
          next[id] = {
            id,
            name: employeeDisplayName(emp),
            employeeCode: emp?.employeeId,
            role: emp?.role,
            coordinates: row.location?.coordinates,
            speed: row.speed,
            heading: row.heading,
            isOnline: row.isOnline,
            lastPingAt: row.lastPingAt,
            sessionId: row.sessionId,
          };
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
            name: `Employee ${data.employeeId.slice(-4)}`,
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
            name: `Employee ${data.employeeId.slice(-4)}`,
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
        .filter((e) => Array.isArray(e.coordinates))
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
      if (!prev) return prev;
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
        // placeName omitted here — this point was appended live from the
        // SSE stream, not from the backend trip fetch, so it hasn't been
        // reverse-geocoded yet. placeLabel() falls back to coordinates
        // until the next full trip reload resolves it.
        placeName: null,
      };
      return {
        ...prev,
        path: [...prev.path, newPoint],
        trip: {
          ...prev.trip,
          status: live.isOnline ? "active" : prev.trip.status,
        },
      };
    });
  }, [selectedEmployee, isToday, liveByEmployee]);

  const timeline = useMemo(
    () => (tripData ? buildActivityTimeline(tripData.path || []) : []),
    [tripData],
  );

  const isLive = isToday && tripData?.trip.status === "active";

  const tripMapMarkers = useMemo(
    () => (tripData ? buildTripMarkers(tripData.path, timeline, isLive) : []),
    [tripData, timeline, isLive],
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
              <MapboxMap
                markers={liveMapMarkers}
                height="100%"
                className="h-full"
                emptyLabel="No live locations yet"
              />
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-4 py-2.5 flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-900">
                  {onlineCount} online
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-lg shadow-md px-4 py-2 text-xs text-gray-500 text-center">
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
              <MapboxMap
                markers={[]}
                height="100%"
                className="h-full"
                emptyLabel="No location data"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-lg shadow-md px-4 py-2 text-xs text-gray-500 text-center">
                No trip recorded for{" "}
                {selectedEmployee.name || selectedEmployee.id} on {tripDate}.
              </div>
            </div>
          ) : (
            <TripAnalysisPanel
              tripData={tripData}
              selectedEmployee={selectedEmployee}
              timeline={timeline}
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
