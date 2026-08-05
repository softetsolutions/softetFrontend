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
import { getDoctorVisitSummary } from "../api/api";
import { TotalLabel, ChartCard, ChartStatus } from "./ChartHelpers";

const VISIT_SEGMENTS = ["Visited", "0 Visits"];
const VISIT_COLORS = {
  Visited: "#334155",
  "0 Visits": "#5c2c0d",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function currentYearOptions() {
  const now = new Date().getFullYear();
  // last 3 years + current year
  return [now, now - 1, now - 2, now - 3];
}

export default function DoctorVisitChart() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zeroVisitCount, setZeroVisitCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchSummary() {
      setLoading(true);
      try {
        const res = await getDoctorVisitSummary({
          month,
          year,
          signal: controller.signal,
        });
        if (cancelled) return;
        if (!res?.success) {
          setData([]);
          setZeroVisitCount(0);
          return;
        }
        setData(res.data || []);
        setZeroVisitCount(res.zeroVisitCount || 0);
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          console.error("Failed to load doctor visit summary", err);
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
  }, [month, year]);

  return (
    <ChartCard
      title="Doctor Visit Coverage"
      badge={
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {currentYearOptions().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <span className="text-sm font-medium text-red-600 whitespace-nowrap">
            {zeroVisitCount} doctor{zeroVisitCount === 1 ? "" : "s"} with 0
            visits
          </span>
        </div>
      }
    >
      <ChartStatus
        loading={loading}
        empty={data.length === 0}
        emptyText="No data for this period"
      />
      {!loading && data.length > 0 && (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} barSize={56} margin={{ top: 24, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="headquarter"
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
            {VISIT_SEGMENTS.map((segment, i) => (
              <Bar
                key={segment}
                dataKey={segment}
                stackId="visits"
                fill={VISIT_COLORS[segment]}
                radius={i === VISIT_SEGMENTS.length - 1 ? [6, 6, 0, 0] : 0}
              />
            ))}
            <TotalLabel stackId="visits" totalKey="doctorTotal" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
