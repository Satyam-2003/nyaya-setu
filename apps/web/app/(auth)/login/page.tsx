"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import { useAuthStore } from "../../../store/authStore";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      localStorage.removeItem("token");
      document.cookie = `token=${token}; path=/`;

      const me = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAuth(me.data, token);
      console.log(me.data.role);

      if (me.data.role === "client") router.push("/client");
      if (me.data.role === "lawyer") router.push("/lawyer");
      if (me.data.role === "admin") router.push("/admin");
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f6f2] px-4 py-10">
      {/* Soft Background Accent */}
      <div className="absolute w-80 h-80 bg-orange-200/30 blur-3xl rounded-full -top-20 -left-20" />
      <div className="absolute w-80 h-80 bg-orange-300/20 blur-3xl rounded-full -bottom-20 -right-20" />

      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 sm:p-10 border border-orange-100">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.jpeg"
            alt="NyayaSetu Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm">
            Login to continue your legal journey
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="space-y-2 mb-8">
          <label className="text-sm font-medium text-gray-700">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition pr-16"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-orange-600 font-medium hover:text-orange-700 transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98]"
        }`}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Register Link */}
        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-orange-600 font-medium cursor-pointer hover:underline"
          >
            Create Account
          </span>
        </div>
      </div>
    </div>
  );
}
