# பாலகுமாரன் நூலகம் — Balakumaran Library

A personal reading app dedicated to the Tamil writer Balakumaran (1946–2018).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
# or: npm run build && npm start
```

## What's inside

- **நூலகம் (Library)** — catalogue of 200+ works: historical epics, spiritual works, epics & puranas,
  social novels, short stories, essays & Q&A, autobiography, poetry. Search in Tamil or English letters.
- **அவரைப் பற்றி (About)** — timeline, awards, 23 films.
- **Reader** — Tamil fonts (Noto Serif Tamil, Tiro Tamil, Mukta Malar, Hind Madurai, Anek Tamil, Catamaran),
  paper / sepia / lotus / night themes, size & line-spacing, chapter list, remembers where you stopped.

## Adding the books

His works are still under copyright, so the app ships with no book text. Add your own copies:

- On a book's page: upload a file or paste text.
- **நூல் சேர் (Import)**: drop many files at once. They're matched to titles by file name, e.g. `udaiyar-1.epub` or `உடையார்.txt`.
- Supported: DRM-free EPUB, TXT, Markdown, HTML. Kindle books are DRM-locked and can't be imported.
- Lines like `அத்தியாயம் 1`, `பகுதி 2`, `# Title` become chapters.

Texts are stored only in your browser (IndexedDB). Use **என் அலமாரி → ஏற்றுமதி** to back them up or move them to another device.

Catalogue source: Tamil & English Wikipedia bibliographies. Edit `src/lib/works.ts` to add or correct titles.
