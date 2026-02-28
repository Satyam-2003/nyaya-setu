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
    <>
      {/* Logo Section */}
      <div className="p-6 border-b flex items-center gap-3">
        <Image src="/logo.jpeg" alt="NyayaSetu" width={36} height={36} />
        <span className="text-xl font-bold tracking-tight">NyayaSetu</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              pathname === item.href
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-black"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
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
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-xl border-r">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="NyayaSetu" width={28} height={28} />
          <span className="font-semibold">NyayaSetu</span>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
          ☰
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white shadow-xl flex flex-col">
            <SidebarContent />
          </div>
          <div
            className="flex-1 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10">{children}</main>
    </div>
  );
}
