import React, { useEffect, useState, useCallback } from "react";
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

import { getDoctorVisitReport } from "../api/api";
import { getAllLeavesForAdmin } from "../api/leave";
import { organizationSalesList } from "../api/sale";
import { getAllHeadQuarterNames, getHeadQuarterBudget } from "../api/profile";

const VISIT_BUCKETS = ["0 Visits", "1-2 Visits", "3-5 Visits", "6+ Visits"];
const BUCKET_COLORS = {
  "0 Visits": "#ef4444",
  "1-2 Visits": "#f59e0b",
  "3-5 Visits": "#3b82f6",
  "6+ Visits": "#22c55e",
};

function bucketVisits(totalVisits) {
  if (!totalVisits) return "0 Visits";
  if (totalVisits <= 2) return "1-2 Visits";
  if (totalVisits <= 5) return "3-5 Visits";
  return "6+ Visits";
}

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
          grouped[hq] = { headquarter: hq };
          VISIT_BUCKETS.forEach((b) => (grouped[hq][b] = 0));
        }
        grouped[hq][bucketVisits(doc.totalVisits)] += 1;
      });

      const rows = Object.values(grouped);
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
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="headquarter" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {VISIT_BUCKETS.map((bucket) => (
              <Bar
                key={bucket}
                dataKey={bucket}
                stackId="visits"
                fill={BUCKET_COLORS[bucket]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

const LEAVE_TYPES = ["sick", "casual", "earned", "unpaid"];
const LEAVE_COLORS = {
  sick: "#ef4444",
  casual: "#3b82f6",
  earned: "#22c55e",
  unpaid: "#a855f7",
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
        const res = await getAllLeavesForAdmin({
          pageNo,
          limit,
          status: "approved",
        });
        if (!res?.success) break;
        const batch = res.leaves || [];
        all = all.concat(batch);
        if (!batch.length || all.length >= (res.totalCount || 0)) break;
        pageNo += 1;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentlyOnLeave = all.filter(
        (l) => new Date(l.startDate) <= today && new Date(l.endDate) >= today,
      ).length;
      setOnLeaveToday(currentlyOnLeave);

      const grouped = {};
      all.forEach((leave) => {
        const label = monthLabel(leave.startDate);
        if (!grouped[label]) {
          grouped[label] = {
            month: label,
            _sortKey: new Date(leave.startDate),
          };
          LEAVE_TYPES.forEach((t) => (grouped[label][t] = 0));
        }
        if (grouped[label][leave.leaveType] !== undefined) {
          grouped[label][leave.leaveType] += 1;
        }
      });

      const sorted = Object.values(grouped).sort(
        (a, b) => a._sortKey - b._sortKey,
      );
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
        <h2 className="text-lg font-semibold text-gray-800">
          Employees on Leave
        </h2>
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
          No approved leaves found
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {LEAVE_TYPES.map((type) => (
              <Bar
                key={type}
                dataKey={type}
                stackId="leaves"
                fill={LEAVE_COLORS[type]}
                name={type.charAt(0).toUpperCase() + type.slice(1)}
              />
            ))}
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

function SalesBudgetChart() {
  const [headquarters, setHeadquarters] = useState([]);
  const [selectedHQ, setSelectedHQ] = useState("");
  const [financialYear, setFinancialYear] = useState(currentFinancialYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllHeadQuarterNames()
      .then((res) => {
        const list = res?.headquarters || res?.data || [];
        setHeadquarters(list);
        if (list[0]) setSelectedHQ(list[0]._id);
      })
      .catch((err) => console.error("Failed to load headquarters", err));
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedHQ) return;
    setLoading(true);
    try {
      const [startYear, endYear] = financialYear.split("-").map(Number);

      const [budgetRes, salesRes] = await Promise.all([
        getHeadQuarterBudget(selectedHQ, financialYear),
        organizationSalesList(null, {
          years: [startYear, endYear],
          limit: 1000,
          pageNo: 1,
        }),
      ]);

      const budgetMap = {};
      (budgetRes?.data?.months || []).forEach((m) => {
        budgetMap[m.month.toLowerCase()] = m.allocatedBudget;
      });

      const salesByMonth = {};
      (salesRes?.data || []).forEach((sale) => {
        salesByMonth[sale.month] =
          (salesByMonth[sale.month] || 0) + (sale.saleAmount || 0);
      });

      const chartData = MONTH_ORDER.map((m) => {
        const allocated = budgetMap[m] || 0;
        const sold = salesByMonth[m] || 0;
        return {
          month: m.charAt(0).toUpperCase() + m.slice(1),
          "Sale Amount": Math.min(sold, allocated),
          "Over Budget": Math.max(sold - allocated, 0),
          "Remaining Budget": Math.max(allocated - sold, 0),
        };
      });

      setData(chartData);
    } catch (err) {
      console.error("Failed to load sales/budget data", err);
    } finally {
      setLoading(false);
    }
  }, [selectedHQ, financialYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          >
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
        Note: sales are summed organization-wide per month — the Sale model
        doesn&apos;t currently store a headquarter reference, so this isn&apos;t
        filtered to the selected HQ yet. Add a headQuarterId to Sale (or derive
        it from the employee) to make this exact.
      </p>

      {loading ? (
        <div className="h-72 flex items-center justify-center text-gray-400">
          Loading…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sale Amount" stackId="budget" fill="#3b82f6" />
            <Bar dataKey="Over Budget" stackId="budget" fill="#ef4444" />
            <Bar dataKey="Remaining Budget" stackId="budget" fill="#e5e7eb" />
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
