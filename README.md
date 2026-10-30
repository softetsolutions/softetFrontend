# Softet Solutions

Vite + React frontend for the Softet marketing site.

### Getting Started

```bash
npm install
cp .env.example .env
# fill VITE_* values in .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Environment variables

See `.env.example`. On Vercel, set the same `VITE_*` keys for Production/Preview.

| Variable | Purpose |
|---|---|
| `VITE_EMAILJS_*` | Contact form |

ReportET product lives at [https://reportet.softetsolutions.com/](https://reportet.softetsolutions.com/) (header CTA).

### Scripts

```bash
npm run lint
npm run build
npm run preview
```

### Notes for go-live

- Industrial training routes are paused and redirect to `/`.

Created and maintained by [Softet Solutions](https://softetsolutions.com/).
