import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "பாலகுமாரன் நூலகம் — Balakumaran Library",
  description: "எழுத்துச் சித்தர் பாலகுமாரனின் படைப்புகளுக்கான தனிப்பட்ட வாசிப்பு நூலகம்",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0f0b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ta" className={`${fontVariables} h-full`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
