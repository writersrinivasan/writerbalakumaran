import { slugify, searchKey } from "./translit";

export type CategoryId =
  | "historical"
  | "spiritual"
  | "epic"
  | "social"
  | "stories"
  | "essays"
  | "life"
  | "poetry";

export type Category = {
  id: CategoryId;
  ta: string;
  en: string;
  blurb: string;
  gradient: string; // tailwind gradient classes
  emoji: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "historical",
    ta: "வரலாற்றுப் புதினங்கள்",
    en: "Historical Epics",
    blurb: "சோழப் பேரரசின் பெருமிதக் கதைகள்",
    gradient: "from-amber-500 via-orange-500 to-red-600",
    emoji: "🏛️",
  },
  {
    id: "spiritual",
    ta: "ஆன்மிகப் படைப்புகள்",
    en: "Spiritual Works",
    blurb: "சித்தர்கள், ஞானிகள், அருளாளர்களின் வாழ்வு",
    gradient: "from-orange-400 via-rose-500 to-fuchsia-600",
    emoji: "🪔",
  },
  {
    id: "epic",
    ta: "இதிகாசம் & புராணம்",
    en: "Epics & Puranas",
    blurb: "மகாபாரதம், ராமாயணம், பெரிய புராணம் — மறுவாசிப்பு",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    emoji: "📜",
  },
  {
    id: "social",
    ta: "சமூகப் புதினங்கள்",
    en: "Social Novels",
    blurb: "உறவுகள், காதல், உழைப்பு, பெண்மையின் வலிமை",
    gradient: "from-teal-400 via-cyan-500 to-indigo-600",
    emoji: "🌿",
  },
  {
    id: "stories",
    ta: "சிறுகதைகள்",
    en: "Short Stories",
    blurb: "சிறுகதைத் தொகுப்புகளும் தனிக் கதைகளும்",
    gradient: "from-lime-400 via-emerald-500 to-teal-600",
    emoji: "✒️",
  },
  {
    id: "essays",
    ta: "கட்டுரைகள் & கேள்வி–பதில்",
    en: "Essays & Q&A",
    blurb: "வாழ்க்கை, எழுத்து, ஞானம் பற்றிய சிந்தனைகள்",
    gradient: "from-sky-400 via-blue-500 to-violet-600",
    emoji: "💭",
  },
  {
    id: "life",
    ta: "தன்வரலாறு",
    en: "Autobiography",
    blurb: "எழுத்துச் சித்தரின் சொந்தக் கதை",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    emoji: "📖",
  },
  {
    id: "poetry",
    ta: "கவிதைகள்",
    en: "Poetry",
    blurb: "கவிஞர் பாலகுமாரன்",
    gradient: "from-violet-400 via-purple-500 to-fuchsia-600",
    emoji: "🌸",
  },
];

export type Work = {
  slug: string;
  ta: string;
  en?: string;
  category: CategoryId;
  note?: string;
  featured?: boolean;
  key: string; // for search
};

type Raw = [ta: string, en?: string, note?: string, featured?: boolean];

const historical: Raw[] = [
  ["உடையார்", "Udaiyar", "ஆறு பாகங்கள் — ராஜராஜ சோழனும் தஞ்சைப் பெரிய கோயிலின் உருவாக்கமும்", true],
  ["கங்கை கொண்ட சோழன்", "Gangai Konda Chozhan", "ராஜேந்திர சோழனின் வீர வரலாறு — உடையாரின் தொடர்ச்சி", true],
];

const spiritual: Raw[] = [
  ["குரு", "Guru", "திருவண்ணாமலை பகவான் யோகி ராம்சுரத்குமார் பற்றியது", true],
  ["பகவான் யோகி ராம்சுரத்குமார் சரிதம்", "Bhagavan Yogi Ramsuratkumar Charitham", "தன் குருநாதரின் வாழ்க்கை வரலாறு (2014)"],
  ["விசிறி சாமியார்", "Visiri Samiyar", "சிறுகதைகளும் கவிதைகளும் — யோகி ராம்சுரத்குமார் நினைவில்"],
  ["பேய்க் கரும்பு", "Pei Karumbu", "பட்டினத்தார் சுவாமிகளின் வாழ்வு", true],
  ["சிம்மாசனம்", "Simmasanam", "குமரகுருபர சுவாமிகளின் வாழ்வு"],
  ["தங்கக்கை", "Thangakkai", "திருவண்ணாமலை சேஷாத்ரி சுவாமிகளின் வாழ்வு"],
  ["காதற் பெருமான்", "Kaadhar Perumaan", "அருணகிரிநாதரின் வாழ்வு"],
  ["என் கண்மணித் தாமரை", "En Kanmani Thamarai", "அபிராமி பட்டரின் வாழ்வு", true],
  ["பிருந்தாவனம்", "Brindhavanam", "ஸ்ரீ ராகவேந்திர சுவாமிகளின் வாழ்வு"],
];

const epic: Raw[] = [
  ["மகாபாரதம்", "Mahabharatham", "இரண்டு பாகங்கள் — மறுஆக்கம்", true],
  ["ராமாயணம்", "Ramayanam"],
  ["கர்ணனின் கதை", "Karnanin Kathai"],
  ["கிருஷ்ண அர்ஜுனன்", "Krishna Arjunan"],
  ["குசேலர்", "Kuchelar"],
  ["பெரிய புராணக் கதைகள்", "Periya Purana Kathaigal", "நாயன்மார்களின் கதைகள்"],
];

const socialFeatured: Raw[] = [
  ["மெர்க்குரிப் பூக்கள்", "Mercury Pookkal", "முதல் நாவல் — ‘சாவி’ இதழில் தொடர்; இலக்கியச் சிந்தனை விருது", true],
  ["இரும்புக் குதிரைகள்", "Irumbu Kuthiraigal", "‘கல்கி’யில் தொடர்; ராஜா சர் அண்ணாமலை செட்டியார் விருது", true],
  ["தாயுமானவன்", "Thayumanavan", undefined, true],
  ["கடலோரக் குருவிகள்", "Kadalora Kuruvigal", undefined, true],
  ["கரையோர முதலைகள்", "Karaiyora Mudhalaigal", undefined, true],
  ["பயணிகள் கவனிக்கவும்", "Payanigal Kavanikkavum", undefined, true],
  ["அகல்யா", "Agalya", undefined, true],
  ["செண்பகத்தோட்டம்", "Shenbagathottam", "திரைப்படமாகவும் வந்தது"],
  ["பச்சை வயல் மனது", "Pachai Vayal Manadhu"],
  ["கை வீசம்மா கை வீசு", "Kai Veesamma Kai Veesu"],
  ["என்றென்றும் அன்புடன்", "Endrendrum Anbudan"],
  ["பனிவிழும் மலர்வனம்", "Pani Vizhum Malarvanam"],
  ["கடல் நீலம்", "Kadal Neelam"],
  ["நிகும்பலை", "Nigumbalai"],
  ["துணை", "Thunai"],
  ["மீட்டாத வீணை", "Meettaadha Veenai"],
  ["வெற்றிலைக் கொடி", "Vetrilai Kodi"],
  ["சக்தி", "Shakthi"],
  ["கற்றுக்கொண்டால் குற்றமில்லை", "Katrukkondaal Kutramillai"],
  ["கல்யாண முருங்கை", "Kalyana Murungai"],
  ["கண்ணாடிக் கோபுரங்கள்", "Kannaadi Gopurangal"],
  ["கடிகை", "Kadigai"],
  ["மனம் உருகுதே", "Manam Urugudhe"],
  ["அப்பம் வடை தயிர்சாதம்", "Appam Vadai Thayir Saadham"],
  ["இதுதான் வயது காதலிக்க...", "Idhuthaan Vayadhu Kaadhalikka"],
  ["சிநேகமுள்ள சிங்கம்", "Snegamulla Singam"],
  ["ஏனோ தெரியவில்லை", "Yeno Theriyavillai"],
  ["நெளிமோதிரம்", "Neli Modhiram"],
  ["என் மனது தாமரைப்பூ", "En Manadhu Thamaraippoo"],
  ["வில்வ மரம்", "Vilva Maram"],
  ["மரக்கால்", "Marakkaal"],
  ["தோழன்", "Thozhan"],
  ["அவனி", "Avani"],
  ["கண்ணே வண்ணப் பசுங்கிளியே", "Kanne Vanna Pasungiliye"],
  ["நான் என்ன சொல்லிவிட்டேன்", "Naan Enna Sollivitten"],
  ["தலையணைப் பூக்கள்", "Thalaiyanai Pookkal"],
  ["காதல் அரங்கம்", "Kaadhal Arangam"],
  ["மஞ்சக் காணி", "Manja Kaani"],
  ["இது போதும்", "Idhu Podhum"],
  ["333 அம்மையப்பன் தெரு", "333 Ammaiyappan Theru"],
];

// Remaining novels, from the bibliography on Tamil Wikipedia (alphabetical).
const socialRest = `அகல்விளக்கு, அடுக்கு மல்லி, அத்திப்பூ, அப்பா !, அமிர்தயோகம், அரசமரம், அவரும் அவளும், அன்பரசு,
ஆசை என்னும் வேதம், ஆசைக்கடல், ஆயிரம் கண்ணி, ஆருயிரே மன்னவரே, ஆலமரம், ஆனந்த யோகம், ஆனந்த வயல்,
இதுதான் காதல் என்பதா..?, இரண்டாவது கல்யாணம், இரண்டாவது சூரியன், இனி என் முறை, இனிது இனிது காதல் இனிது,
இனிய யட்சினி, உச்சித் திலகம், உத்தமன், உள்ளம் கவர் கள்வன், உறவில் கலந்து உணர்வில் நனைந்து,
எங்கள் காதல் ஒரு தினுசு, எட்ட நின்று சுட்ட நிலா, எதிர்ப்பக்கம், நானே எனக்கொரு போதி மரம், என் அன்புள்ள அப்பா,
என் கண்மணி, என்னுயிரும் நீயல்லவோ, என்னுயிர் தோழி, ஏதோ ஒரு நதியில், ஏழாவது காதல், ஒரு காதல் நிவந்தம்,
கண்காட்சி, கண்ணே கலைமானே, கதைகதையாம் காரணமாம், கல்குதிரை, கல்யாணத் தேர், கல்லும் முள்ளும் காலுக்கு மெத்தை,
கவிழ்ந்த காணிக்கை, கள்ளி, கனவு கண்டேன் தோழி, கனவுக்குடித்தனம், கனவுகள் விற்பவன், காசும் பிறப்பும்,
காதல் சிறகு, காதல் சொல்ல வந்தேன், காதல் வரி, காதல் வெண்ணிலா, காதற்கிளிகள், காமதேனு, காற்றுக்கென்ன வேலி,
கானல் தாகம், கிருஷ்ண மந்திரம், குயிலே குயிலே, கூடு, கொஞ்சும் புறாவே, கொம்புத்தேன், சக்ரவாஹம்,
சுந்தரி கண்ணால் ஒரு சேதி, சுழற்காற்று, செப்புப் பட்டயம், செவ்வரளி, சொர்ண வேட்டை, தனரேகை, தனிமைத் தவம்,
திருப்பூந்துருத்தி, திருமணமான என் தோழிக்கு, திருவடி, துளசி, தென்னம் பாளை, தொப்புள் கொடி, நல்ல முன்பனிக்காலம்,
நான்காம் பிறை, நிலாக்கால மேகம், நிலாவே வா, நிழல் யுத்தம், நீ வருவாய் என, நெல்லுச் சோறு, நேற்று வரை ஏமாற்றினாள்!,
பட்டாபிஷேகம், பணம் காய்ச்சி மரம், பந்தயப் புறா, பவழமல்லி, பலாமரம், பாகசாலை, பிரம்புக்கூடை, புருஷ வதம்,
பெண்ணாசை, பொய்மான், பொன்னார் மேனியனே, போகன் வில்லா, போராடும் பெண்மணிகள், மணல் நதி, மனக்கோயில்,
மனசே மனசே கதவைத் திற, மண்ணில் தெரியுது வானம், மாலைநேரத்து மயக்கம், மாவிலைத் தோரணம், மானச தேவி,
முதிர்கன்னி, முந்தானை ஆயுதம், மெளனமே காதலாக..., மேய்ச்சல் மைதானம், யானை வேட்டை, ரகசிய சிநேகிதனே,
ராஜ கோபுரம், வன்னிமரத் தாலி, வாலிப வேடம், வாழையடி வாழை, விழித்துணை, வெள்ளைத் துறைமுகம், வேட்டை`
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((t): Raw => [t]);

const stories: Raw[] = [
  ["சுகஜீவனம்", "Sugajeevanam", "சிறுகதைத் தொகுப்பு — தமிழக அரசு விருது (முதல் பரிசு)", true],
  ["கடற்பாலம்", "Kadarpaalam", "சிறுகதைத் தொகுப்பு — தமிழக அரசு விருது (இரண்டாம் பரிசு)"],
  ["சின்ன சின்ன வட்டங்கள்", "Chinna Chinna Vattangal", "சிறுகதைத் தொகுப்பு"],
  ["சிறுகதைகளும் கட்டுரைகளும்", "Sirukathaigalum Katturaigalum", "தொகுப்பு"],
  ...`ஒன்றானவன், ஒன்றுமில்லாதவர்கள், ஓசையற்ற அலறல், கரை தொடும் அலைகள், கல் பரிசல், சிட்டுக்குருவியும் ஸ்வர்ணலதாவும்,
தாக்கம், தோழி, பாகல், மின்மினிக்கூட்டம், விகல்பம், ஸ்திரீ லோலன்`
    .split(",")
    .map((s): Raw => [s.trim(), undefined, "சிறுகதை"]),
];

const essays: Raw[] = [
  ["பாலகுமாரன் பதில்கள்", "Balakumaran Bathilgal", "வாசகர் கேள்விகளுக்கு பதில்கள் — நான்கு பாகங்கள்", true],
  ["பாலகுமாரன் கட்டுரைகள்", "Balakumaran Katturaigal", "கட்டுரைத் தொகுப்பு"],
  ["அம்மாவும் பத்து கட்டுரைகளும்", "Ammavum Pathu Katturaigalum"],
  ["உயிர்ச்சுருள்", "Uyirchurul"],
  ["காதலாகிக் கனிந்து", "Kaadhalaagi Kanindhu"],
  ["ஞாபகச் சிமிழ்", "Nyaabaga Chimizh"],
  ["சூரியனோடு சில நாட்கள்", "Sooriyanodu Sila Naatkal"],
  ["அந்த ஏழு நாட்கள்", "Andha Ezhu Naatkal"],
];

const life: Raw[] = [
  ["முன்கதைச் சுருக்கம்", "Munkathai Surukkam", "தன்வரலாறு", true],
  ["இதற்குத்தானே ஆசைப்பட்டாய் பாலகுமாரா?", "Idharkuthaane Aasaippattaai Balakumara", "தன்வரலாற்றுக் கட்டுரைகள்"],
  ["ஒரு சொல் ஒரு வில் ஒரு இல்", "Oru Sol Oru Vil Oru Il"],
];

const poetry: Raw[] = [["விட்டில்பூச்சிகள்", "Vittil Poochigal", "கவிதைத் தொகுப்பு"]];

function build(): Work[] {
  const groups: [CategoryId, Raw[]][] = [
    ["historical", historical],
    ["spiritual", spiritual],
    ["epic", epic],
    ["social", [...socialFeatured, ...socialRest]],
    ["stories", stories],
    ["essays", essays],
    ["life", life],
    ["poetry", poetry],
  ];
  const seen = new Set<string>();
  const out: Work[] = [];
  for (const [category, list] of groups) {
    for (const [ta, en, note, featured] of list) {
      let slug = (en ? slugify(en) : slugify(ta)) || `work-${out.length}`;
      while (seen.has(slug)) slug += "-2";
      seen.add(slug);
      out.push({
        slug,
        ta,
        en,
        category,
        note,
        featured,
        key: `${searchKey(ta)} ${en ? searchKey(en) : ""} ${ta}`,
      });
    }
  }
  return out;
}

export const WORKS: Work[] = build();

export const getWork = (slug: string) => WORKS.find((w) => w.slug === slug);
export const getCategory = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;

export type Film = { ta: string; en: string; year?: number; role: string };

export const FILMS: Film[] = [
  { ta: "ராஜ பார்வை", en: "Raja Paarvai", year: 1981, role: "திரை எழுத்து" },
  { ta: "நாயகன்", en: "Nayakan", year: 1987, role: "திரை எழுத்து" },
  { ta: "இது நம்ம ஆளு", en: "Idhu Namma Aalu", year: 1988, role: "இயக்கம்" },
  { ta: "குணா", en: "Guna", year: 1991, role: "திரை எழுத்து" },
  { ta: "செண்பகத் தோட்டம்", en: "Shenbagathottam", year: 1992, role: "கதை" },
  { ta: "ஜென்டில்மேன்", en: "Gentleman", year: 1993, role: "திரை எழுத்து" },
  { ta: "காதலன்", en: "Kaadhalan", year: 1994, role: "திரை எழுத்து — சிறந்த வசனத்துக்கான மாநில விருது" },
  { ta: "பாட்ஷா", en: "Baashha", year: 1995, role: "திரை எழுத்து" },
  { ta: "கிழக்கு மலை", en: "Kizhakku Malai", year: 1995, role: "திரை எழுத்து" },
  { ta: "ரகசிய போலீஸ்", en: "Ragasiya Police", year: 1995, role: "திரை எழுத்து" },
  { ta: "சிவசக்தி", en: "Sivasakthi", year: 1996, role: "திரை எழுத்து" },
  { ta: "உல்லாசம்", en: "Ullaasam", year: 1997, role: "திரை எழுத்து" },
  { ta: "வேலை", en: "Velai", year: 1998, role: "திரை எழுத்து" },
  { ta: "ஜீன்ஸ்", en: "Jeans", year: 1998, role: "திரை எழுத்து" },
  { ta: "முகவரி", en: "Mugavaree", year: 2000, role: "திரை எழுத்து" },
  { ta: "உயிரிலே கலந்தது", en: "Uyirile Kalanthathu", year: 2000, role: "திரை எழுத்து" },
  { ta: "சிட்டிசன்", en: "Citizen", year: 2001, role: "திரை எழுத்து" },
  { ta: "மஜ்னு", en: "Majnu", year: 2001, role: "திரை எழுத்து" },
  { ta: "காதல் சடுகுடு", en: "Kadhal Sadugudu", year: 2003, role: "திரை எழுத்து" },
  { ta: "ஜனனம்", en: "Jananam", year: 2004, role: "திரை எழுத்து" },
  { ta: "மன்மதன்", en: "Manmadhan", year: 2004, role: "திரை எழுத்து" },
  { ta: "வல்லவன்", en: "Vallavan", year: 2006, role: "திரை எழுத்து" },
  { ta: "புதுப்பேட்டை", en: "Pudhupettai", year: 2006, role: "திரை எழுத்து" },
];

/** Search links to legal sources where the user can buy or borrow the book. */
export function findLinks(w: Work) {
  const q = encodeURIComponent(`${w.ta} பாலகுமாரன்`);
  const qe = encodeURIComponent(`${w.en ?? w.ta} Balakumaran`);
  return [
    { label: "Amazon / Kindle", href: `https://www.amazon.in/s?k=${q}` },
    { label: "Google Books", href: `https://www.google.com/search?tbm=bks&q=${q}` },
    { label: "Panuval", href: `https://www.panuval.com/index.php?route=product/search&search=${q}` },
    { label: "Goodreads", href: `https://www.goodreads.com/search?q=${qe}` },
  ];
}
