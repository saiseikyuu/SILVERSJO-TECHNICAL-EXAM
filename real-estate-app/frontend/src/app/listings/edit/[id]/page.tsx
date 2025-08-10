"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

type LocationSuggestion = {
  place_name: string;
  coordinates: [number, number];
};

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState<
    "Apartment" | "House" | "Commercial"
  >("Apartment");
  const [status, setStatus] = useState<"For Sale" | "For Rent">("For Sale");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  //  Fetch existing listing
  useEffect(() => {
    async function fetchListing() {
      const res = await fetch(`http://localhost:4000/api/listings/${id}`);
      const data = await res.json();

      setTitle(data.title);
      setDescription(data.description);
      setLocationInput(data.location);
      setSelectedLocation({
        place_name: data.location,
        coordinates: [data.coordinates.lng, data.coordinates.lat],
      });
      setPrice(String(data.price));
      setPropertyType(data.property_type);
      setStatus(data.status);
      setImageUrls(data.images || [""]);
      setLoading(false);
    }

    fetchListing();
  }, [id]);

  // Autocomplete suggestions
  useEffect(() => {
    const delay = setTimeout(() => {
      if (locationInput.length >= 3) {
        fetch(
          `http://localhost:4000/api/autocomplete?q=${encodeURIComponent(
            locationInput
          )}`
        )
          .then((res) => res.json())
          .then((data) => setLocationSuggestions(data))
          .catch(() => setLocationSuggestions([]));
      } else {
        setLocationSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [locationInput]);

  function handleSelectSuggestion(suggestion: LocationSuggestion) {
    setSelectedLocation(suggestion);
    setLocationInput(suggestion.place_name);
    setLocationSuggestions([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Missing access token.");
      setSubmitting(false);
      return;
    }

    if (!selectedLocation) {
      toast.warning("Please select a location from the suggestions.");
      setSubmitting(false);
      return;
    }

    const payload = {
      title,
      description,
      location: selectedLocation.place_name,
      coordinates: {
        lat: selectedLocation.coordinates[1],
        lng: selectedLocation.coordinates[0],
      },
      price: Number(price),
      property_type: propertyType,
      status,
      images: imageUrls.filter((url) => url.trim() !== ""),
    };

    const res = await fetch(`http://localhost:4000/api/listings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Listing updated!");
      router.push("/listings");
    } else {
      const error = await res.json();
      toast.error(error.error || "Failed to update listing.");
    }

    setSubmitting(false);
  }

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto px-4 py-10"
    >
      <h1 className="text-2xl font-bold">Edit Listing</h1>

      {/* Title & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="min-h-[120px]"
        />
      </div>

      {/* Location Autocomplete */}
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={locationInput}
          onChange={(e) => {
            setLocationInput(e.target.value);
            setSelectedLocation(null);
          }}
          placeholder="Start typing a city or address..."
          required
        />
        {locationSuggestions.length > 0 && (
          <ul className="bg-white border rounded shadow mt-2 max-h-60 overflow-auto z-10 relative">
            {locationSuggestions.map((s, i) => (
              <li
                key={i}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(s)}
              >
                {s.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Property Type & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label>Property Type</Label>
          <Select
            value={propertyType}
            onValueChange={(v) => setPropertyType(v as any)}
          >
            <SelectTrigger className="w-full">{propertyType}</SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="w-full">{status}</SelectTrigger>
            <SelectContent>
              <SelectItem value="For Sale">For Sale</SelectItem>
              <SelectItem value="For Rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Image URLs */}
      <div>
        <Label>Image URLs</Label>
        <div className="space-y-2">
          {imageUrls.map((url, i) => (
            <Input
              key={i}
              placeholder={`Image ${i + 1}`}
              value={url}
              onChange={(e) => {
                const updated = [...imageUrls];
                updated[i] = e.target.value;
                setImageUrls(updated);
              }}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setImageUrls([...imageUrls, ""])}
          >
            Add Another Image
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
