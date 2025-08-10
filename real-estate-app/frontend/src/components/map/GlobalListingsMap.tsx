"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Listing = {
  id: string;
  title: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

type Props = {
  listings: Listing[];
};

export default function GlobalListingsMap({ listings }: Props) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [121.0437, 14.4964], // Default center (Metro Manila)
      zoom: 11,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    // Fit bounds to all listings
    const bounds = new mapboxgl.LngLatBounds();
    listings.forEach((listing) => {
      const { lat, lng } = listing.coordinates;
      bounds.extend([lng, lat]);

      const marker = new mapboxgl.Marker({ color: "#3b82f6" })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="font-size: 14px; line-height: 1.4;">
              <strong>
                <a href="/listings/${listing.id}" target="_blank" style="color:#2563eb; text-decoration:underline;">
                  ${listing.title}
                </a>
              </strong><br/>
              ${listing.location}
            </div>
          `)
        )
        .addTo(mapRef.current!);
    });

    mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 14 });

    return () => {
      mapRef.current?.remove();
    };
  }, [listings]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
