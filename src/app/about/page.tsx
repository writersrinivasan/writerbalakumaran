import Link from "next/link";
import { FILMS, WORKS } from "@/lib/works";

export const metadata = { title: "பாலகுமாரன் — வாழ்க்கைக் குறிப்பு" };

const TIMELINE = [
  ["1946", "ஜூலை 5 — தஞ்சாவூர் மாவட்டம், திருக்காட்டுப்பள்ளி அருகே பழமானேரியில் பிறப்பு."],
  ["", "சென்னையில் TAFE டிராக்டர் நிறுவனத்தில் சுருக்கெழுத்தாளராகப் பணி; பின்னர் முழுநேர எழுத்தாளரானார்."],
  ["", "‘கசடதபற’ இலக்கிய இதழின் தொடக்க உறுப்பினர்களில் ஒருவர்."],
  ["", "முதல் நாவல் ‘மெர்க்குரிப் பூக்கள்’ — ‘சாவி’ இதழில் தொடர். இரண்டாவது ‘இரும்புக் குதிரைகள்’ — ‘கல்கி’யில்."],
  ["", "கல்கி, ஆனந்த விகடன், குமுதம் இதழ்களில் தொடர்ந்து எழுதினார்."],
  ["1987", "மணிரத்னத்தின் ‘நாயகன்’ — திரை எழுத்தில் புகழ்."],
  ["1988", "‘இது நம்ம ஆளு’ திரைப்படத்தை இயக்கினார்."],
  ["", "யோகி ராம்சுரத்குமாரின் சீடர்; ஆன்மிக நாவல்கள் பல எழுதினார்."],
  ["", "‘உடையார்’ — ராஜராஜ சோழனின் பெருங்காவியம், ஆறு பாகங்கள்."],
  ["2018", "மே 15 — சென்னையில் மறைவு."],
];

const AWARDS = [
  ["இரும்புக் குதிரைகள்", "ராஜா சர் அண்ணாமலை செட்டியார் அறக்கட்டளை விருது"],
  ["மெர்க்குரிப் பூக்கள்", "இலக்கியச் சிந்தனை விருது"],
  ["சுகஜீவனம்", "தமிழக அரசு விருது — முதல் பரிசு"],
  ["கடற்பாலம்", "தமிழக அரசு விருது — இரண்டாம் பரிசு"],
  ["காதலன்", "சிறந்த வசனத்துக்கான தமிழக அரசு திரைப்பட விருது"],
  ["குணா", "சினிமா எக்ஸ்பிரஸ் விருது"],
  ["—", "கலைமாமணி விருது, தமிழக அரசு"],
];

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-fuchsia-700 to-indigo-800 text-white">
        <div className="kolam absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-sm font-semibold tracking-widest text-white/75">1946 – 2018</p>
          <h1 className="mt-2 font-display text-5xl font-bold sm:text-6xl">எழுத்துச் சித்தர் பாலகுமாரன்</h1>
          <p className="mx-auto mt-5 max-w-2xl font-serif text-lg leading-loose text-white/90">
            இருநூறுக்கும் மேற்பட்ட நாவல்கள், நூற்றுக்கும் மேற்பட்ட சிறுகதைகள், இருபதுக்கும் மேற்பட்ட திரைப்படங்களுக்கு எழுத்து. பெண்களை
            முழுமையான, சிந்திக்கும் மனிதர்களாகச் சித்தரித்ததற்காக வாசகர்களால் நேசிக்கப்பட்டவர்.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="font-display text-3xl font-bold">வாழ்க்கைப் பாதை</h2>
        <ol className="mt-6 space-y-4 border-l-4 border-orange-300 pl-6 dark:border-orange-800">
          {TIMELINE.map(([y, t], i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[34px] top-1.5 h-4 w-4 rounded-full border-4 border-bg bg-gradient-to-br from-orange-500 to-rose-500" />
              {y && <p className="font-display text-lg font-bold text-saffron">{y}</p>}
              <p className="font-serif leading-loose">{t}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 font-display text-3xl font-bold">விருதுகள்</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {AWARDS.map(([w, a]) => (
            <div key={a} className="rounded-2xl border border-line bg-card p-4">
              <p className="text-2xl">🏆</p>
              <p className="mt-1 font-bold">{a}</p>
              <p className="text-sm text-muted">{w}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-3xl font-bold">திரைப்படங்கள் 🎬</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FILMS.map((f) => (
            <div key={f.en} className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 p-4 text-white shadow">
              <p className="text-xs text-amber-300">{f.year}</p>
              <p className="font-display text-lg font-bold">{f.ta}</p>
              <p className="text-xs text-white/60">{f.en} · {f.role}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-line bg-card p-6 text-sm leading-relaxed text-muted">
          <p className="font-semibold text-ink">தகவல் மூலம் & குறிப்பு</p>
          <p className="mt-2">
            நூல் பட்டியல் தமிழ் / ஆங்கில விக்கிப்பீடியாவின் பாலகுமாரன் பக்கங்களை அடிப்படையாகக் கொண்டது ({WORKS.length} தலைப்புகள்). அவர் 200-க்கும் மேற்பட்ட
            நாவல்கள் எழுதியதால் சில தலைப்புகள் விடுபட்டிருக்கலாம்; சில தலைப்புகளின் வகை தோராயமானது. அவரது படைப்புகள் இன்னும் பதிப்புரிமைக்கு உட்பட்டவை —
            இந்தச் செயலி உங்கள் சொந்தப் பிரதிகளை வாசிக்க மட்டுமே.
          </p>
          <Link href="/library" className="mt-4 inline-block font-bold text-saffron">நூலகத்துக்குச் செல் →</Link>
        </div>
      </div>
    </div>
  );
}
