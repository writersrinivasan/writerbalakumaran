import Link from "next/link";
import ContinueReading from "@/components/ContinueReading";
import WorkCard from "@/components/WorkCard";
import { CATEGORIES, FILMS, WORKS } from "@/lib/works";

export default function Home() {
  const featured = WORKS.filter((w) => w.featured);
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, WORKS.filter((w) => w.category === c.id).length]));
  const spiritual = WORKS.filter((w) => w.category === "spiritual" || w.category === "epic");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-rose-600 to-fuchsia-800 text-white">
        <div className="kolam absolute inset-0 opacity-40" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-14 sm:pt-20">
          <p className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
            ✦ எழுத்துச் சித்தர் ✦ 1946 – 2018
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-tight sm:text-7xl">பாலகுமாரன்</h1>
          <p className="mt-4 max-w-2xl font-serif text-lg leading-loose text-white/90 sm:text-xl">
            இருநூறுக்கும் மேற்பட்ட நாவல்கள், நூற்றுக்கணக்கான சிறுகதைகள், ஆன்மிக வரலாறுகள், சோழப் பேரரசின் காவியங்கள் —
            ஒரே இடத்தில், உங்கள் வாசிப்புக்காக.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/library" className="rounded-full bg-white px-6 py-3 font-bold text-rose-700 shadow-lg transition hover:scale-105">
              நூலகத்தைத் திற →
            </Link>
            <Link href="/import" className="rounded-full border-2 border-white/70 px-6 py-3 font-bold transition hover:bg-white/15">
              என் நூலைச் சேர்
            </Link>
          </div>
          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4">
            {[
              [WORKS.length + "+", "படைப்புகள்"],
              [FILMS.length, "திரைப்படங்கள்"],
              [counts.spiritual + counts.epic, "ஆன்மிக நூல்கள்"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <dt className="font-display text-3xl font-bold">{n}</dt>
                <dd className="text-sm text-white/80">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ContinueReading />

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl font-bold">வகைகள்</h2>
        <p className="text-muted">எதை வாசிக்கலாம் இன்று?</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/library?cat=${c.id}`}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="kolam absolute inset-0 opacity-40" />
              <div className="relative">
                <span className="text-3xl">{c.emoji}</span>
                <h3 className="mt-3 font-display text-xl font-bold leading-snug">{c.ta}</h3>
                <p className="mt-1 text-sm text-white/85 line-clamp-2">{c.blurb}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/75">
                  {c.en} · {counts[c.id]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured shelf */}
      <section className="bg-gradient-to-b from-orange-50 to-transparent py-14 dark:from-white/5">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold">புகழ்பெற்ற படைப்புகள்</h2>
              <p className="text-muted">வாசகர்கள் கொண்டாடும் நூல்கள்</p>
            </div>
            <Link href="/library" className="font-semibold text-saffron hover:underline">
              அனைத்தும் →
            </Link>
          </div>
          <div className="no-scrollbar mt-6 flex snap-x gap-5 overflow-x-auto pb-4">
            {featured.map((w) => (
              <div key={w.slug} className="w-36 shrink-0 snap-start sm:w-40">
                <WorkCard work={w} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spiritual highlight */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 p-8 text-white sm:p-12">
          <div className="kolam absolute inset-0 opacity-30" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-5xl">🪔</p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">ஆன்மிகப் பயணம்</h2>
              <p className="mt-3 font-serif text-lg leading-loose text-white/90">
                யோகி ராம்சுரத்குமாரின் சீடராக, பட்டினத்தார், அருணகிரிநாதர், அபிராமி பட்டர், சேஷாத்ரி சுவாமிகள், குமரகுருபரர், ஸ்ரீ ராகவேந்திரர்
                ஆகியோரின் வாழ்வை நாவல்களாக்கினார்.
              </p>
              <Link href="/library?cat=spiritual" className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-bold text-orange-700">
                ஆன்மிக நூல்கள் →
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {spiritual.slice(0, 8).map((w) => (
                <li key={w.slug}>
                  <Link href={`/work/${w.slug}`} className="block rounded-xl bg-white/15 p-3 backdrop-blur transition hover:bg-white/25">
                    <p className="font-display font-bold">{w.ta}</p>
                    {w.note && <p className="text-xs text-white/80 line-clamp-1">{w.note}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-3xl font-bold">எப்படிப் பயன்படுத்துவது?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["📚", "நூலைத் தேர்ந்தெடுங்கள்", "நூலகத்தில் அவரது படைப்புகளைத் தேடுங்கள், வகைப்படி பாருங்கள்."],
            ["📥", "உங்கள் பிரதியைச் சேருங்கள்", "நீங்கள் வாங்கிய மின்னூல் (EPUB / TXT / HTML) அல்லது தட்டச்சு செய்த உரையைச் சேருங்கள். அது உங்கள் உலாவியில் மட்டுமே இருக்கும்."],
            ["🌙", "அழகாக வாசியுங்கள்", "சிறந்த தமிழ் எழுத்துருக்கள், இரவு / செபியா தீம், எங்கே நிறுத்தினீர்கள் என்பதை நினைவில் வைக்கும்."],
          ].map(([e, t, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-card p-6">
              <p className="text-3xl">{e}</p>
              <h3 className="mt-3 font-display text-xl font-bold">{t}</h3>
              <p className="mt-2 text-muted leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
