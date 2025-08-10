"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { role } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    router.push("/login");
  }

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-xl font-bold cursor-pointer text-gray-900"
          onClick={() => router.push("/dashboard")}
        >
          Silversjö Real Estate
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/listings")}>
            Browse Listings
          </Button>

          {role === "admin" && (
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Manage Listings
            </Button>
          )}

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              setOpen(false);
              router.push("/listings");
            }}
          >
            Browse Listings
          </Button>

          {role === "admin" && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setOpen(false);
                router.push("/dashboard");
              }}
            >
              Manage Listings
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
          >
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
