"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const handleRegister = async () => {
    await api.post("/auth/register", form);
    alert("Registration successfull! Please login to continue.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 sm:p-10 border border-gray-100 transition-all duration-300">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Account ⚖️
            </h1>
            <p className="text-gray-500 text-sm">
              Join NyayaSetu and begin your legal journey
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Register As
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition bg-white"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="client">Client</option>
                <option value="lawyer">Lawyer</option>
              </select>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-md"
            >
              Register
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-black font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
