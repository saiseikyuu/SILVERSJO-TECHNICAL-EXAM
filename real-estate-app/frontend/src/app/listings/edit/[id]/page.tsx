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
import { z } from "zod";

const ListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(3),
  price: z.coerce.number().min(0),
  property_type: z.enum(["Apartment", "House", "Commercial"]),
  status: z.enum(["For Sale", "For Rent"]),
});

type ListingForm = z.infer<typeof ListingSchema>;

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<ListingForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      const res = await fetch(`http://localhost:4000/api/listings/${id}`);
      const data = await res.json();
      setForm(data);
      setLoading(false);
    }

    fetchListing();
  }, [id]);

  function handleChange<K extends keyof ListingForm>(
    key: K,
    value: ListingForm[K]
  ) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit() {
    if (!form) return;

    const result = ListingSchema.safeParse(form);
    if (!result.success) {
      alert("Validation failed");
      console.error(result.error.format());
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return alert("Missing access token");

    try {
      const res = await fetch(`http://localhost:4000/api/listings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result.data),
      });

      if (res.ok) {
        alert("Listing updated!");
        router.push("/listings");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update listing.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating listing.");
    }
  }

  if (loading || !form) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Listing</h1>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <Label>Location</Label>
          <Input
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

        <div>
          <Label>Price</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Type</Label>
          <Select
            value={form.property_type}
            onValueChange={(val) =>
              handleChange("property_type", val as ListingForm["property_type"])
            }
          >
            <SelectTrigger>{form.property_type}</SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(val) =>
              handleChange("status", val as ListingForm["status"])
            }
          >
            <SelectTrigger>{form.status}</SelectTrigger>
            <SelectContent>
              <SelectItem value="For Sale">For Sale</SelectItem>
              <SelectItem value="For Rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSubmit} className="w-full mt-6">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
