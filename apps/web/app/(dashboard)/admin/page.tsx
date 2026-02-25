"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import api from "../../../lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/analytics/platform").then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Users", value: stats.totalUsers },
          { label: "Lawyers", value: stats.totalLawyers },
          { label: "Cases", value: stats.totalCases },
          { label: "Revenue", value: `₹${stats.totalRevenue}` },
        ].map((item) => (
          <div key={item.label} className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
