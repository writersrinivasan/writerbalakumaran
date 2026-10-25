"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "முகப்பு" },
  { href: "/library", label: "நூலகம்" },
  { href: "/my-shelf", label: "என் அலமாரி" },
  { href: "/import", label: "நூல் சேர்" },
  { href: "/about", label: "அவரைப் பற்றி" },
];

export default function Header() {
  const path = usePathname();
  if (path.startsWith("/read/")) return null;
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 font-display text-lg font-bold text-white shadow-md shadow-rose-500/30">
            பா
          </span>
          <span className="hidden sm:block font-display text-lg font-bold leading-none">
            பாலகுமாரன் <span className="text-gradient">நூலகம்</span>
          </span>
        </Link>
        <nav className="no-scrollbar ml-auto flex gap-1 overflow-x-auto text-[15px]">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow"
                    : "text-muted hover:bg-orange-100 hover:text-ink dark:hover:bg-white/10"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
