import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";

import { getDoctorVisitReport } from "../api/api";
import { getAllLeavesForAdmin } from "../api/leave";
import { organizationSalesList, getHeadQuarterSalesList } from "../api/sale";
import { getAllHeadQuarterNames, getHeadQuarterBudget } from "../api/profile";

function TotalLabel({ stackId, totalKey }) {
  return (
    <Bar
      dataKey="_anchor"
      stackId={stackId}
      fill="transparent"
      isAnimationActive={false}
    >
      <LabelList
        dataKey={totalKey}
        position="top"
        style={{ fontWeight: 600, fill: "#1f2937", fontSize: 13 }}
      />
    </Bar>
  );
}

const VISIT_SEGMENTS = ["Visited", "0 Visits"];
const VISIT_COLORS = {
  Visited: "#334155",
  "0 Visits": "#5c2c0d",
};

function DoctorVisitChart({ month, year }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zeroVisitCount, setZeroVisitCount] = useState(0);

  const fetchAllDoctors = useCallback(async () => {
    setLoading(true);
    try {
      let pageNo = 1;
      const limit = 50;
      let all = [];
      let hasNextPage = true;

      while (hasNextPage) {
        const res = await getDoctorVisitReport({ month, year, pageNo, limit });
        if (!res?.success) break;
        all = all.concat(res.data || []);
        hasNextPage = Boolean(res.pagination?.hasNextPage);
        pageNo += 1;
      }

      const grouped = {};
      all.forEach((doc) => {
        const hq = doc.headQuarterName || "Unassigned";
        if (!grouped[hq]) {
          grouped[hq] = {
            headquarter: hq,
            _anchor: 0,
            "0 Visits": 0,
            Visited: 0,
          };
        }
        if (!doc.totalVisits) {
          grouped[hq]["0 Visits"] += 1;
        } else {
          grouped[hq]["Visited"] += 1;
        }
      });

      const rows = Object.values(grouped).map((row) => ({
        ...row,
        doctorTotal: row["0 Visits"] + row["Visited"],
      }));

      setData(rows);
      setZeroVisitCount(rows.reduce((sum, r) => sum + (r["0 Visits"] || 0), 0));
    } catch (err) {
      console.error("Failed to load doctor visit report", err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchAllDoctors();
  }, [fetchAllDoctors]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Doctor Visit Coverage
        </h2>
        <span className="text-sm font-medium text-red-600">
          {zeroVisitCount} doctor{zeroVisitCount === 1 ? "" : "s"} with 0 visits
        </span>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center text-gray-400">
          Loading…
        </div>
      ) : data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-gray-400">
          No data for this period
        </div>
      ) : (
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
    </div>
  );
}
const LEAVE_STATUSES = ["approved", "pending", "rejected"];
const STATUS_COLORS = {
  approved: "#22c55e",
  pending: "#f59e0b",
  rejected: "#ef4444",
};

function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function LeaveChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onLeaveToday, setOnLeaveToday] = useState(0);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      let pageNo = 1;
      const limit = 50;
      let all = [];

      while (true) {
        const res = await getAllLeavesForAdmin({ pageNo, limit });
        if (!res?.success) break;
        const batch = res.leaves || [];
        all = all.concat(batch);
        if (!batch.length || all.length >= (res.totalCount ?? all.length))
          break;
        pageNo += 1;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentlyOnLeave = all.filter(
        (l) =>
          l.status === "approved" &&
          new Date(l.startDate) <= today &&
          new Date(l.endDate) >= today,
      ).length;
      setOnLeaveToday(currentlyOnLeave);

      const grouped = {};
      all.forEach((leave) => {
        const label = monthLabel(leave.startDate);
        if (!grouped[label]) {
          grouped[label] = {
            month: label,
            _anchor: 0,
            _sortKey: new Date(leave.startDate),
          };
          LEAVE_STATUSES.forEach((s) => (grouped[label][s] = 0));
        }
        if (grouped[label][leave.status] !== undefined) {
          grouped[label][leave.status] += 1;
        }
      });

      const sorted = Object.values(grouped)
        .map((row) => ({
          ...row,
          leaveTotal: LEAVE_STATUSES.reduce((sum, s) => sum + row[s], 0),
        }))
        .sort((a, b) => a._sortKey - b._sortKey);

      setData(sorted);
    } catch (err) {
      console.error("Failed to load leave data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Leave Requests</h2>
        <span className="text-sm font-medium text-blue-600">
          {onLeaveToday} on leave today
        </span>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center text-gray-400">
          Loading…
        </div>
      ) : data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-gray-400">
          No leave requests found
        </div>
      ) : (
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
    </div>
  );
}

const MONTH_ORDER = [
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  "january",
  "february",
  "march",
];

function currentFinancialYear() {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 3 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

function extractHeadquarters(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.headQuarterNames)) return res.headQuarterNames;
  if (Array.isArray(res?.headquarters)) return res.headquarters;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.headQuarters)) return res.headQuarters;
  return [];
}

const ALL_HQ = "ALL";

function SalesBudgetChart() {
  const [headquarters, setHeadquarters] = useState([]);
  const [hqLoaded, setHqLoaded] = useState(false);
  const [selectedHQ, setSelectedHQ] = useState(ALL_HQ);
  const [financialYear, setFinancialYear] = useState(currentFinancialYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllHeadQuarterNames()
      .then((res) => setHeadquarters(extractHeadquarters(res)))
      .catch((err) => console.error("Failed to load headquarters", err))
      .finally(() => setHqLoaded(true));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [startYear, endYear] = financialYear.split("-").map(Number);
      const budgetMap = {};

      if (selectedHQ === ALL_HQ) {
        const budgetResults = await Promise.all(
          headquarters.map((hq) => getHeadQuarterBudget(hq._id, financialYear)),
        );
        budgetResults.forEach((budgetRes) => {
          (budgetRes?.data?.months || []).forEach((m) => {
            const key = m.month.toLowerCase();
            budgetMap[key] = (budgetMap[key] || 0) + (m.allocatedBudget || 0);
          });
        });
      } else {
        const budgetRes = await getHeadQuarterBudget(selectedHQ, financialYear);
        (budgetRes?.data?.months || []).forEach((m) => {
          budgetMap[m.month.toLowerCase()] = m.allocatedBudget;
        });
      }

      const salesRes =
        selectedHQ === ALL_HQ
          ? await organizationSalesList(null, {
              years: [startYear, endYear],
              limit: 1000,
              pageNo: 1,
            })
          : await getHeadQuarterSalesList(selectedHQ, {
              years: [startYear, endYear],
            });

      const salesByMonth = {};
      (salesRes?.data || []).forEach((sale) => {
        salesByMonth[sale.month] =
          (salesByMonth[sale.month] || 0) + (sale.saleAmount || 0);
      });

      const chartData = MONTH_ORDER.map((m) => {
        const sale = salesByMonth[m] || 0;
        const budget = budgetMap[m] || 0;
        return {
          month: m.charAt(0).toUpperCase() + m.slice(1),
          _anchor: 0,
          "Sale Amount": sale,
          "Allocated Budget": budget,
          budgetTotal: (sale + budget).toLocaleString("en-IN"),
        };
      });

      setData(chartData);
    } catch (err) {
      console.error("Failed to load sales/budget data", err);
    } finally {
      setLoading(false);
    }
  }, [selectedHQ, financialYear, headquarters]);

  useEffect(() => {
    if (!hqLoaded) return;
    fetchData();
  }, [fetchData, hqLoaded]);

  const noHeadquarters = hqLoaded && headquarters.length === 0;
  const selectedHQName =
    selectedHQ === ALL_HQ
      ? null
      : headquarters.find((hq) => hq._id === selectedHQ)?.headQuarterName;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Sales vs Allocated Budget
        </h2>
        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedHQ}
            onChange={(e) => setSelectedHQ(e.target.value)}
            disabled={headquarters.length === 0}
          >
            <option value={ALL_HQ}>All Headquarters (Org Total)</option>
            {headquarters.map((hq) => (
              <option key={hq._id} value={hq._id}>
                {hq.headQuarterName}
              </option>
            ))}
          </select>
          <input
            className="border rounded px-2 py-1 text-sm w-28"
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            placeholder="2025-2026"
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-2">
        {selectedHQ === ALL_HQ
          ? `Comparing total sales across the organization against the combined budget of all headquarters for ${financialYear}.`
          : `Comparing ${selectedHQName}'s sales against its allocated budget for ${financialYear}.`}
      </p>
      {noHeadquarters ? (
        <div className="h-72 flex items-center justify-center text-gray-400 text-center px-6">
          No headquarters configured yet. Add one under Headquarter Master to
          see this chart.
        </div>
      ) : loading ? (
        <div className="h-72 flex items-center justify-center text-gray-400">
          Loading…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} barSize={56} margin={{ top: 24, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sale Amount" stackId="budget" fill="#3b82f6" />
            <Bar
              dataKey="Allocated Budget"
              stackId="budget"
              fill="#e5e7eb"
              radius={[6, 6, 0, 0]}
            />
            <TotalLabel stackId="budget" totalKey="budgetTotal" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Reports Dashboard</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DoctorVisitChart />
        <LeaveChart />
        <div className="xl:col-span-2">
          <SalesBudgetChart />
        </div>
      </div>
    </div>
  );
}
