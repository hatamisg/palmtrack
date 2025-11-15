"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palmtree, LayoutDashboard, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/kebun",
      label: "Kebun Saya",
      icon: MapPin,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Palmtree className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                PalmTrack
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "text-primary bg-green-50"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center">
            <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">
              <User className="h-5 w-5" />
              <span className="hidden sm:block">Admin</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-primary bg-green-50"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
