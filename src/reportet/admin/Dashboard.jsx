import React from "react";
import DoctorVisitChart from "../modals/DoctorVisitChart";
import LeaveChart from "../modals/LeaveChart";
import SalesBudgetChart from "../modals/SalesBudgetChart";
import WorkingVsReportingChart from "../modals/WorkingvsReportingchart";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Reports Dashboard</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DoctorVisitChart />
        <WorkingVsReportingChart />

        <div className="xl:col-span-2">
          <SalesBudgetChart />
        </div>
        <div className="xl:col-span-2">
          <LeaveChart />
        </div>
      </div>
    </div>
  );
}
