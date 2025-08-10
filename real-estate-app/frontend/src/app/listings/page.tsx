"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type Listing = {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
};

export default function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;

      const res = await fetch("http://localhost:4000/api/listings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setListings(json.data || []);
      setLoading(false);
    };

    if (user) fetchListings();
  }, [user]);

  if (!user)
    return <p className="text-center mt-10">Please log in to view listings.</p>;
  if (loading) return <p className="text-center mt-10">Loading listings...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Listings</h2>
      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {listings.map((listing) => (
            <li key={listing.id} className="border p-4 rounded shadow-sm">
              <h3 className="font-semibold text-lg">{listing.title}</h3>
              <p className="text-sm text-gray-600">{listing.location}</p>
              <p className="text-sm">₱{listing.price.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Status: {listing.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
