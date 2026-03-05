"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: string;
  createdAt: string;
}

export default function ClientProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    role: "",
    createdAt: "",
  });
  const [casesCount, setCasesCount] = useState(0);
  const [activeCases, setActiveCases] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const me = await api.get("/auth/me");
      setUser(me.data);

      const caseRes = await api.get("/cases?page=1&limit=50");
      const cases = caseRes.data.data || [];

      setCasesCount(cases.length);
      setActiveCases(
        cases.filter(
          (c: any) => c.status === "assigned" || c.status === "in_progress",
        ).length,
      );
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const updatedData = await api.patch(`/auth/update-profile`, {
        name: user.name,
      });
      setUser(updatedData.data);

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading || !user) {
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
      <div className="min-h-screen p-6 md:p-0 space-y-10">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-orange-50 via-[#fefaf4] to-orange-100 rounded-3xl p-8 shadow-sm border border-orange-100">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile + Stats */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Section - Editable Profile */}
          <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-orange-100 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <input
                  value={user.name || ""}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="mt-1 w-full border border-orange-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  value={user.email}
                  disabled
                  className="mt-1 w-full bg-gray-100 rounded-xl p-3 text-gray-500"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateProfile}
              className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-orange-600 transition"
            >
              Save Changes
            </button>
          </div>

          {/* Right Section - Account Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <h3 className="text-sm text-gray-500">Account Role</h3>
              <p className="text-xl font-semibold text-orange-500 mt-2">
                {user.role}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <h3 className="text-sm text-gray-500">Total Cases</h3>
              <p className="text-2xl font-bold text-orange-500 mt-2">
                {casesCount}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <h3 className="text-sm text-gray-500">Active Cases</h3>
              <p className="text-2xl font-bold text-orange-500 mt-2">
                {activeCases}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
