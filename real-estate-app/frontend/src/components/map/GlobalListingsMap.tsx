"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Listing } from "@/app/types/listing";

type Props = {
  listings: Listing[];
};

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function GlobalListingsMap({ listings }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [121.0437, 14.676], // Default center: Metro Manila
      zoom: 10,
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.on("load", () => setMapLoaded(true));

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const bounds = new mapboxgl.LngLatBounds();

    listings.forEach((listing) => {
      const coords = listing.coordinates;
      if (!coords) return;

      const marker = new mapboxgl.Marker({ color: "#3b82f6" })
        .setLngLat([coords.lng, coords.lat])
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

      bounds.extend([coords.lng, coords.lat]);
    });

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }, [listings, mapLoaded]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
