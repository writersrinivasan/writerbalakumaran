// Simple Tamil → Latin transliteration, used for URL slugs and English-keyboard search.

const VOWELS: Record<string, string> = {
  "அ": "a", "ஆ": "aa", "இ": "i", "ஈ": "ee", "உ": "u", "ஊ": "oo",
  "எ": "e", "ஏ": "ae", "ஐ": "ai", "ஒ": "o", "ஓ": "oa", "ஔ": "au",
};

const CONSONANTS: Record<string, string> = {
  "க": "k", "ங": "ng", "ச": "s", "ஞ": "nj", "ட": "d", "ண": "n",
  "த": "th", "ந": "n", "ப": "p", "ம": "m", "ய": "y", "ர": "r",
  "ல": "l", "வ": "v", "ழ": "zh", "ள": "l", "ற": "r", "ன": "n",
  "ஜ": "j", "ஷ": "sh", "ஸ": "s", "ஹ": "h", "ஶ": "sh",
};

const SIGNS: Record<string, string> = {
  "ா": "aa", "ி": "i", "ீ": "ee", "ு": "u", "ூ": "oo", "ெ": "e",
  "ே": "ae", "ை": "ai", "ொ": "o", "ோ": "oa", "ௌ": "au", "்": "",
};

export function transliterate(input: string): string {
  let out = "";
  const chars = [...input];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (VOWELS[c]) {
      out += VOWELS[c];
    } else if (CONSONANTS[c]) {
      const next = chars[i + 1];
      out += CONSONANTS[c];
      if (next !== undefined && next in SIGNS) {
        out += SIGNS[next];
        i++;
      } else {
        out += "a";
      }
    } else if (c === "ஃ") {
      out += "h";
    } else {
      out += c;
    }
  }
  return out;
}

export function slugify(tamil: string): string {
  return transliterate(tamil)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Loose key for fuzzy search: collapses long vowels and similar sounds. */
export function searchKey(s: string): string {
  return transliterate(s)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/aa/g, "a").replace(/ee/g, "i").replace(/oo/g, "u")
    .replace(/ae/g, "e").replace(/oa/g, "o")
    .replace(/th/g, "t").replace(/zh/g, "l").replace(/sh/g, "s")
    .replace(/dh/g, "d").replace(/ch/g, "s").replace(/(.)\1+/g, "$1");
}
