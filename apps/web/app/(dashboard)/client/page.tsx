"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import api from "../../../lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CaseType {
  id: string;
  title: string;
  status: string;
  lawyer?: {
    id: string;
    user: {
      name: string;
    };
  };
}

export default function ClientDashboard() {
  const [cases, setCases] = useState<CaseType[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const caseRes = await api.get("/cases?page=1&limit=50");
      const notiRes = await api.get("/notifications?page=1&limit=5");

      setCases(caseRes.data.data || []);
      setNotifications(notiRes.data.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  const totalCases = cases.length;
  const activeCases = cases.filter(
    (c) => c.status === "assigned" || c.status === "in_progress",
  ).length;
  const closedCases = cases.filter((c) => c.status === "closed").length;
  const pendingPayment = cases.filter((c) => c.status === "assigned").length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 min-h-screen p-2 md:p-0">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-50 via-[#fefaf4] to-orange-100 p-6 md:p-10 shadow-sm border border-orange-100">
          {/* Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-200 opacity-30 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Text Section */}
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Welcome Back 👋
              </h1>

              <p className="text-gray-600 mt-3 text-sm md:text-base">
                Stay updated with your legal cases, track progress, manage
                payments, and communicate seamlessly with your lawyer.
              </p>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button onClick={() => router.push("/client/cases")} className="w-full sm:w-auto bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-orange-600 transition font-medium">
                + Create New Case
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Cases", value: totalCases },
            { label: "Active Cases", value: activeCases },
            { label: "Closed Cases", value: closedCases },
            {
              label: "Pending Payment",
              value: pendingPayment,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-orange-100"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Cases
            </h2>

            <Link
              href="/client/cases"
              className="text-sm text-orange-500 hover:underline"
            >
              View All
            </Link>
          </div>

          {cases.slice(0, 5).length === 0 ? (
            <p className="text-gray-500">No cases yet.</p>
          ) : (
            <div className="space-y-4">
              {cases.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  href={`/client/cases/${c.id}`}
                  className="block p-4 rounded-xl border border-orange-100 hover:bg-orange-50 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 className="font-medium text-gray-800">{c.title}</h3>

                    <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full w-fit">
                      {c.status.replace("_", " ")}
                    </span>
                  </div>

                  {c.lawyer && (
                    <p className="text-sm text-gray-500 mt-2">
                      Assigned Lawyer: {c.lawyer.user.name}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Recent Notifications
          </h2>

          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl bg-orange-50 border border-orange-100"
                >
                  <h4 className="font-medium text-gray-800">{n.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
