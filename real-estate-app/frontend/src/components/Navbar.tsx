"use client";

import Link from "next/link";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <header className="border-b py-4">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
        <nav className="flex gap-4 text-sm sm:text-base">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/listings" className="hover:underline">
            Listings
          </Link>
        </nav>
        <AuthButtons />
      </div>
    </header>
  );
}
