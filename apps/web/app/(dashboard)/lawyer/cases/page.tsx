"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import api from "../../../../lib/axios";
import Link from "next/link";

export default function LawyerCasesPage() {
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    api.get("/cases?page=1&limit=20").then((res) => {
      const assigned = res.data.data.filter((c: any) => c.lawyer);
      setCases(assigned);
    });
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Assigned Cases</h1>

      <div className="space-y-4">
        {cases.map((legalCase) => (
          <Link
            key={legalCase.id}
            href={`/client/cases/${legalCase.id}`}
            className="block bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="font-semibold">{legalCase.title}</h2>
            <p className="text-sm text-gray-500">Status: {legalCase.status}</p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
