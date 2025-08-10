// src/types/listings.ts

export type PropertyType = "Apartment" | "House" | "Commercial";
export type ListingStatus = "For Sale" | "For Rent";

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  property_type: PropertyType;
  status: ListingStatus;
  images: string[];
  coordinates?: Coordinates;
  created_at?: string;
  updated_at?: string;
};
