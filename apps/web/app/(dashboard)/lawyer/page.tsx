"use client";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import Link from "next/link";

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

  const completedCases = cases.filter((c) => c.status === "closed");

  const pendingCases = cases.filter((c) => c.status === "open");

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div
          className="bg-gradient-to-r from-orange-50 via-[#fefaf4] to-orange-100 
                        rounded-3xl p-8 shadow-sm border border-orange-100"
        >
          <h1 className="text-3xl font-bold text-gray-800">Lawyer Dashboard</h1>

          <p className="text-gray-600 mt-2">
            Manage your legal cases, communicate with clients and track your
            progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <h3 className="text-gray-500 text-sm">Active Cases</h3>
            <p className="text-2xl font-bold text-orange-600">
              {activeCases.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <h3 className="text-gray-500 text-sm">Total Cases</h3>
            <p className="text-2xl font-bold">{cases.length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <h3 className="text-gray-500 text-sm">Completed</h3>
            <p className="text-2xl font-bold text-green-600">
              {completedCases.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <h3 className="text-gray-500 text-sm">Pending Cases</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingCases.length}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/lawyer/cases"
            className="bg-white border border-orange-100 rounded-2xl p-6 shadow-md 
                       hover:shadow-lg transition group"
          >
            <h3 className="text-lg font-semibold group-hover:text-orange-600">
              My Cases
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              View and manage assigned cases.
            </p>
          </Link>

          <Link
            href="/lawyer/earnings"
            className="bg-white border border-orange-100 rounded-2xl p-6 shadow-md 
                       hover:shadow-lg transition group"
          >
            <h3 className="text-lg font-semibold group-hover:text-orange-600">
              Earnings
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Track payments from completed cases.
            </p>
          </Link>

          <Link
            href="/lawyer/profile"
            className="bg-white border border-orange-100 rounded-2xl p-6 shadow-md 
                       hover:shadow-lg transition group"
          >
            <h3 className="text-lg font-semibold group-hover:text-orange-600">
              Profile
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Update your professional details.
            </p>
          </Link>
        </div>

        {/* Recent Cases */}
        <div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-md">
          <h2 className="text-xl font-semibold mb-6">Recent Assigned Cases</h2>

          <div className="space-y-4">
            {activeCases.length === 0 && (
              <p className="text-gray-400">No active cases assigned yet.</p>
            )}

            {activeCases.map((c) => (
              <Link
                key={c.id}
                href={`/lawyer/cases/${c.id}`}
                className="block border rounded-xl p-5 hover:shadow-md transition bg-[#faf9f6]"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{c.title}</p>

                    <p className="text-sm text-gray-500">{c.category}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    {c.status.replace("_", " ")}
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
