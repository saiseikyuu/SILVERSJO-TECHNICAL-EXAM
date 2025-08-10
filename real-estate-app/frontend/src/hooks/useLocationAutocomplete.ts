import { useEffect, useState } from "react";

export type LocationSuggestion = {
  place_name: string;
  coordinates: [number, number]; // [lng, lat]
};

export function useLocationAutocomplete(query: string) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length >= 3) {
        fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then(setSuggestions)
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return suggestions;
}
