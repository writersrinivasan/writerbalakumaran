"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WorkCard from "@/components/WorkCard";
import { allTexts, getProgress, putText, type BookText } from "@/lib/library";
import { useFavorites, useOwned } from "@/lib/hooks";
import { getWork, WORKS } from "@/lib/works";

export default function MyShelf() {
  const owned = useOwned();
  const [fav] = useFavorites();
  const [msg, setMsg] = useState("");
  const [progress, setProg] = useState<Record<string, number>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const ownedWorks = WORKS.filter((w) => owned?.has(w.slug));
  const favWorks = fav.map(getWork).filter((w) => !!w);

  useEffect(() => {
    allTexts().then((ts) => {
      const p: Record<string, number> = {};
      for (const t of ts) {
        const pr = getProgress(t.slug);
        if (pr) p[t.slug] = Math.round(((pr.chapter + pr.scroll) / t.chapters.length) * 100);
      }
      setProg(p);
    });
  }, [owned]);

  async function exportAll() {
    const data = await allTexts();
    const blob = new Blob([JSON.stringify({ app: "balakumaran-library", v: 1, books: data })], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `balakumaran-library-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importBackup(f: File) {
    try {
      const data = JSON.parse(await f.text()) as { app?: string; books?: BookText[] };
      if (data.app !== "balakumaran-library" || !Array.isArray(data.books)) throw new Error();
      for (const b of data.books) if (getWork(b.slug)) await putText(b);
      setMsg(`${data.books.length} நூல்கள் மீட்டெடுக்கப்பட்டன. பக்கத்தைப் புதுப்பிக்கிறது…`);
      setTimeout(() => location.reload(), 900);
    } catch {
      setMsg("இது சரியான காப்புப் பிரதிக் கோப்பு அல்ல.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">
        என் <span className="text-gradient">அலமாரி</span>
      </h1>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold">📖 வாசிக்கக் கூடியவை ({ownedWorks.length})</h2>
        {owned && ownedWorks.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-orange-300 p-8 text-center dark:border-orange-900">
            <p className="text-muted">இன்னும் எந்த நூலும் சேர்க்கப்படவில்லை.</p>
            <Link href="/import" className="mt-4 inline-block rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 font-bold text-white">
              நூல் சேர் →
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {ownedWorks.map((w) => (
              <div key={w.slug}>
                <WorkCard work={w} owned />
                {progress[w.slug] != null && (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-orange-100 dark:bg-white/10">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-rose-500" style={{ width: `${progress[w.slug]}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">♥ விருப்பமானவை ({favWorks.length})</h2>
        {favWorks.length === 0 ? (
          <p className="mt-3 text-muted">நூல் பக்கத்தில் “♡ விருப்பம்” அழுத்தி இங்கே சேர்க்கலாம்.</p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {favWorks.map((w) => (
              <WorkCard key={w.slug} work={w} owned={owned?.has(w.slug)} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 rounded-3xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 p-8 text-white">
        <h2 className="font-display text-2xl font-bold">💾 காப்புப் பிரதி</h2>
        <p className="mt-1 text-white/85">உங்கள் நூல்கள் இந்த உலாவியில் மட்டுமே உள்ளன. வேறு கணினிக்கு மாற்ற அல்லது பாதுகாக்க ஏற்றுமதி செய்யுங்கள்.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={exportAll} className="rounded-full bg-white px-6 py-3 font-bold text-indigo-700">
            ஏற்றுமதி செய்
          </button>
          <button onClick={() => fileRef.current?.click()} className="rounded-full border-2 border-white px-6 py-3 font-bold">
            மீட்டெடு
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importBackup(f);
              e.target.value = "";
            }}
          />
        </div>
        {msg && <p className="mt-4 font-semibold">{msg}</p>}
      </section>
    </div>
  );
}
