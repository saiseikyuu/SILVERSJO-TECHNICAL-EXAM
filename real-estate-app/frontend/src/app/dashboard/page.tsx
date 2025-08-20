"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ListingForm from "@/components/listings/ListingForm";

export default function DashboardPage() {
  const { role, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="p-6 space-y-4 text-center">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p>
          {role === "admin"
            ? " Welcome, Admin! You have full access."
            : " Welcome, User! You can browse listings."}
        </p>
      </Card>

      {role === "admin" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">+ Add Listing</Button>
          </DialogTrigger>
          <DialogContent
            className="
              sm:max-w-xl
              w-full
              sm:rounded-2xl
              p-0
              overflow-hidden
            "
          >
            {/* ✅ Fixed Header Layout */}
            <DialogHeader className="sticky top-0 z-10 flex flex-row items-center justify-between bg-white p-4 border-b">
              <DialogTitle className="text-lg sm:text-xl font-semibold">
                Create New Listing
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </DialogHeader>

            {/* Scrollable content */}
            <div className="max-h-[80vh] sm:max-h-[70vh] overflow-y-auto px-4 sm:px-6 pb-6">
              <ListingForm onSuccess={() => setOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
