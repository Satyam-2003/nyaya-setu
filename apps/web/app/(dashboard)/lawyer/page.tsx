"use client";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../../lib/axios";

export default function LawyerDashboard() {
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    api.get("/cases?page=1&limit=10").then((res) => {
      setCases(res.data.data);
    });
  }, []);

  const activeCases = cases.filter(
    (c) => c.status === "assigned" || c.status === "in_progress",
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Lawyer Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Active Cases</h3>
            <p className="text-2xl font-bold">{activeCases.length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Total Cases</h3>
            <p className="text-2xl font-bold">{cases.length}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
