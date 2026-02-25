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
      await api.post("/cases", { title, description });
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
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">My Legal Cases</h1>

        {/* Create Case Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h2 className="text-lg font-semibold">Create New Case</h2>

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Case Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border p-3 rounded-lg"
            placeholder="Describe your issue..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={handleCreateCase}
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Creating..." : "Create Case"}
          </button>
        </div>

        {/* Case List */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Your Cases</h2>

          <div className="space-y-4">
            {cases.map((legalCase) => (
              <Link
                key={legalCase.id}
                href={`/client/cases/${legalCase.id}`}
                className="block"
              >
                <div
                  key={legalCase.id}
                  className="border p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div>
                    <h3 className="font-semibold">{legalCase.title}</h3>
                    <p className="text-sm text-gray-600">
                      {legalCase.category}
                    </p>

                    {legalCase.lawyer && (
                      <p className="text-sm mt-1">
                        Assigned Lawyer:{" "}
                        <span className="font-medium">
                          {legalCase.lawyer.user.name}
                        </span>
                      </p>
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      legalCase.status,
                    )}`}
                  >
                    {legalCase.status.replace("_", " ")}
                  </span>
                </div>
              </Link>
            ))}

            {cases.length === 0 && (
              <p className="text-gray-500">No cases created yet.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
