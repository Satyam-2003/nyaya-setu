"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/analytics/platform").then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Platform Stats</h1>

      <div>Total Users: {stats.totalUsers}</div>
      <div>Total Lawyers: {stats.totalLawyers}</div>
      <div>Total Cases: {stats.totalCases}</div>
      <div>Total Revenue: ₹{stats.totalRevenue}</div>
      <div>Avg Rating: {stats.avgPlatformRating}</div>
    </div>
  );
}
