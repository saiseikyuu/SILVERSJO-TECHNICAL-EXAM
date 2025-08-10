"use client";

import Link from "next/link";
import AuthButtons from "./AuthButtons";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b py-4  shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between ">
        {/* Logo or title */}
        <Link href="/" className="text-lg font-bold">
          🏠 RealEstate
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-6 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/listings" className="hover:underline">
            Listings
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden sm:block">
          <AuthButtons />
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-4 space-y-2 border-t">
          <Link href="/" className="block hover:underline">
            Home
          </Link>
          <Link href="/listings" className="block hover:underline">
            Listings
          </Link>
          <AuthButtons />
        </div>
      )}
    </header>
  );
}
