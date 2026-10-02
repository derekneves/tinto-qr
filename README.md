# QR Art ◫

**Beautiful, artistic QR codes. Not boring black squares.**

Generate stunning, customizable QR codes in your browser. Free, instant, no signup.

🔗 **Live**: *coming soon*

---

## Features

- 🎨 **12 curated style presets** — Midnight, Sunset, Ocean, Neon, and more
- 🔵 **6 dot shapes** — rounded, dots, classy, soft, square, extra-rounded
- 🎯 **3 corner styles** — rounded, circle, square
- 🌈 **Full color control** — dots, background, corners, corner dots
- 📐 **Gradient support** — linear gradients on QR dots
- 🖼️ **Center logo** — upload any image as a center logo
- 📏 **Adjustable size** — 200px to 1200px
- 🛡️ **Error correction** — L, M, Q, H levels
- 📥 **Download as PNG or SVG**
- 📋 **Copy to clipboard** — one click
- ⌨️ **Cmd+S** to quick-download
- 📱 **Responsive** — works on mobile
- ⚡ **Client-side only** — your data never leaves your browser

## Tech Stack

- Vanilla JS + [qr-code-styling](https://github.com/nichochar/qr-code-styling)
- [Vite](https://vitejs.dev) for dev/build
- Zero frameworks, zero backend, zero tracking
- Total build: **~58KB gzipped**

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # → dist/
```

## Deploy

Static site — deploy `dist/` anywhere:
- **Cloudflare Pages**: `npm run build` → output `dist`
- **Vercel**: framework `Vite`, output `dist`
- **Netlify**: build command `npm run build`, publish `dist`

## License

MIT
