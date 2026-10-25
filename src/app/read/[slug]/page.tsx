import { notFound } from "next/navigation";
import { Suspense } from "react";
import Reader from "@/components/Reader";
import { getWork, WORKS } from "@/lib/works";

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/read/[slug]">) {
  const w = getWork((await params).slug);
  return { title: w ? `${w.ta} · வாசிப்பு` : "வாசிப்பு" };
}

export default function ReadPage({ params }: PageProps<"/read/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ReadContent params={params} />
    </Suspense>
  );
}

async function ReadContent({ params }: { params: PageProps<"/read/[slug]">["params"] }) {
  const work = getWork((await params).slug);
  if (!work) notFound();
  return <Reader work={work} />;
}
