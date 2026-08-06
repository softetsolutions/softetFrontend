import { Bar, LabelList } from "recharts";

export function TotalLabel({ stackId, totalKey }) {
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

export function ChartCard({ title, badge, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {badge}
      </div>
      {children}
    </div>
  );
}

export function ChartStatus({ loading, empty, emptyText }) {
  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }
  if (empty) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        {emptyText}
      </div>
    );
  }
  return null;
}
