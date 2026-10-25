"use client";

// The personal library: texts the reader adds from their own copies,
// kept only in this browser's IndexedDB. Nothing is uploaded anywhere.

export type Chapter = { title: string; paragraphs: string[] };

export type BookText = {
  slug: string;
  source: string; // file name or "pasted"
  addedAt: number;
  chapters: Chapter[];
  chars: number;
};

const DB = "balakumaran-library";
const STORE = "texts";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "slug" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const getText = (slug: string) => tx<BookText | undefined>("readonly", (s) => s.get(slug));
export const putText = (b: BookText) => tx("readwrite", (s) => s.put(b));
export const deleteText = (slug: string) => tx("readwrite", (s) => s.delete(slug));
export const listSlugs = () =>
  tx<IDBValidKey[]>("readonly", (s) => s.getAllKeys()).then((k) => k.map(String));
export const allTexts = () => tx<BookText[]>("readonly", (s) => s.getAll());

/* ---------- parsing ---------- */

const CHAPTER_RE =
  /^\s*(?:#{1,3}\s+.+|(?:அத்தியாயம்|அத்தியாயம்|பகுதி|பாகம்|அத்\.|chapter|part)\s*[-–—:.]?\s*[\d௧-௯IVXLC]+.*|[-–—*\s]*[\d௧-௯]{1,3}[-–—*.\s]*)$/i;

export function splitChapters(raw: string): Chapter[] {
  const text = raw.replace(/\r\n?/g, "\n").replace(/ /g, " ");
  const blocks = text.split(/\n\s*\n|\n(?=\s{2,})/).map((b) => b.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
  // If the file uses single newlines for paragraphs, fall back to line splitting.
  const paras = blocks.length < 3 ? text.split("\n").map((l) => l.trim()).filter(Boolean) : blocks;

  const chapters: Chapter[] = [];
  let cur: Chapter = { title: "தொடக்கம்", paragraphs: [] };
  for (const p of paras) {
    if (p.length < 60 && CHAPTER_RE.test(p)) {
      if (cur.paragraphs.length) chapters.push(cur);
      cur = { title: p.replace(/^#+\s*/, "").replace(/^[-–—*\s]+|[-–—*\s]+$/g, ""), paragraphs: [] };
    } else {
      cur.paragraphs.push(p);
    }
  }
  if (cur.paragraphs.length) chapters.push(cur);

  // No headings found: make readable pages of ~35 paragraphs.
  if (chapters.length <= 1 && paras.length > 60) {
    const all = chapters[0]?.paragraphs ?? paras;
    const pages: Chapter[] = [];
    for (let i = 0; i < all.length; i += 35) {
      pages.push({ title: `பக்கம் ${pages.length + 1}`, paragraphs: all.slice(i, i + 35) });
    }
    return pages;
  }
  return chapters.length ? chapters : [{ title: "தொடக்கம்", paragraphs: paras }];
}

function htmlToText(html: string): { title?: string; text: string } {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,style,nav").forEach((n) => n.remove());
  const heading = doc.querySelector("h1,h2,h3")?.textContent?.trim();
  doc.querySelectorAll("h1,h2,h3").forEach((h) => h.replaceWith(`\n\n# ${h.textContent?.trim()}\n\n`));
  doc.querySelectorAll("p,div,br,li").forEach((n) => n.append("\n\n"));
  return { title: heading, text: doc.body?.textContent ?? "" };
}

async function epubToText(file: File): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(file);
  const container = await zip.file("META-INF/container.xml")?.async("string");
  const opfPath = container?.match(/full-path="([^"]+)"/)?.[1];
  if (!opfPath) throw new Error("EPUB கோப்பைப் படிக்க முடியவில்லை");
  const opf = await zip.file(opfPath)!.async("string");
  if (zip.file("META-INF/encryption.xml")) {
    throw new Error("இந்த EPUB பூட்டப்பட்டுள்ளது (DRM). DRM இல்லாத கோப்பைப் பயன்படுத்தவும்.");
  }
  const base = opfPath.includes("/") ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1) : "";
  const xml = new DOMParser().parseFromString(opf, "application/xml");
  const manifest = new Map<string, string>();
  xml.querySelectorAll("manifest > item").forEach((i) => manifest.set(i.getAttribute("id")!, i.getAttribute("href")!));
  const parts: string[] = [];
  for (const ref of Array.from(xml.querySelectorAll("spine > itemref"))) {
    const href = manifest.get(ref.getAttribute("idref")!);
    if (!href) continue;
    const html = await zip.file(base + decodeURIComponent(href))?.async("string");
    if (!html) continue;
    const { text } = htmlToText(html);
    if (text.trim()) parts.push(text);
  }
  return parts.join("\n\n");
}

export async function fileToText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".epub")) return epubToText(file);
  const raw = await file.text();
  if (name.endsWith(".html") || name.endsWith(".htm") || name.endsWith(".xhtml")) return htmlToText(raw).text;
  return raw;
}

export function makeBook(slug: string, text: string, source: string): BookText {
  const chapters = splitChapters(text);
  return { slug, source, addedAt: Date.now(), chapters, chars: text.length };
}

/* ---------- small prefs in localStorage ---------- */

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}

export type Progress = { chapter: number; scroll: number; at: number };

export const getProgress = (slug: string) => read<Progress | null>(`bk:progress:${slug}`, null);
export const setProgress = (slug: string, p: Progress) => {
  write(`bk:progress:${slug}`, p);
  write("bk:last", slug);
};
export const getLastRead = () => read<string | null>("bk:last", null);

export const getFavorites = () => read<string[]>("bk:fav", []);
export const toggleFavorite = (slug: string) => {
  const f = getFavorites();
  const next = f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug];
  write("bk:fav", next);
  return next;
};

export type ReaderPrefs = { font: string; size: number; leading: number; theme: "paper" | "sepia" | "night" | "lotus" };
export const defaultPrefs: ReaderPrefs = { font: "noto-serif", size: 21, leading: 2, theme: "paper" };
export const getPrefs = () => ({ ...defaultPrefs, ...read<Partial<ReaderPrefs>>("bk:prefs", {}) });
export const setPrefs = (p: ReaderPrefs) => write("bk:prefs", p);
