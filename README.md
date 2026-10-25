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
features/
  auth/        api/ states/ pages/ layouts/     login, token, data pengguna
  mahasiswa/   api/ states/ pages/              rekap + tambah mahasiswa
  pelanggaran/ api/ states/ pages/              catat dan riwayat pelanggaran
  demerit/     api/ states/                     demerit + ringkasan kartu
  sanksos/     api/ states/ pages/              request dan proses Sanksos
  karma/       layouts/ components/ pages/      layout utama, sidebar, navbar, dashboard
helpers/       apiHelper, toolsHelper, dataHelper
hooks/         useInput
store.js       Redux store
```
