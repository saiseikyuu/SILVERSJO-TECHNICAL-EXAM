"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import GlobalListingsMap from "@/components/map/GlobalListingsMap";
import Image from "next/image";

type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  property_type: "Apartment" | "House" | "Commercial";
  status: "For Sale" | "For Rent";
  images: string[];
  coordinates?: { lat: number; lng: number };
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const limit = 4;

  const { role } = useAuth();
  const router = useRouter();

  const fetchListings = useCallback(async () => {
    setLoading(true);

    const params = new URLSearchParams({
      q,
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/listings?${params}`
    );

    const data = await res.json();

    setListings(data.data || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [q, type, status, page]);

  function openDeleteModal(id: string) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;

    const token = localStorage.getItem("access_token");
    if (!token) return alert("Missing access token");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/listings/${pendingDeleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setListings((prev) => prev.filter((l) => l.id !== pendingDeleteId));
      } else {
        const error = await res.json();
        console.error("Delete error:", error);
        alert(error.error || "Failed to delete listing.");
      }
    } catch (err) {
      console.error("Delete request failed:", err);
      alert("Error deleting listing.");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  }

  function handleEdit(id: string) {
    router.push(`/listings/edit/${id}`);
  }

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const totalPages = Math.ceil(total / limit);

  function goToPage(pageNum: number) {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white">
        Silversjö Real Estate Listings
      </h1>

      {/* Filters */}
      <section className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Filter Listings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by title or location"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className="w-full">
                {type || "Select type"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="w-full">
                {status || "Select status"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="For Sale">For Sale</SelectItem>
                <SelectItem value="For Rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={() => fetchListings()} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Global Map */}
      {!loading && listings.length > 0 && (
        <section className="rounded-xl overflow-hidden shadow-sm">
          <GlobalListingsMap listings={listings} />
        </section>
      )}

      {/* Listings Grid */}
      <section>
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Loading listings...
          </p>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-500">No listings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="flex flex-col justify-between h-full rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image
                    src={listing.images?.[0] || "/placeholder.jpg"}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-start space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {listing.location}
                  </p>
                  <p className="text-base font-medium text-gray-800 dark:text-white">
                    ₱{listing.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {listing.property_type} · {listing.status}
                  </p>
                </div>

                <div className="px-4 pb-4 pt-2 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-sm"
                    onClick={() => router.push(`/listings/${listing.id}`)}
                  >
                    View Details
                  </Button>

                  {role === "admin" && (
                    <>
                      <Button
                        variant="secondary"
                        className="flex-1 text-sm"
                        onClick={() => handleEdit(listing.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 text-sm"
                        onClick={() => openDeleteModal(listing.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages >= 1 && (
        <section className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </Button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                onClick={() => goToPage(pageNum)}
                className="w-10 h-10 p-0 text-sm"
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </p>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
