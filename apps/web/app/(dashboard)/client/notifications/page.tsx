"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications?page=1&limit=20");
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Notification error", err);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  if (loading) {
    return (
      <div className="p-6 text-orange-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen p-6 md:p-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Notifications
        </h1>

        {/* Badge */}
        <div className="flex items-center gap-3">
          <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-medium">
            {unreadCount} Unread
          </span>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-orange-100">
            <p className="text-gray-500">
              You're all caught up 🎉
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl p-5 shadow-sm border transition
              ${
                n.isRead
                  ? "bg-white border-orange-100"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {n.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    {n.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition w-fit"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}