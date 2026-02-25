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
      <div className="space-y-8">
        {/* Case Info */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{caseData.title}</h1>

            <span
              className={`px-3 py-1 rounded-full text-sm ${statusBadge(
                caseData.status,
              )}`}
            >
              {caseData.status.replace("_", " ")}
            </span>
          </div>

          <p className="text-gray-600">{caseData.description}</p>

          <p className="text-sm text-gray-500">Category: {caseData.category}</p>

          {caseData.lawyer && (
            <p className="text-sm">
              Assigned Lawyer:{" "}
              <span className="font-medium">{caseData.lawyer.user.name}</span>
            </p>
          )}
        </div>

        {/* Chat Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Case Chat</h2>

          <div className="h-64 overflow-y-auto border p-4 rounded-lg space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className="bg-white p-2 rounded shadow-sm text-sm">
                {msg.message}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              className="flex-1 border p-2 rounded-lg"
              placeholder="Type message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="bg-black text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>

        {/* Payment Section */}
        {caseData.status === "assigned" && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-3">Complete Payment</h2>
            <button
              onClick={handlePayment}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Pay ₹1000
            </button>
          </div>
        )}

        {/* Rating Section */}
        {caseData.status === "closed" && (
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <h2 className="text-lg font-semibold">Rate Your Lawyer</h2>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="Write review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <button
              onClick={handleRating}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Submit Rating
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
