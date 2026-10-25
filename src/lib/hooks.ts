"use client";

import { useEffect, useState } from "react";
import { getFavorites, listSlugs } from "./library";

/** Slugs of works that have text in the personal library. null while loading. */
export function useOwned() {
  const [owned, setOwned] = useState<Set<string> | null>(null);
  useEffect(() => {
    listSlugs()
      .then((s) => setOwned(new Set(s)))
      .catch(() => setOwned(new Set()));
  }, []);
  return owned;
}

export function useFavorites() {
  const [fav, setFav] = useState<string[]>([]);
  useEffect(() => {
    Promise.resolve().then(() => setFav(getFavorites()));
  }, []);
  return [fav, setFav] as const;
}
