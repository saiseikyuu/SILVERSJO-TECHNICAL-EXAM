"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  property_type: string;
  status: string;
  images: string[];
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      const res = await fetch(`http://localhost:4000/api/listings/${id}`);
      const data = await res.json();
      setListing(data);
      setLoading(false);
    }

    fetchListing();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!listing) return <p className="text-center mt-10">Listing not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title & Price */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <p className="text-muted-foreground">{listing.location}</p>
        <p className="text-2xl font-semibold text-primary">
          ₱{listing.price.toLocaleString()}
        </p>
      </div>

      {/* Metadata Badges */}
      <div className="flex flex-wrap justify-center gap-3 text-sm">
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          {listing.property_type}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          {listing.status}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          ID: {listing.id.slice(0, 8)}...
        </span>
      </div>

      {/* Image Gallery */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listing.images?.length > 0 ? (
            listing.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-48 object-cover rounded-md border"
              />
            ))
          ) : (
            <img
              src="/placeholder.jpg"
              alt="Placeholder"
              className="w-full h-48 object-cover rounded-md border"
            />
          )}
        </div>
      </Card>

      {/* Description */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
      </Card>
    </div>
  );
}
