"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { role } = useAuth();
  const router = useRouter();

  return (
    <nav className="w-full px-4 py-3 border-b flex justify-between items-center bg-white">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        Silversjö Real Estate
      </h1>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => router.push("/listings")}>
          Browse Listings
        </Button>

        {role === "admin" && (
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            Manage Listings
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_role");
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
