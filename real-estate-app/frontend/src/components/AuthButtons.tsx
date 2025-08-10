"use client";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function AuthButtons() {
  const { user } = useAuth();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      {user ? (
        <>
          <span className="text-gray-600 hidden sm:inline">
            Welcome, {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}
