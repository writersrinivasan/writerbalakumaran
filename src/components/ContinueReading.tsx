"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLastRead, getProgress, getText } from "@/lib/library";
import { getWork, type Work } from "@/lib/works";
import BookCover from "./BookCover";

export default function ContinueReading() {
  const [state, setState] = useState<{ work: Work; chapter: number; total: number; title: string } | null>(null);

  useEffect(() => {
    const slug = getLastRead();
    const work = slug ? getWork(slug) : undefined;
    if (!slug || !work) return;
    getText(slug).then((t) => {
      if (!t) return;
      const ch = getProgress(slug)?.chapter ?? 0;
      setState({ work, chapter: ch, total: t.chapters.length, title: t.chapters[ch]?.title ?? "" });
    });
  }, []);

  if (!state) return null;
  const pct = Math.round(((state.chapter + 1) / state.total) * 100);

  return (
    <section className="mx-auto -mt-10 max-w-6xl px-4 relative z-10">
      <Link
        href={`/read/${state.work.slug}`}
        className="flex items-center gap-5 rounded-2xl border border-line bg-card p-4 shadow-xl shadow-orange-900/10 transition hover:shadow-2xl"
      >
        <BookCover work={state.work} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-saffron">தொடர்ந்து வாசிக்க</p>
          <h3 className="font-display text-2xl font-bold">{state.work.ta}</h3>
          <p className="text-muted truncate">{state.title}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">
            அத்தியாயம் {state.chapter + 1} / {state.total} · {pct}%
          </p>
        </div>
        <span className="hidden sm:grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-rose-600 text-xl text-white">
          ▶
        </span>
      </Link>
    </section>
  );
}
