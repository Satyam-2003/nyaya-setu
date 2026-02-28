"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "../../../../../components/dashboard/DashboardLayout";
import api from "../../../../../lib/axios";
import { connectSocket } from "../../../../../lib/socket";
import { CaseType } from "../../../../../types/case.types";

export default function CaseDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [caseData, setCaseData] = useState<CaseType | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchCase();
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    const s = connectSocket(token);

    s.on("connect", () => {
      console.log("Socket connected");
      s.emit("joinRoom", id);
    });

    s.on("newMessage", (msg: any) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    s.on("connect_error", (err) => {
      console.log("Socket error:", err);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [id]);

  const fetchCase = async () => {
    const res = await api.get(`/cases/${id}`);
    setCaseData(res.data);
  };

  const handleSendMessage = () => {
    if (!newMessage || !socket) return;

    const tempMessage = {
      message: newMessage,
      temp: true,
    };
    setMessages((prev) => [...prev, tempMessage]);
    socket.emit("sendMessage", {
      caseId: id,
      message: newMessage,
    });

    setNewMessage("");
  };

  const handlePayment = async () => {
    const res = await api.post("/payments/create", {
      caseId: id,
      amount: 1000,
    });

    window.location.href = res.data.checkoutUrl;
  };

  const handleRating = async () => {
    await api.post("/ratings", {
      caseId: id,
      rating,
      review,
    });

    alert("Rating submitted!");
  };

  const statusBadge = (status: string) => {
    const colors: any = {
      open: "bg-yellow-100 text-yellow-700",
      assigned: "bg-blue-100 text-blue-700",
      in_progress: "bg-purple-100 text-purple-700",
      closed: "bg-green-100 text-green-700",
    };

    return colors[status] || "bg-gray-100";
  };

  if (!caseData) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Case Info Card */}
        <div className="bg-white border border-orange-100 rounded-3xl shadow-lg p-8 transition hover:shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {caseData.title}
            </h1>

            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusBadge(
                caseData.status,
              )}`}
            >
              {caseData.status.replace("_", " ")}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {caseData.description}
          </p>

          <div className="mt-4 text-sm text-gray-500">
            Category: <span className="text-gray-700">{caseData.category}</span>
          </div>

          {caseData.lawyer && (
            <div className="mt-2 text-sm">
              Assigned Lawyer:{" "}
              <span className="font-medium text-gray-900">
                {caseData.lawyer.user.name}
              </span>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="bg-white border border-orange-100 rounded-3xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Case Chat
          </h2>

          <div className="h-72 overflow-y-auto bg-[#faf9f6] rounded-2xl p-5 space-y-3 border border-gray-200">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm">
                No messages yet. Start the conversation.
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className="bg-white px-4 py-2 rounded-xl shadow-sm text-sm animate-fadeIn"
              >
                {msg.message}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <input
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              placeholder="Type message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            <button
              onClick={handleSendMessage}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:from-orange-600 hover:to-orange-700 active:scale-[0.97] transition-all"
            >
              Send
            </button>
          </div>
        </div>

        {/* Payment Section */}
        {caseData.status === "assigned" && (
          <div className="bg-white border border-orange-100 rounded-3xl shadow-lg p-8 transition hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Complete Payment
            </h2>

            <p className="text-gray-600 mb-6">
              Secure your legal assistance by completing the payment.
            </p>

            <button
              onClick={handlePayment}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-700 active:scale-[0.97] transition-all"
            >
              Pay ₹1000
            </button>
          </div>
        )}

        {/* Rating Section */}
        {caseData.status === "closed" && (
          <div className="bg-white border border-orange-100 rounded-3xl shadow-lg p-8 space-y-6 transition hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Rate Your Lawyer
            </h2>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform duration-200 hover:scale-110 ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              placeholder="Write review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <button
              onClick={handleRating}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:from-orange-600 hover:to-orange-700 active:scale-[0.97] transition-all"
            >
              Submit Rating
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
