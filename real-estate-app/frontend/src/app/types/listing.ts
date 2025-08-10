export type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  property_type: "Apartment" | "House" | "Commercial";
  status: "For Sale" | "For Rent";
  images: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
};
