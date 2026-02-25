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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">

      {/* Glow Effects */}
      <div className="absolute w-72 h-72 bg-yellow-200 opacity-20 blur-3xl rounded-full -top-20 -left-20" />
      <div className="absolute w-72 h-72 bg-blue-200 opacity-20 blur-3xl rounded-full -bottom-20 -right-20" />

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl space-y-6">

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.jpeg"
            alt="NyayaSetu Logo"
            width={60}
            height={60}
          />
        </div>

        <h1 className="text-3xl font-bold text-center">
          Welcome Back ⚖️
        </h1>

        <p className="text-center text-gray-600 text-sm">
          Login to continue your legal journey
        </p>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition pr-12"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Eye Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white transition transform shadow-lg flex items-center justify-center gap-2
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:scale-[1.02] hover:bg-gray-800"}
          `}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register Link */}
        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
}