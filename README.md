# QuickTools

Free online tools for everyday file tasks — fast, private, and open source. Everything runs in your browser. No uploads, no accounts, no tracking.

**Live demo:** https://plaintools.vercel.app/en

---

## Tools

- **Image Compressor** — Reduce JPG, PNG, and WebP file sizes with an adjustable quality slider. The output updates live as you move the slider. Before/after sizes shown instantly.
- **QR Code Generator** — Turn any URL or text into a scannable QR code. Free users get the classic square style. Unlock rounded and stylized dot patterns by watching a short ad. Download as PNG or SVG.
- **PDF ↔ Image** — Two tools in one. Convert every page of a PDF to high-resolution JPGs (download individually or as a ZIP), or assemble multiple images into a single PDF.

---

## Tech stack

| | |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) — App Router, TypeScript |
| Styles | [Tailwind CSS](https://tailwindcss.com) |
| Image compression | [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) |
| QR codes | [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) |
| PDF rendering | [pdf.js](https://mozilla.github.io/pdf.js/) |
| PDF creation | [jsPDF](https://github.com/parallax/jsPDF) |
| ZIP packaging | [JSZip](https://stuk.github.io/jszip/) |

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The middleware will redirect you to `/en` or `/fr` based on your browser language.

> `npm run dev` copies the pdf.js worker to `public/` automatically. The file is listed in `.gitignore` — if it goes missing, run `npm run copy-worker` manually.

---

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sentyrion119/GALAXY)

No environment variables are required for core functionality. To enable analytics, add `NEXT_PUBLIC_GA_ID` or `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in your Vercel project settings (see `.env.example`).

---

## License

[MIT](./LICENSE)
