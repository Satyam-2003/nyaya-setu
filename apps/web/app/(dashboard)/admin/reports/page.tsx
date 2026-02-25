"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import api from "../../../../lib/axios";

export default function AdminReportsPage() {
  const [revenue, setRevenue] = useState<any[]>([]);

  useEffect(() => {
    api.get("/analytics/monthly-revenue").then((res) => {
      setRevenue(res.data);
    });
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Revenue Reports</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Month</th>
              <th>Total Revenue</th>
            </tr>
          </thead>

          <tbody>
            {revenue.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  {new Date(r.month).toLocaleDateString()}
                </td>
                <td>₹{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
