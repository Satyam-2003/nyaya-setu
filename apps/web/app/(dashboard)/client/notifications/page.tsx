"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    api.get("/notifications").then((res) => {
      setNotifications(res.data.data);
    });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>

      {notifications.map((n) => (
        <div key={n.id} className="border p-3 mb-2">
          <h3>{n.title}</h3>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
