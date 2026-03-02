"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import api from "../../../../lib/axios";
import Link from "next/link";

interface CaseType {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  lawyer?: {
    user: {
      name: string;
    };
  };
}

export default function ClientCasesPage() {
  const [cases, setCases] = useState<CaseType[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCases = async () => {
    const res = await api.get("/cases?page=1&limit=20");
    setCases(res.data.data);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCreateCase = async () => {
    if (!title || !description) return;

    setLoading(true);

    try {
      await api.post("/cases", { title, description, location });
      setTitle("");
      setDescription("");
      fetchCases();
    } catch (err) {
      alert("Error creating case");
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-700";
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "in_progress":
        return "bg-purple-100 text-purple-700";
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Page Header */}
        <div className="mb-10">
          <div
            className="relative overflow-hidden rounded-3xl 
                  bg-gradient-to-r from-orange-50 via-[#fefaf4] to-orange-100 
                  px-6 py-8 md:px-10 md:py-12 
                  shadow-sm border border-orange-100"
          >
            {/* Subtle decorative glow */}
            <div
              className="absolute -top-12 -right-12 w-40 h-40 
                    bg-orange-200/40 rounded-full blur-3xl"
            ></div>

            <div className="relative z-10 max-w-2xl">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl 
                     font-bold text-gray-800 leading-tight"
              >
                My Legal Cases
              </h1>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                Manage and track all your legal requests with clarity and
                confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Create Case Card */}
        <div className="bg-white border border-orange-100 rounded-3xl shadow-lg p-8 transition hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Create New Case
          </h2>

          <div className="space-y-5">
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              placeholder="Case Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              placeholder="Describe your issue..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={handleCreateCase}
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-md
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.97]"
            }`}
            >
              {loading ? "Creating..." : "Create Case"}
            </button>
          </div>
        </div>

        {/* Case List */}
        <div className="bg-white border border-orange-100 rounded-3xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your Cases
          </h2>

          <div className="space-y-5">
            {cases.map((legalCase) => (
              <Link
                key={legalCase.id}
                href={`/client/cases/${legalCase.id}`}
                className="block group"
              >
                <div className="rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#faf9f6] hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition">
                      {legalCase.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {legalCase.category}
                    </p>

                    {legalCase.lawyer && (
                      <p className="text-sm mt-1 text-gray-600">
                        Assigned Lawyer:{" "}
                        <span className="font-medium text-gray-900">
                          {legalCase.lawyer.user.name}
                        </span>
                      </p>
                    )}
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                      legalCase.status,
                    )}`}
                  >
                    {legalCase.status.replace("_", " ")}
                  </span>
                </div>
              </Link>
            ))}

            {cases.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                No cases created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
