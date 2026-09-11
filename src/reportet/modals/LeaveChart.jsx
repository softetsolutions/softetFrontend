import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { getLeaveSummary } from "../api/leave";
import { ChartCard, ChartStatus } from "./ChartHelpers";

const LEAVE_STATUSES = ["approved", "pending", "rejected"];
const STATUS_COLORS = {
  approved: "#22c55e",
  pending: "#f59e0b",
  rejected: "#ef4444",
};

function yearOptions() {
  const now = new Date().getFullYear();
  return [now, now - 1, now - 2, now - 3];
}

function typeBreakdown(row) {
  const raw =
    row?.leaveTypes ||
    row?.byLeaveType ||
    row?.typeBreakdown ||
    row?.types ||
    null;

  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (!item) return null;
        if (typeof item === "string") return { label: item, count: null };
        const nested = item.leaveType;
        const label =
          item.name ||
          item.code ||
          nested?.name ||
          nested?.code ||
          (typeof item.leaveType === "string" ? item.leaveType : null) ||
          "Leave";
        const count =
          item.count ??
          item.total ??
          item.taken ??
          item.leaveTotal ??
          item.value ??
          null;
        return { label, count };
      })
      .filter(Boolean);
  }

  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([label, value]) => ({
      label,
      count:
        typeof value === "number"
          ? value
          : (value?.count ?? value?.total ?? value?.taken ?? null),
    }));
  }

  return [];
}

function TypeBreakdownList({ row }) {
  const types = typeBreakdown(row);
  if (!types.length) {
    return (
      <p className="text-xs text-gray-400">No leave type breakdown</p>
    );
  }

  return (
    <ul className="mt-1 space-y-1">
      {types.map((type) => (
        <li
          key={type.label}
          className="flex items-center justify-between gap-4 text-xs text-gray-700"
        >
          <span>{type.label}</span>
          <span className="font-medium text-gray-900">
            {type.count ?? "—"}
          </span>
        </li>
      ))}
    </ul>
  );
}

function LeaveTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm text-sm">
      <p className="font-medium text-gray-800">{label}</p>
      <p className="text-xs text-gray-500 mb-1">
        Total: {row.leaveTotal ?? 0}
      </p>
      <div className="space-y-0.5 mb-2">
        {LEAVE_STATUSES.map((status) => (
          <p key={status} className="text-xs text-gray-600 capitalize">
            {status}: {row[status] ?? 0}
          </p>
        ))}
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        By type
      </p>
      <TypeBreakdownList row={row} />
    </div>
  );
}

function TotalLabelContent({ x, y, width, value, index, data, onHover }) {
  const row = data[index];
  if (value == null || value === "") return null;

  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fill="#1f2937"
      fontSize={13}
      fontWeight={600}
      style={{ cursor: "pointer" }}
      onMouseEnter={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onHover({
          row,
          left: rect.left,
          top: rect.top,
        });
      }}
      onMouseLeave={() => onHover(null)}
    >
      {value}
    </text>
  );
}

export default function LeaveChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onLeaveToday, setOnLeaveToday] = useState(0);
  const [hoverTotal, setHoverTotal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchSummary() {
      setLoading(true);
      try {
        const res = await getLeaveSummary({ year, signal: controller.signal });
        if (cancelled) return;
        if (!res?.success) {
          setData([]);
          setOnLeaveToday(0);
          return;
        }
        setData(res.data || []);
        setOnLeaveToday(res.onLeaveToday || 0);
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          console.error("Failed to load leave summary", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [year]);

  return (
    <ChartCard
      title="Leave Requests"
      badge={
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {yearOptions().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <span className="text-sm font-medium text-blue-600 whitespace-nowrap">
            {onLeaveToday} on leave today
          </span>
        </div>
      }
    >
      <ChartStatus
        loading={loading}
        empty={data.length === 0}
        emptyText="No leave requests found"
      />
      {!loading && data.length > 0 && (
        <div className="relative">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={data} barSize={56} margin={{ top: 24, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip content={<LeaveTooltip />} />
              <Legend />
              {LEAVE_STATUSES.map((status, i) => (
                <Bar
                  key={status}
                  dataKey={status}
                  stackId="leaves"
                  fill={STATUS_COLORS[status]}
                  name={status.charAt(0).toUpperCase() + status.slice(1)}
                  radius={i === LEAVE_STATUSES.length - 1 ? [6, 6, 0, 0] : 0}
                />
              ))}
              <Bar
                dataKey="_anchor"
                stackId="leaves"
                fill="transparent"
                isAnimationActive={false}
                legendType="none"
              >
                <LabelList
                  dataKey="leaveTotal"
                  content={(props) => (
                    <TotalLabelContent
                      {...props}
                      data={data}
                      onHover={setHoverTotal}
                    />
                  )}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {hoverTotal?.row && (
            <div
              className="pointer-events-none fixed z-50 w-44 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
              style={{
                left: hoverTotal.left,
                top: hoverTotal.top - 8,
                transform: "translate(-50%, -100%)",
              }}
            >
              <p className="text-xs font-medium text-gray-800">
                {hoverTotal.row.month} · {hoverTotal.row.leaveTotal ?? 0} total
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 mt-1">
                By type
              </p>
              <TypeBreakdownList row={hoverTotal.row} />
            </div>
          )}
        </div>
      )}
    </ChartCard>
  );
}
