"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  if (usePathname().startsWith("/read/")) return null;
  return (
    <footer className="border-t border-line py-8 text-center text-sm text-muted px-4">
      <p className="font-display text-base text-ink">எழுத்துச் சித்தர் பாலகுமாரன் (1946 – 2018)</p>
      <p className="mt-1">
        தனிப்பட்ட வாசிப்புக்கான நூலகம். நூல்களின் பதிப்புரிமை அவரது குடும்பத்துக்கும் பதிப்பாளர்களுக்கும் உரியது — வாங்கி வாசித்து ஆதரியுங்கள்.
      </p>
    </footer>
  );
}
