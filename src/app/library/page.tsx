import { Suspense } from "react";
import LibraryBrowser from "@/components/LibraryBrowser";

export const metadata = { title: "நூலகம் — பாலகுமாரன்" };

export default function LibraryPage() {
  return (
    <Suspense>
      <LibraryBrowser />
    </Suspense>
  );
}
