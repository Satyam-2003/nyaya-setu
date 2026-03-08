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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "in_progress":
        return "bg-purple-100 text-purple-700";
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">

        {/* Page Header */}
        <div className="relative overflow-hidden rounded-3xl 
                        bg-gradient-to-r from-orange-50 via-[#fefaf4] to-orange-100 
                        px-6 py-8 md:px-10 md:py-12 
                        shadow-sm border border-orange-100">

          <div className="absolute -top-12 -right-12 w-40 h-40 
                          bg-orange-200/40 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800">
              Assigned Cases
            </h1>

            <p className="text-gray-600 mt-2">
              Manage and work on the legal cases assigned to you.
            </p>
          </div>
        </div>

        {/* Cases List */}
        <div className="bg-white border border-orange-100 rounded-3xl shadow-lg p-8">

          {cases.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No cases assigned yet.
            </div>
          )}

          <div className="space-y-5">
            {cases.map((legalCase) => (
              <Link
                key={legalCase.id}
                href={`/client/cases/${legalCase.id}`}
                className="block group"
              >
                <div className="rounded-2xl border border-gray-200 p-6 
                                flex flex-col md:flex-row 
                                md:items-center md:justify-between gap-4 
                                bg-[#faf9f6] hover:bg-white 
                                hover:shadow-lg transition-all duration-300">

                  {/* Case Info */}
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition">
                      {legalCase.title}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {legalCase.category}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                      legalCase.status
                    )}`}
                  >
                    {legalCase.status.replace("_", " ")}
                  </span>

                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}