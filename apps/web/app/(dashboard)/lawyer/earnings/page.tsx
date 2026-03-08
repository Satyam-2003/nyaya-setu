"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import api from "../../../../lib/axios";

export default function LawyerEarningsPage() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    api.get("/payments?page=1&limit=20").then((res) => {
      setPayments(res.data.data || []);
    });
  }, []);

  const totalEarnings = payments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  const completedPayments = payments.filter(
    (p) => p.status === "completed"
  );

  const pendingPayments = payments.filter(
    (p) => p.status === "pending"
  );

  return (
    <DashboardLayout>
      <div className="space-y-10">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl 
                        bg-gradient-to-r from-orange-50 via-[#fefaf4] to-orange-100 
                        px-6 py-8 md:px-10 md:py-12 
                        shadow-sm border border-orange-100">

          <div className="absolute -top-12 -right-12 w-40 h-40 
                          bg-orange-200/40 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800">
              Earnings
            </h1>

            <p className="text-gray-600 mt-2">
              Track your income from completed legal cases.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <h3 className="text-gray-500 text-sm">Total Earnings</h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{totalEarnings}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <h3 className="text-gray-500 text-sm">Payments Received</h3>
            <p className="text-2xl font-bold text-orange-600">
              {completedPayments.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <h3 className="text-gray-500 text-sm">Pending Payments</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingPayments.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <h3 className="text-gray-500 text-sm">Total Transactions</h3>
            <p className="text-2xl font-bold">
              {payments.length}
            </p>
          </div>

        </div>

        {/* Payment History */}
        <div className="bg-white border border-orange-100 rounded-3xl shadow-lg p-8">

          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Payment History
          </h2>

          {payments.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No payment records yet.
            </div>
          )}

          <div className="space-y-4">

            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col md:flex-row md:items-center 
                           md:justify-between gap-4 
                           border rounded-xl p-5 
                           hover:shadow-md transition bg-[#faf9f6]"
              >

                <div>
                  <p className="font-semibold text-gray-800">
                    {payment.case?.title || "Case Payment"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {payment.client?.name || "Client"}
                  </p>
                </div>

                <div className="flex items-center gap-4">

                  <span className="font-semibold text-green-600">
                    ₹{payment.amount}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      payment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>

                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}