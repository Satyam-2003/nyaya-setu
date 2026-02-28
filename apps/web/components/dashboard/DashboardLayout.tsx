"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  let navItems: { name: string; href: string }[] = [];

  if (user?.role === "client") {
    navItems = [
      { name: "Dashboard", href: "/client" },
      { name: "My Cases", href: "/client/cases" },
      { name: "Notifications", href: "/client/notifications" },
      { name: "Profile", href: "/client/profile" },
    ];
  }

  if (user?.role === "lawyer") {
    navItems = [
      { name: "Dashboard", href: "/lawyer" },
      { name: "Assigned Cases", href: "/lawyer/cases" },
      { name: "Profile", href: "/lawyer/profile" },
    ];
  }

  if (user?.role === "admin") {
    navItems = [
      { name: "Dashboard", href: "/admin" },
      { name: "Analytics", href: "/admin/analytics" },
      { name: "Users", href: "/admin/users" },
    ];
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="relative px-6 py-7 border-b border-orange-100 bg-gradient-to-br from-orange-50/60 via-white to-white">
        {/* Accent Line */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-300 rounded-r-full" />

        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="w-11 h-11 rounded-xl bg-white shadow-md flex items-center justify-center border border-orange-100">
            <Image
              src="/logo.jpeg"
              alt="NyayaSetu"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>

          {/* Brand Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Nyaya Setu
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-orange-100">
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-200 shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f6f2]">
      {/* Desktop Sidebar - FIXED */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white shadow-xl border-r border-orange-100">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between px-4 py-3 border-b border-orange-100">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpeg" alt="NyayaSetu" width={28} height={28} />
          <span className="font-semibold text-gray-900">NyayaSetu</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 text-xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white shadow-xl h-full">
            <SidebarContent />
          </div>
          <div
            className="flex-1 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}

      {/* Main Content - ONLY THIS SCROLLS */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
