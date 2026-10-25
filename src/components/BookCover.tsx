import { getCategory, type Work } from "@/lib/works";

// Deterministic per-title variation so every cover looks a little different.
function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.codePointAt(0)!) >>> 0;
  return h;
}

const MOTIFS = ["◈", "❁", "✿", "❂", "✺", "❋", "✾", "☸"];

export default function BookCover({ work, size = "md" }: { work: Work; size?: "sm" | "md" | "lg" }) {
  const cat = getCategory(work.category);
  const h = hash(work.ta);
  const rotate = (h % 50) - 25;
  const motif = MOTIFS[h % MOTIFS.length];
  const dims =
    size === "lg" ? "w-52 sm:w-60 text-3xl" : size === "sm" ? "w-24 text-sm" : "w-full text-lg";
  const titleSize = work.ta.length > 22 ? "text-[0.8em]" : work.ta.length > 12 ? "text-[0.92em]" : "";

  return (
    <div
      className={`cover-shine relative aspect-[2/3] overflow-hidden rounded-lg rounded-l-sm bg-gradient-to-br ${cat.gradient} ${dims} shadow-lg shadow-black/20`}
    >
      <div className="kolam absolute inset-0 opacity-60" />
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-sm"
        style={{ transform: `rotate(${rotate}deg) translate(${h % 20}px, ${h % 30}px)` }}
      />
      <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-black/15" />
      <div className="relative flex h-full flex-col p-[10%] text-white">
        <span className="text-[0.7em] opacity-80">{motif} {cat.emoji}</span>
        <h3 className={`mt-auto font-display font-bold leading-snug drop-shadow-md ${titleSize}`}>{work.ta}</h3>
        <div className="my-[6%] h-px w-1/2 bg-white/60" />
        <p className="text-[0.55em] font-semibold tracking-wide opacity-90">பாலகுமாரன்</p>
      </div>
    </div>
  );
}
