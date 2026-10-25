import Link from "next/link";
import BookCover from "./BookCover";
import type { Work } from "@/lib/works";

export default function WorkCard({ work, owned }: { work: Work; owned?: boolean }) {
  return (
    <Link href={`/work/${work.slug}`} className="group block">
      <div className="relative transition duration-300 group-hover:-translate-y-1.5 group-hover:rotate-[-1deg]">
        <BookCover work={work} />
        {owned && (
          <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-emerald-700 shadow">
            ✓ வாசிக்கலாம்
          </span>
        )}
      </div>
      <p className="mt-2 font-semibold leading-snug line-clamp-2">{work.ta}</p>
      {work.en && <p className="text-xs text-muted line-clamp-1">{work.en}</p>}
    </Link>
  );
}
