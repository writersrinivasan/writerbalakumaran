import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import BookCover from "@/components/BookCover";
import MyCopyPanel from "@/components/MyCopyPanel";
import WorkCard from "@/components/WorkCard";
import { findLinks, getCategory, getWork, WORKS } from "@/lib/works";

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const w = getWork((await params).slug);
  return { title: w ? `${w.ta} — பாலகுமாரன்` : "பாலகுமாரன்" };
}

export default function WorkPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<WorkSkeleton />}>
      <WorkContent params={params} />
    </Suspense>
  );
}

function WorkSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[420px] bg-gradient-to-br from-orange-200 via-rose-200 to-fuchsia-200 dark:from-white/5 dark:to-white/10" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-40 rounded-2xl bg-orange-100/60 dark:bg-white/5" />
      </div>
    </div>
  );
}

async function WorkContent({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const work = getWork((await params).slug);
  if (!work) notFound();
  const cat = getCategory(work.category);
  const related = WORKS.filter((w) => w.category === work.category && w.slug !== work.slug).slice(0, 6);

  return (
    <div>
      <section className={`relative overflow-hidden bg-gradient-to-br ${cat.gradient}`}>
        <div className="kolam absolute inset-0 opacity-40" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 text-white md:flex-row md:items-end">
          <BookCover work={work} size="lg" />
          <div className="text-center md:text-left">
            <Link href={`/library?cat=${cat.id}`} className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur hover:bg-white/30">
              {cat.emoji} {cat.ta}
            </Link>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">{work.ta}</h1>
            {work.en && <p className="mt-1 text-lg text-white/85">{work.en}</p>}
            <p className="mt-2 font-semibold">பாலகுமாரன்</p>
            {work.note && <p className="mt-4 max-w-xl font-serif text-lg leading-loose text-white/95">{work.note}</p>}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1fr_300px]">
        <MyCopyPanel slug={work.slug} />

        <aside className="rounded-2xl border border-line bg-card p-5 h-fit">
          <h2 className="font-display text-lg font-bold">நூலைப் பெற</h2>
          <p className="mt-1 text-sm text-muted">அச்சு நூல் அல்லது மின்னூலாக வாங்கி எழுத்தாளரின் குடும்பத்தை ஆதரியுங்கள்.</p>
          <ul className="mt-4 space-y-2">
            {findLinks(work).map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-line px-4 py-2.5 font-medium transition hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-white/5"
                >
                  {l.label} <span className="text-muted">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="font-display text-2xl font-bold">இதே வகையில்</h2>
          <div className="mt-5 grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-6">
            {related.map((w) => (
              <WorkCard key={w.slug} work={w} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
