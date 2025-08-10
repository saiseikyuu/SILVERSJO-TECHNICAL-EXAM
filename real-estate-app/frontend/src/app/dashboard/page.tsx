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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New Listing</DialogTitle>
            </DialogHeader>
            <ListingForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
