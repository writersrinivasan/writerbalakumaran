"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORIES, WORKS, type CategoryId } from "@/lib/works";
import { searchKey } from "@/lib/translit";
import { useOwned } from "@/lib/hooks";
import WorkCard from "./WorkCard";

export default function LibraryBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const cat = (params.get("cat") as CategoryId | null) ?? null;
  const [q, setQ] = useState("");
  const [onlyOwned, setOnlyOwned] = useState(false);
  const owned = useOwned();

  const results = useMemo(() => {
    const k = q.trim() ? searchKey(q) : "";
    const raw = q.trim();
    return WORKS.filter(
      (w) =>
        (!cat || w.category === cat) &&
        (!onlyOwned || owned?.has(w.slug)) &&
        (!raw || w.ta.includes(raw) || (k && w.key.includes(k)) || w.en?.toLowerCase().includes(raw.toLowerCase())),
    );
  }, [q, cat, onlyOwned, owned]);

  const setCat = (c: CategoryId | null) => router.replace(c ? `/library?cat=${c}` : "/library", { scroll: false });
  const active = cat ? CATEGORIES.find((c) => c.id === cat) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${
          active?.gradient ?? "from-orange-500 via-rose-500 to-fuchsia-700"
        } p-8 text-white shadow-xl`}
      >
        <div className="kolam absolute inset-0 opacity-40" />
        <div className="relative">
          <p className="text-4xl">{active?.emoji ?? "📚"}</p>
          <h1 className="mt-2 font-display text-4xl font-bold">{active?.ta ?? "முழு நூலகம்"}</h1>
          <p className="mt-1 text-white/85">{active?.blurb ?? "பாலகுமாரனின் அனைத்துப் படைப்புகளும்"}</p>
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-1.5 pl-4 shadow-lg">
            <span className="text-xl">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="தேடுக… (உடையார் / udaiyar / mercury)"
              className="min-w-0 flex-1 bg-transparent py-2 text-lg text-stone-900 outline-none placeholder:text-stone-400"
            />
            {q && (
              <button onClick={() => setQ("")} className="rounded-xl px-3 py-2 text-stone-500 hover:bg-stone-100">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
        <Chip on={!cat} onClick={() => setCat(null)}>
          அனைத்தும் · {WORKS.length}
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} on={cat === c.id} onClick={() => setCat(c.id)}>
            {c.emoji} {c.ta}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">{results.length} படைப்புகள்</p>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={onlyOwned} onChange={(e) => setOnlyOwned(e.target.checked)} className="h-4 w-4 accent-orange-600" />
          என்னிடம் உள்ளவை மட்டும் ({owned?.size ?? 0})
        </label>
      </div>

      {results.length === 0 ? (
        <div className="mt-16 text-center text-muted">
          <p className="text-5xl">🍃</p>
          <p className="mt-3">எதுவும் கிடைக்கவில்லை. வேறு சொல்லில் தேடிப் பாருங்கள்.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map((w) => (
            <WorkCard key={w.slug} work={w} owned={owned?.has(w.slug)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
        on ? "bg-ink text-bg shadow-md" : "border border-line bg-card hover:border-orange-300"
      }`}
    >
      {children}
    </button>
  );
}
