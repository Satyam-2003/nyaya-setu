"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // 🔁 Auto redirect if already logged in
  useEffect(() => {
    if (user?.role) {
      router.replace(`/${user.role.toLowerCase()}`);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="NyayaSetu Logo"
            width={42}
            height={42}
          />
          <span className="text-xl font-semibold tracking-wide">
            NyayaSetu
          </span>
        </div>

        <div className="space-x-6 hidden md:flex items-center">
          <button
            onClick={() => router.push("/login")}
            className="text-gray-600 hover:text-black transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">

        {/* Decorative Blur */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-200 opacity-20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-200 opacity-20 rounded-full blur-3xl" />

        {/* Left Content */}
        <div className="max-w-xl space-y-6 text-center md:text-left z-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Bridging Justice with{" "}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
              Technology
            </span>{" "}
            ⚖️
          </h1>

          <p className="text-lg text-gray-600">
            A modern legal platform connecting clients with verified lawyers.
            Secure payments, case management, and real-time communication —
            all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => router.push("/register")}
              className="bg-black text-white px-8 py-3 rounded-lg hover:scale-105 transition transform shadow-lg"
            >
              Start Your Case
            </button>

            <button
              onClick={() => router.push("/login")}
              className="border border-black px-8 py-3 rounded-lg hover:bg-black hover:text-white transition"
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Logo */}
        <div className="mt-12 md:mt-0 z-10">
          <Image
            src="/logo.jpeg"
            alt="NyayaSetu Logo"
            width={360}
            height={360}
            className="drop-shadow-2xl"
          />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-6 md:px-16 py-20 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose NyayaSetu?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl shadow-lg hover:shadow-2xl transition bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Verified Lawyers</h3>
            <p className="text-gray-600">
              Connect only with trusted, background-verified professionals.
            </p>
          </div>

          <div className="p-8 rounded-xl shadow-lg hover:shadow-2xl transition bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
            <p className="text-gray-600">
              Transparent and secure payment system powered by Stripe.
            </p>
          </div>

          <div className="p-8 rounded-xl shadow-lg hover:shadow-2xl transition bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Real-Time Chat</h3>
            <p className="text-gray-600">
              Communicate instantly with your lawyer through live messaging.
            </p>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="px-6 md:px-16 py-20 bg-gray-900 text-white">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-4xl font-bold">500+</h3>
            <p className="text-gray-300">Cases Handled</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">200+</h3>
            <p className="text-gray-300">Verified Lawyers</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">98%</h3>
            <p className="text-gray-300">Client Satisfaction</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-8 text-gray-500 text-sm bg-white">
        © {new Date().getFullYear()} NyayaSetu. All rights reserved.
      </footer>
    </div>
  );
}