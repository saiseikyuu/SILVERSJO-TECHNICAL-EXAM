"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  property_type: string;
  status: string;
  images: string[];
  coordinates?: { lat: number; lng: number };
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function fetchListing() {
      const res = await fetch(`http://localhost:4000/api/listings/${id}`);
      const data = await res.json();
      setListing(data);
      setLoading(false);
    }

    fetchListing();
  }, [id]);

  useEffect(() => {
    if (!listing?.coordinates || !mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [listing.coordinates.lng, listing.coordinates.lat],
      zoom: 14,
    });

    new mapboxgl.Marker({ color: "#3b82f6" })
      .setLngLat([listing.coordinates.lng, listing.coordinates.lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <strong>${listing.title}</strong><br/>
          ${listing.location}
        `)
      )
      .addTo(map);

    return () => map.remove();
  }, [listing]);

  async function handleInquirySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      listing_id: listing?.id,
    };

    const res = await fetch("http://localhost:4000/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Inquiry sent successfully!");
      formRef.current?.reset();
    } else {
      toast.error("Failed to send inquiry. Please try again.");
    }

    setSubmitting(false);
  }

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading listing...</p>
    );
  if (!listing)
    return <p className="text-center mt-10 text-red-500">Listing not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
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
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
          🏠 {listing.property_type}
        </span>
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">
          📌 {listing.status}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
          ID: {listing.id.slice(0, 8)}...
        </span>
      </div>

      {/* Image Gallery */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listing.images?.length > 0 ? (
            listing.images.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-48 object-cover rounded-md border hover:scale-105 transition-transform"
              />
            ))
          ) : (
            <Image
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

      {/* Map Section */}
      {listing.coordinates && (
        <Card className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Location Map</h2>
          <div
            ref={mapRef}
            className="w-full h-[400px] rounded-lg overflow-hidden border"
          />
        </Card>
      )}

      {/* Contact Form */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Contact Agent</h2>
        <form
          ref={formRef}
          onSubmit={handleInquirySubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="name" placeholder="Your Name" required />
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              required
            />
          </div>
          <Textarea
            name="message"
            placeholder="Your Message"
            required
            className="min-h-[120px]"
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
