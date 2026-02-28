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
    <div className="max-h-screen flex items-center justify-center bg-[#f8f6f2] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 border border-orange-100 transition-all duration-300">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.jpeg"
              alt="NyayaSetu"
              className="h-14 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Your Account
            </h1>
            <p className="text-gray-500 text-sm">
              Start your legal journey with confidence
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Register As
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-white"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="client">Client</option>
                <option value="lawyer">Lawyer</option>
              </select>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] transition-all duration-200 shadow-lg"
            >
              Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-orange-600 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
