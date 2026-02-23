"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import { useAuthStore } from "../../../store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      document.cookie = `token=${token}; path=/`

      const me = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User role:", me.data.role)

      setAuth(me.data, token);

      if (me.data.role === "client") router.push("/client");
      if (me.data.role === "lawyer") router.push("/lawyer");
      if (me.data.role === "admin") router.push("/admin");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Login to NyayaSetu</h1>

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 rounded-lg"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
