"use client";

import Link from "next/link";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center mb-6">
      <nav className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/listings">Listings</Link>
      </nav>
      <AuthButtons />
    </header>
  );
}
