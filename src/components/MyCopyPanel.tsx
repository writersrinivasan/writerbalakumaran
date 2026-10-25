"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { deleteText, fileToText, getFavorites, getText, makeBook, putText, toggleFavorite, type BookText } from "@/lib/library";

export default function MyCopyPanel({ slug }: { slug: string }) {
  const [book, setBook] = useState<BookText | null | undefined>(undefined);
  const [fav, setFav] = useState(false);
  const [mode, setMode] = useState<"none" | "paste">("none");
  const [paste, setPaste] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getText(slug).then((b) => {
      setBook(b ?? null);
      setFav(getFavorites().includes(slug));
    });
  }, [slug]);

  async function save(text: string, source: string) {
    if (text.trim().length < 20) {
      setErr("உரை மிகக் குறைவாக உள்ளது.");
      return;
    }
    const b = makeBook(slug, text, source);
    await putText(b);
    setBook(b);
    setMode("none");
    setPaste("");
    setErr("");
  }

  async function onFile(f: File) {
    setBusy(true);
    setErr("");
    try {
      await save(await fileToText(f), f.name);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "கோப்பைப் படிக்க முடியவில்லை");
    } finally {
      setBusy(false);
    }
  }

  if (book === undefined) return <div className="h-40 animate-pulse rounded-2xl bg-orange-100/60 dark:bg-white/5" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {book ? (
          <Link
            href={`/read/${slug}`}
            className="rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-8 py-3.5 text-lg font-bold text-white shadow-lg shadow-rose-500/30 transition hover:scale-105"
          >
            📖 வாசிக்கத் தொடங்கு
          </Link>
        ) : null}
        <button
          onClick={() => setFav(toggleFavorite(slug).includes(slug))}
          className={`rounded-full border-2 px-5 py-3 font-bold transition ${
            fav ? "border-rose-500 bg-rose-500 text-white" : "border-line hover:border-rose-400"
          }`}
        >
          {fav ? "♥ விருப்பத்தில்" : "♡ விருப்பம்"}
        </button>
      </div>

      {book ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
          <p className="font-semibold">✓ உங்கள் பிரதி நூலகத்தில் உள்ளது</p>
          <p className="text-sm opacity-80">
            {book.chapters.length} அத்தியாயங்கள் · {Math.round(book.chars / 1000)}k எழுத்துகள் · {book.source}
          </p>
          <div className="mt-3 flex gap-4 text-sm font-semibold">
            <button onClick={() => fileRef.current?.click()} className="underline">மாற்று</button>
            <button
              onClick={async () => {
                if (confirm("இந்தப் பிரதியை நீக்கவா?")) {
                  await deleteText(slug);
                  setBook(null);
                }
              }}
              className="text-rose-700 underline dark:text-rose-300"
            >
              நீக்கு
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/60 p-5 dark:border-orange-900 dark:bg-white/5">
          <p className="font-display text-lg font-bold">உங்கள் பிரதியைச் சேருங்கள்</p>
          <p className="mt-1 text-sm text-muted leading-relaxed">
            நீங்கள் வாங்கிய DRM இல்லாத மின்னூல் (EPUB), TXT / Markdown / HTML கோப்பு, அல்லது நீங்களே தட்டச்சு செய்த உரை.
            இது உங்கள் உலாவியில் மட்டுமே சேமிக்கப்படும்.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-ink px-5 py-2.5 font-semibold text-bg disabled:opacity-50"
            >
              {busy ? "படிக்கிறது…" : "📁 கோப்பைத் தேர்ந்தெடு"}
            </button>
            <button onClick={() => setMode(mode === "paste" ? "none" : "paste")} className="rounded-full border-2 border-ink px-5 py-2.5 font-semibold">
              📋 உரையை ஒட்டு
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".txt,.md,.markdown,.html,.htm,.xhtml,.epub,text/plain"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />

      {mode === "paste" && (
        <div className="rounded-2xl border border-line bg-card p-4">
          <textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            rows={10}
            placeholder={"அத்தியாயம் 1\n\nஉரை இங்கே…\n\nஅத்தியாயம் 2\n\n…"}
            className="w-full resize-y rounded-xl border border-line bg-bg p-3 font-serif leading-loose outline-none focus:border-orange-400"
          />
          <p className="mt-1 text-xs text-muted">“அத்தியாயம் 1”, “# தலைப்பு” போன்ற வரிகள் தானாக அத்தியாயங்களாகப் பிரிக்கப்படும்.</p>
          <button onClick={() => save(paste, "ஒட்டப்பட்டது")} className="mt-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 font-bold text-white">
            சேமி
          </button>
        </div>
      )}

      {err && <p className="rounded-xl bg-rose-100 p-3 text-rose-800 dark:bg-rose-950 dark:text-rose-200">{err}</p>}
    </div>
  );
}
