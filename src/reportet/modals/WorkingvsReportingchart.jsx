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
import { getDailyWorkingVsReportingSummary } from "../api/profile";
import { TotalLabel, ChartCard, ChartStatus } from "./ChartHelpers";

const REPORTING_SEGMENTS = ["Reported", "Not Reported"];
const REPORTING_COLORS = {
  Reported: "#0f800f",
  "Not Reported": "#e71919",
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

// Format "2026-08-05" -> "5 Aug" for compact x-axis labels
function formatDayLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function WorkingVsReportingChart() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallComplianceRate, setOverallComplianceRate] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchSummary() {
      setLoading(true);
      try {
        const res = await getDailyWorkingVsReportingSummary({
          month,
          year,
          signal: controller.signal,
        });
        if (cancelled) return;
        if (!res?.success) {
          setData([]);
          setOverallComplianceRate(0);
          return;
        }
        const chartData = (res.data || []).map((row) => ({
          date: formatDayLabel(row.date),
          Reported: row.reported,
          "Not Reported": row.notReported,
          expectedToWork: row.expectedToWork,
        }));
        setData(chartData);
        setOverallComplianceRate(res.summary?.overallComplianceRate || 0);
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          console.error("Failed to load working vs reporting summary", err);
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
      title="Daily Working vs Reporting"
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
          <span className="text-sm font-medium text-teal-700 whitespace-nowrap">
            {overallComplianceRate}% compliance
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
          <BarChart data={data} barSize={20} margin={{ top: 24, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
              interval={Math.ceil(data.length / 15)}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <Tooltip />
            <Legend />
            {REPORTING_SEGMENTS.map((segment, i) => (
              <Bar
                key={segment}
                dataKey={segment}
                stackId="reporting"
                fill={REPORTING_COLORS[segment]}
                radius={i === REPORTING_SEGMENTS.length - 1 ? [4, 4, 0, 0] : 0}
              />
            ))}
            <TotalLabel stackId="reporting" totalKey="expectedToWork" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
