"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import api from "../../../../lib/axios";

export default function AdminCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);

  useEffect(() => {
    api.get("/cases?page=1&limit=50").then((res) => {
      setCases(res.data.data);
    });

    api.get("/lawyers?page=1&limit=50").then((res) => {
      setLawyers(res.data.data);
    });
  }, []);

  const assignLawyer = async (caseId: string, lawyerId: string) => {
    await api.patch(`/cases/${caseId}/assign`, {
      lawyerId,
    });
    alert("Lawyer Assigned");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Case Management</h1>

      <div className="space-y-4">
        {cases.map((legalCase) => (
          <div
            key={legalCase.id}
            className="bg-white p-6 rounded-2xl shadow-md"
          >
            <h2 className="font-semibold">{legalCase.title}</h2>

            <p className="text-sm text-gray-500 mb-3">
              Status: {legalCase.status}
            </p>

            {!legalCase.lawyer && (
              <select
                onChange={(e) => assignLawyer(legalCase.id, e.target.value)}
                className="border p-2 rounded"
              >
                <option>Assign Lawyer</option>
                {lawyers.map((lawyer) => (
                  <option key={lawyer.id} value={lawyer.id}>
                    {lawyer.user.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
