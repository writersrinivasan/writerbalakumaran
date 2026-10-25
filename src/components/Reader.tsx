"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getPrefs, getProgress, getText, setPrefs, setProgress, type BookText, type ReaderPrefs } from "@/lib/library";
import { READER_FONTS } from "@/lib/readerFonts";
import type { Work } from "@/lib/works";

const THEMES: Record<ReaderPrefs["theme"], { label: string; bg: string; ink: string; muted: string; accent: string; bar: string }> = {
  paper: { label: "வெண்மை", bg: "#fffdf8", ink: "#1f1712", muted: "#8a7466", accent: "#c2410c", bar: "rgba(255,253,248,.92)" },
  sepia: { label: "செபியா", bg: "#f4e6cc", ink: "#3b2a1a", muted: "#85694d", accent: "#9a3412", bar: "rgba(244,230,204,.92)" },
  lotus: { label: "தாமரை", bg: "#fdf0f3", ink: "#3a1420", muted: "#94606f", accent: "#be185d", bar: "rgba(253,240,243,.92)" },
  night: { label: "இரவு", bg: "#14100d", ink: "#e9dccd", muted: "#9a8676", accent: "#fb923c", bar: "rgba(20,16,13,.92)" },
};

export default function Reader({ work }: { work: Work }) {
  const [book, setBook] = useState<BookText | null | undefined>(undefined);
  const [chapter, setChapter] = useState(0);
  const [prefs, setP] = useState<ReaderPrefs | null>(null);
  const [panel, setPanel] = useState<"none" | "toc" | "settings">("none");
  const [barsVisible, setBarsVisible] = useState(true);
  const [scrollPct, setScrollPct] = useState(0);
  const restoring = useRef<number | null>(null);

  useEffect(() => {
    getText(work.slug).then((b) => {
      setP(getPrefs());
      setBook(b ?? null);
      const p = getProgress(work.slug);
      if (b && p && p.chapter < b.chapters.length) {
        setChapter(p.chapter);
        restoring.current = p.scroll;
      }
    });
  }, [work.slug]);

  // Restore scroll after the chapter renders, otherwise start at top.
  useEffect(() => {
    if (!book) return;
    const y = restoring.current;
    restoring.current = null;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      window.scrollTo({ top: y != null ? y * max : 0 });
    });
  }, [book, chapter]);

  // Save progress while scrolling, hide bars when reading downward.
  useEffect(() => {
    if (!book) return;
    let last = scrollY;
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const pct = Math.min(1, scrollY / max);
      setScrollPct(pct);
      if (Math.abs(scrollY - last) > 12) {
        setBarsVisible(scrollY < last || scrollY < 80);
        last = scrollY;
      }
      clearTimeout(t);
      t = setTimeout(() => setProgress(work.slug, { chapter, scroll: pct, at: Date.now() }), 300);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [book, chapter, work.slug]);

  const go = useCallback(
    (i: number) => {
      if (!book || i < 0 || i >= book.chapters.length) return;
      setChapter(i);
      setProgress(work.slug, { chapter: i, scroll: 0, at: Date.now() });
      setPanel("none");
      setBarsVisible(true);
    },
    [book, work.slug],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowRight") go(chapter + 1);
      if (e.key === "ArrowLeft") go(chapter - 1);
      if (e.key === "Escape") setPanel("none");
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [chapter, go]);

  const update = (p: Partial<ReaderPrefs>) => {
    if (!prefs) return;
    const next = { ...prefs, ...p };
    setP(next);
    setPrefs(next);
  };

  if (book === undefined || !prefs) return <div className="min-h-screen" />;

  if (book === null) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <p className="text-6xl">📖</p>
          <h1 className="mt-4 font-display text-3xl font-bold">{work.ta}</h1>
          <p className="mt-2 text-muted">இந்த நூலின் உரை இன்னும் உங்கள் நூலகத்தில் இல்லை.</p>
          <Link href={`/work/${work.slug}`} className="mt-6 inline-block rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 font-bold text-white">
            உங்கள் பிரதியைச் சேருங்கள் →
          </Link>
        </div>
      </div>
    );
  }

  const theme = THEMES[prefs.theme];
  const font = READER_FONTS.find((f) => f.id === prefs.font) ?? READER_FONTS[0];
  const ch = book.chapters[chapter];
  const total = book.chapters.length;
  const overall = ((chapter + scrollPct) / total) * 100;

  return (
    <div
      style={{ background: theme.bg, color: theme.ink, ["--accent" as string]: theme.accent }}
      className="min-h-screen transition-colors duration-300"
    >
      {/* overall progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-1" style={{ background: theme.muted + "33" }}>
        <div className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 transition-[width]" style={{ width: `${overall}%` }} />
      </div>

      {/* top bar */}
      <header
        style={{ background: theme.bar, borderColor: theme.muted + "33" }}
        className={`fixed inset-x-0 top-1 z-40 border-b backdrop-blur-xl transition-transform duration-300 ${
          barsVisible || panel !== "none" ? "" : "-translate-y-[120%]"
        }`}
      >
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-3 py-2.5">
          <Link href={`/work/${work.slug}`} className="rounded-full px-3 py-1.5 text-lg hover:bg-black/5" aria-label="பின் செல்">
            ←
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate font-display font-bold leading-tight">{work.ta}</p>
            <p className="truncate text-xs" style={{ color: theme.muted }}>
              {ch.title}
            </p>
          </div>
          <IconBtn on={panel === "toc"} onClick={() => setPanel(panel === "toc" ? "none" : "toc")} label="அத்தியாயங்கள்">☰</IconBtn>
          <IconBtn on={panel === "settings"} onClick={() => setPanel(panel === "settings" ? "none" : "settings")} label="அமைப்புகள்">
            அ<span className="text-[0.7em]">அ</span>
          </IconBtn>
        </div>
      </header>

      {/* panels */}
      {panel !== "none" && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30" onClick={() => setPanel("none")} />
          <div
            style={{ background: theme.bg, color: theme.ink, borderColor: theme.muted + "33" }}
            className="fixed inset-x-0 top-[60px] z-40 mx-auto max-h-[75vh] max-w-md overflow-y-auto rounded-b-3xl border p-5 shadow-2xl sm:right-4 sm:left-auto sm:rounded-3xl"
          >
            {panel === "toc" ? (
              <>
                <h2 className="mb-3 font-display text-xl font-bold">அத்தியாயங்கள் · {total}</h2>
                <ol className="space-y-1">
                  {book.chapters.map((c, i) => (
                    <li key={i}>
                      <button
                        onClick={() => go(i)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-black/5"
                        style={i === chapter ? { background: theme.accent + "22", color: theme.accent, fontWeight: 700 } : undefined}
                      >
                        <span className="w-7 text-right text-sm opacity-60">{i + 1}</span>
                        <span className="truncate">{c.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-bold" style={{ color: theme.muted }}>பின்னணி</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(THEMES) as ReaderPrefs["theme"][]).map((k) => (
                      <button
                        key={k}
                        onClick={() => update({ theme: k })}
                        style={{ background: THEMES[k].bg, color: THEMES[k].ink, outlineColor: theme.accent }}
                        className={`rounded-xl border border-black/10 py-3 text-sm font-semibold ${prefs.theme === k ? "outline outline-2" : ""}`}
                      >
                        {THEMES[k].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-bold" style={{ color: theme.muted }}>எழுத்துரு</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {READER_FONTS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => update({ font: f.id })}
                        style={{ fontFamily: f.css, outlineColor: theme.accent }}
                        className={`rounded-xl border border-black/10 p-3 text-left ${prefs.font === f.id ? "outline outline-2" : ""}`}
                      >
                        <span className="block text-lg">அன்பே சிவம்</span>
                        <span className="block text-[11px] opacity-60" style={{ fontFamily: "var(--font-mukta)" }}>{f.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Slider label="எழுத்து அளவு" value={prefs.size} min={15} max={32} step={1} onChange={(size) => update({ size })} display={`${prefs.size}px`} accent={theme.accent} />
                <Slider label="வரி இடைவெளி" value={prefs.leading} min={1.5} max={2.6} step={0.1} onChange={(leading) => update({ leading })} display={prefs.leading.toFixed(1)} accent={theme.accent} />
              </div>
            )}
          </div>
        </>
      )}

      {/* text */}
      <article
        className="reader-text mx-auto max-w-[38rem] px-5 pb-32 pt-28"
        style={{ fontFamily: font.css, fontSize: prefs.size, lineHeight: prefs.leading }}
        onClick={() => setBarsVisible((v) => !v)}
      >
        <p className="mb-2 text-center text-sm tracking-widest" style={{ color: theme.muted, fontFamily: "var(--font-mukta)" }}>
          {chapter + 1} / {total}
        </p>
        <h2 className="mb-10 text-center font-display text-[1.45em] font-bold leading-snug" style={{ color: theme.accent }}>
          {ch.title}
        </h2>
        <div className="mx-auto mb-10 flex items-center justify-center gap-3" style={{ color: theme.accent }}>
          <span className="h-px w-12 bg-current opacity-40" />❁<span className="h-px w-12 bg-current opacity-40" />
        </div>
        {ch.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <nav className="mt-16 flex items-center justify-between gap-4" style={{ fontFamily: "var(--font-mukta)" }} onClick={(e) => e.stopPropagation()}>
          <button
            disabled={chapter === 0}
            onClick={() => go(chapter - 1)}
            className="whitespace-nowrap rounded-full border px-4 py-3 text-base font-semibold disabled:opacity-30"
            style={{ borderColor: theme.muted + "66" }}
          >
            ← முந்தைய
          </button>
          {chapter < total - 1 ? (
            <button
              onClick={() => go(chapter + 1)}
              className="whitespace-nowrap rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-base font-bold text-white shadow-lg"
            >
              அடுத்தது →
            </button>
          ) : (
            <span className="font-display text-lg font-bold" style={{ color: theme.accent }}>
              ✦ முற்றும் ✦
            </span>
          )}
        </nav>
      </article>
    </div>
  );
}

function IconBtn({ on, onClick, label, children }: { on: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-10 min-w-10 place-items-center rounded-full px-2 font-bold transition ${on ? "bg-orange-500 text-white" : "hover:bg-black/5"}`}
    >
      {children}
    </button>
  );
}

function Slider(props: { label: string; value: number; min: number; max: number; step: number; display: string; accent: string; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-sm font-bold opacity-70">
        {props.label} <span>{props.display}</span>
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: props.accent }}
      />
    </label>
  );
}
