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
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6 max-w-xl">
        <h1 className="text-2xl font-bold">Lawyer Profile</h1>

        <input
          className="w-full border p-3 rounded-lg"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          placeholder="Specialization"
        />

        <input
          type="number"
          className="w-full border p-3 rounded-lg"
          value={experienceYears}
          onChange={(e) => setExperienceYears(Number(e.target.value))}
          placeholder="Experience Years"
        />

        <input
          className="w-full border p-3 rounded-lg"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />

        <button
          onClick={handleUpdate}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
