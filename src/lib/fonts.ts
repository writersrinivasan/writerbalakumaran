import { Anek_Tamil, Arima, Catamaran, Hind_Madurai, Mukta_Malar, Noto_Sans_Tamil, Noto_Serif_Tamil, Tiro_Tamil } from "next/font/google";

export const notoSerif = Noto_Serif_Tamil({ subsets: ["tamil", "latin"], variable: "--font-noto-serif", display: "swap" });
export const notoSans = Noto_Sans_Tamil({ subsets: ["tamil", "latin"], variable: "--font-noto-sans", display: "swap", preload: false });
export const mukta = Mukta_Malar({ subsets: ["tamil", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-mukta", display: "swap" });
export const arima = Arima({ subsets: ["tamil", "latin"], variable: "--font-arima", display: "swap" });
export const tiro = Tiro_Tamil({ subsets: ["tamil", "latin"], weight: "400", style: ["normal", "italic"], variable: "--font-tiro", display: "swap", preload: false });
export const hind = Hind_Madurai({ subsets: ["tamil", "latin"], weight: ["400", "600"], variable: "--font-hind", display: "swap", preload: false });
export const anek = Anek_Tamil({ subsets: ["tamil", "latin"], variable: "--font-anek", display: "swap", preload: false });
export const catamaran = Catamaran({ subsets: ["tamil", "latin"], variable: "--font-catamaran", display: "swap", preload: false });

export const fontVariables = [notoSerif, notoSans, mukta, arima, tiro, hind, anek, catamaran].map((f) => f.variable).join(" ");
