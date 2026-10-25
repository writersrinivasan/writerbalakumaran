"use client";

import Link from "next/link";
import { useState } from "react";
import { fileToText, makeBook, putText } from "@/lib/library";
import { searchKey } from "@/lib/translit";
import { WORKS } from "@/lib/works";

type Item = { file: File; slug: string; status: "ready" | "saving" | "done" | "error"; msg?: string };

// Match a file name like "udaiyar-1.epub" or "உடையார்.txt" to a work.
function guess(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  const exact = WORKS.find((w) => base.includes(w.ta));
  if (exact) return exact.slug;
  const k = searchKey(base);
  if (!k) return "";
  const hit = [...WORKS]
    .sort((a, b) => b.ta.length - a.ta.length)
    .find((w) => {
      const wk = searchKey(w.ta);
      const ek = w.en ? searchKey(w.en) : "";
      return (wk.length > 3 && k.includes(wk)) || (ek.length > 3 && k.includes(ek));
    });
  return hit?.slug ?? "";
}

export default function ImportPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [drag, setDrag] = useState(false);

  const add = (files: FileList | null) => {
    if (!files) return;
    setItems((prev) => [...prev, ...Array.from(files).map((file): Item => ({ file, slug: guess(file.name), status: "ready" }))]);
  };

  const patch = (i: number, p: Partial<Item>) => setItems((prev) => prev.map((it, j) => (j === i ? { ...it, ...p } : it)));

  async function saveAll() {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.status === "done" || !it.slug) continue;
      patch(i, { status: "saving" });
      try {
        await putText(makeBook(it.slug, await fileToText(it.file), it.file.name));
        patch(i, { status: "done" });
      } catch (e) {
        patch(i, { status: "error", msg: e instanceof Error ? e.message : "பிழை" });
      }
    }
  }

  const ready = items.filter((i) => i.slug && i.status !== "done").length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">
        நூல்களைச் <span className="text-gradient">சேருங்கள்</span>
      </h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted">
        நீங்கள் வாங்கிய / வைத்திருக்கும் பாலகுமாரன் நூல்களின் DRM இல்லாத கோப்புகளை (EPUB, TXT, Markdown, HTML) ஒரே நேரத்தில் பல சேர்க்கலாம்.
        கோப்புப் பெயரை வைத்து நூல் தானாகப் பொருத்தப்படும். கோப்புகள் எங்கும் பதிவேற்றப்படாது — உங்கள் உலாவியில் மட்டுமே.
      </p>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={`mt-8 flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed p-12 text-center transition ${
          drag ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30" : "border-orange-300 bg-orange-50/50 hover:bg-orange-50 dark:border-orange-900 dark:bg-white/5"
        }`}
      >
        <span className="text-5xl">📥</span>
        <span className="mt-3 font-display text-xl font-bold">கோப்புகளை இங்கே இழுத்து விடுங்கள்</span>
        <span className="text-muted">அல்லது சொடுக்கித் தேர்ந்தெடுங்கள்</span>
        <input type="file" multiple accept=".txt,.md,.markdown,.html,.htm,.xhtml,.epub" className="hidden" onChange={(e) => add(e.target.files)} />
      </label>

      {items.length > 0 && (
        <div className="mt-8 space-y-3">
          {items.map((it, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{it.file.name}</p>
                <p className="text-xs text-muted">{Math.round(it.file.size / 1024)} KB</p>
              </div>
              <select
                value={it.slug}
                onChange={(e) => patch(i, { slug: e.target.value, status: "ready" })}
                disabled={it.status === "done"}
                className="rounded-xl border border-line bg-bg px-3 py-2 sm:w-64"
              >
                <option value="">— நூலைத் தேர்ந்தெடு —</option>
                {WORKS.map((w) => (
                  <option key={w.slug} value={w.slug}>
                    {w.ta}
                  </option>
                ))}
              </select>
              <span className="w-28 text-sm font-semibold">
                {it.status === "done" ? (
                  <Link href={`/read/${it.slug}`} className="text-emerald-600">✓ வாசி →</Link>
                ) : it.status === "saving" ? (
                  "சேமிக்கிறது…"
                ) : it.status === "error" ? (
                  <span className="text-rose-600" title={it.msg}>✕ {it.msg}</span>
                ) : !it.slug ? (
                  <span className="text-amber-600">பொருத்தவும்</span>
                ) : (
                  <span className="text-muted">தயார்</span>
                )}
              </span>
            </div>
          ))}
          <button
            onClick={saveAll}
            disabled={!ready}
            className="mt-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-8 py-3.5 text-lg font-bold text-white shadow-lg disabled:opacity-40"
          >
            {ready} நூல்களைச் சேமி
          </button>
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-line bg-card p-6">
        <h2 className="font-display text-xl font-bold">குறிப்புகள்</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted">
          <li>Kindle-இல் வாங்கிய நூல்கள் பூட்டப்பட்டவை (DRM) — அவற்றை Kindle செயலியிலேயே வாசியுங்கள்.</li>
          <li>உங்கள் சொந்த அச்சுப் பிரதியிலிருந்து தட்டச்சு செய்த உரையை நூலின் பக்கத்தில் “உரையை ஒட்டு” மூலம் சேர்க்கலாம்.</li>
          <li>“அத்தியாயம் 1”, “பகுதி 2”, “# தலைப்பு” போன்ற வரிகளை வைத்து அத்தியாயங்கள் தானாகப் பிரிக்கப்படும்.</li>
          <li>காப்புப் பிரதி எடுக்க “என் அலமாரி” பக்கத்தைப் பயன்படுத்துங்கள்.</li>
        </ul>
      </div>
    </div>
  );
}
