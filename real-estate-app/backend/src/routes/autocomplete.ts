import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

type MapboxFeature = {
  place_name: string;
  center: [number, number]; // [lng, lat]
};

type MapboxResponse = {
  features: MapboxFeature[];
};

router.get("/", async (req, res) => {
  const query = req.query.q as string;
  if (!query || query.length < 3) {
    return res.status(400).json({ error: "Query too short" });
  }

  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "Missing Mapbox token" });
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${token}&autocomplete=true&limit=5&country=PH`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Mapbox API error:", response.statusText);
      return res.status(502).json({ error: "Mapbox API failed" });
    }

    const raw = await response.json();

    // Runtime validation
    if (
      !raw ||
      typeof raw !== "object" ||
      !Array.isArray((raw as any).features)
    ) {
      return res.status(502).json({ error: "Invalid Mapbox response" });
    }

    const data: MapboxResponse = {
      features: (raw as any).features.map((f: any) => ({
        place_name: f.place_name,
        center: f.center,
      })),
    };

    const suggestions = data.features.map((f) => ({
      place_name: f.place_name,
      coordinates: f.center, // [lng, lat]
    }));

    res.json(suggestions);
  } catch (err) {
    console.error("Autocomplete error:", err);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

export default router;
