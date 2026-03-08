"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import api from "../../../../lib/axios";

export default function LawyerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [location, setLocation] = useState("");

  useEffect(() => {
    api.get("/lawyers").then((res) => {
      if (res.data.data.length) {
        const lawyer = res.data.data[0];
        setProfile(lawyer);
        setSpecialization(lawyer.specialization);
        setExperienceYears(lawyer.experienceYears);
        setLocation(lawyer.location);
      }
    });
  }, []);

  const handleUpdate = async () => {
    await api.patch("/lawyers", {
      specialization,
      experienceYears,
      location,
    });

    alert("Profile Updated");
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div
          className="relative overflow-hidden rounded-3xl 
          bg-gradient-to-r from-orange-50 via-[#fefaf4] to-orange-100
          px-6 py-8 md:px-10 md:py-12
          border border-orange-100 shadow-sm"
        >
          <div
            className="absolute -top-12 -right-12 w-40 h-40 
            bg-orange-200/40 rounded-full blur-3xl"
          ></div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-800">Lawyer Profile</h1>

            <p className="text-gray-600 mt-2">
              Manage your professional information and keep your profile
              updated.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-orange-100 rounded-3xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Avatar */}
            <div className="flex flex-col items-center md:w-1/4">
              <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-600">
                {profile?.user?.name?.charAt(0) || "L"}
              </div>

              <p className="mt-4 font-semibold text-gray-800">
                {profile?.user?.name || "Lawyer"}
              </p>

              <p className="text-sm text-gray-500">{profile?.user?.email}</p>
            </div>

            {/* Profile Form */}
            <div className="flex-1 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">
                    Specialization
                  </label>

                  <input
                    className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Criminal Law"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Experience (Years)
                  </label>

                  <input
                    type="number"
                    className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    placeholder="Years of experience"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">Location</label>

                  <input
                    className="mt-1 w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  onClick={handleUpdate}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:from-orange-600 hover:to-orange-700 active:scale-[0.97] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
