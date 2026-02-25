"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="p-6 text-xl font-bold border-b">NyayaSetu</div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-3 rounded-lg transition ${
                pathname === item.href
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
