# KARMA Frontend - Kartu Asrama Mahasiswa

Aplikasi web untuk sistem demerit asrama. API ada di repo terpisah: **karma-backend**.

## Teknologi
ReactJS (React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router, SweetAlert2, Vitest + Testing Library)

## Menjalankan
Jalankan **karma-backend** lebih dulu (default `http://localhost:3000`), lalu:
```bash
npm install
npm run dev        # http://localhost:5173 (request /api diteruskan ke :3000)
```

## Build produksi
```bash
cp .env.example .env     # isi VITE_API_BASE_URL dengan alamat API produksi
npm run build            # hasil di dist/
```
Variabel `VITE_*` ditanam saat build, jadi isi **sebelum** `npm run build`.
Di backend, set `CORS_ORIGIN` ke domain front-end ini.

## Tes
```bash
npm test
npm run test:coverage
```

## Environment variable
| Variabel | Fungsi | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Alamat API backend | `/api` |

## Struktur (`src`)
```
components/    komponen UI bersama (FormField, AsramaSelect, PhotoField, ErrorBoundary)
constants/     asrama, roles, sanksos, upload
features/
  auth/        api/ states/ pages/ layouts/
  mahasiswa/   api/ states/ components/ pages/
  pelanggaran/ api/ states/ pages/
  demerit/     api/ states/
  sanksos/     api/ states/ components/ pages/
  asrama/      api/ states/ pages/
  profil/      pages/
  karma/       layouts/ components/ pages/
helpers/       apiHelper, toolsHelper, dataHelper, fileHelper, validationHelper
hooks/         useInput, usePhotoUpload
tests/         setupTests, test-utils
store.js       Redux store
```
Backend ada di repo terpisah (`karma-backend`).
