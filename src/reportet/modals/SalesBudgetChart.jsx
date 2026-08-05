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
import { organizationSalesList, getHeadQuarterSalesList } from "../api/sale";
import {
  getAllHeadQuarterNames,
  getAllHeadQuarterBudgetsForYear,
} from "../api/profile";
import { TotalLabel, ChartCard } from "./ChartHelpers";

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
const ALL_HQ = "ALL";

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

export default function SalesBudgetChart() {
  const [headquarters, setHeadquarters] = useState([]);
  const [hqLoaded, setHqLoaded] = useState(false);
  const [selectedHQ, setSelectedHQ] = useState(ALL_HQ);
  const [financialYear, setFinancialYear] = useState(currentFinancialYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllHeadQuarterNames()
      .then((res) => !cancelled && setHeadquarters(extractHeadquarters(res)))
      .catch(
        (err) =>
          !cancelled && console.error("Failed to load headquarters", err),
      )
      .finally(() => !cancelled && setHqLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hqLoaded) return;
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const [startYear, endYear] = financialYear.split("-").map(Number);
        const budgetMap = {};

        // Single bulk call instead of N per-headquarter calls
        const allBudgetsRes =
          await getAllHeadQuarterBudgetsForYear(financialYear);
        if (cancelled) return;
        const budgetRows = allBudgetsRes?.data || [];

        if (selectedHQ === ALL_HQ) {
          budgetRows.forEach((row) => {
            (row.budget?.months || []).forEach((m) => {
              const key = m.month.toLowerCase();
              budgetMap[key] = (budgetMap[key] || 0) + (m.allocatedBudget || 0);
            });
          });
        } else {
          const hqRow = budgetRows.find(
            (row) => String(row.headQuarterId) === String(selectedHQ),
          );
          (hqRow?.budget?.months || []).forEach((m) => {
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

        if (cancelled) return;

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
        if (!cancelled) console.error("Failed to load sales/budget data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [selectedHQ, financialYear, hqLoaded]);

  const noHeadquarters = hqLoaded && headquarters.length === 0;
  const selectedHQName =
    selectedHQ === ALL_HQ
      ? null
      : headquarters.find((hq) => hq._id === selectedHQ)?.headQuarterName;

  return (
    <ChartCard
      title="Sales vs Allocated Budget"
      badge={
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
      }
    >
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
              fill="#1e293b"
              radius={[6, 6, 0, 0]}
            />
            <TotalLabel stackId="budget" totalKey="budgetTotal" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
