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
} from "recharts";
import { getLeaveSummary } from "../api/leave";
import { TotalLabel, ChartCard, ChartStatus } from "./ChartHelpers";

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

export default function LeaveChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onLeaveToday, setOnLeaveToday] = useState(0);

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
            <Tooltip />
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
            <TotalLabel stackId="leaves" totalKey="leaveTotal" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
