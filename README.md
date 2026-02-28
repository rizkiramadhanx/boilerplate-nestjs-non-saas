# Kubik Boilerplate — Backend Nestjs

Backend **NestJS** untuk aplikasi toko emas (Kubix). Menggunakan **PostgreSQL** dengan **TypeORM**, autentikasi JWT, sistem role & permission, serta modul produk, kategori, user, dan outlet.

## Daftar Isi

- [Fitur](#fitur)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Docker](#docker)
- [Testing](#testing)
- [Migrasi Database](#migrasi-database)
- [Dokumentasi API](#dokumentasi-api)
- [Lisensi](#lisensi)

## Fitur

- **Autentikasi**: Register, login, refresh token, verifikasi email
- **Autorisasi**: Role-based access dengan permission (user, product, category, role, dll.)
- **Modul**: Users, Products, Categories, Roles, Outlets
- **Database**: PostgreSQL + TypeORM (migrations)
- **Mailer**: Verifikasi email (Nodemailer + Handlebars)

## Persyaratan

- **Node.js** (v18+ disarankan)
- **PostgreSQL**
- **npm** atau **bun**

## Instalasi

1. Clone repository:

   ```bash
   git clone <url-repo>
   cd boilerplate-nestjs-saas
   ```

2. Pasang dependensi:

   ```bash
   npm install
   ```

3. Salin file env dan isi nilai yang sesuai:

   ```bash
   cp .env.example .env
   ```

## Konfigurasi

Buat file `.env` di root proyek. Contoh struktur (lihat `.env.example`):

```env
# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=kubix_db

# App
NODE_ENV=development
PORT=3000
FRONT_END_URL=http://localhost:5173

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

JWT_SECRET_REFRESH=your_jwt_refresh_secret
JWT_EXPIRES_IN_REFRESH=7d

# Mail (verifikasi email)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASS=
MAIL_FROM=noreply@example.com
```

## Menjalankan Aplikasi

- Development (watch mode):

  ```bash
  npm run start:dev
  ```

- Production:

  ```bash
  npm run build
  npm run start:prod
  ```

Aplikasi berjalan di `http://localhost:3000` (atau nilai `PORT` di `.env`).

## Docker

Compose hanya menjalankan aplikasi; database memakai yang sudah ada (atur `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` di `.env`).

Pastikan file `.env` sudah ada (salin dari `.env.example`) dan berisi koneksi database yang benar.

**Production:**

```bash
docker compose up -d
```

**Development (hot-reload):**

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

App berjalan di `http://localhost:4000`.

### Deploy ke VPS (GitHub Actions)

Set secret di repo: `HOST`, `USERNAME`, `PASSWORD`, `DEPLOY_PATH` (opsional: `PORT` untuk SSH).

**Kalau di VPS "gabisa", cek:**

1. **DEPLOY_PATH** — Harus path **absolut** ke folder repo di VPS, contoh: `/home/ubuntu/production/boilerplate-nestjs-non-saas`. Bukan path relatif seperti `production/app` kalau SSH tidak start di home.
2. **.env di VPS** — Di folder project harus ada file `.env` (DB_*, JWT_*, dll). Tanpa ini container bisa crash.
3. **Database dari container** — App jalan di Docker; `DB_HOST=localhost` di dalam container = container itu sendiri. Kalau database jalan di **VPS (host)**:
   - Linux: `DB_HOST=172.17.0.1` atau IP host.
   - Atau jalankan app tanpa Docker di VPS (`npm run start:prod`) dan DB_HOST=localhost boleh.
4. **Docker & sudo** — User SSH harus bisa jalankan `sudo docker compose` (user di grup `docker` atau sudoers).
5. **Port 4000** — Pastikan tidak dipakai proses lain; buka firewall: `sudo ufw allow 4000` (kalau pakai ufw).

Setelah deploy, kalau workflow gagal, buka run yang gagal → step **"Show logs on failure"** untuk lihat log container.

## Testing

- Menjalankan semua unit test:

  ```bash
  npm test
  ```

- Watch mode:

  ```bash
  npm run test:watch
  ```

- Coverage:

  ```bash
  npm run test:cov
  ```

- E2E:

  ```bash
  npm run test:e2e
  ```

## Migrasi Database

- Menjalankan migrasi:

  ```bash
  npm run migration:run
  ```

- Membuat migrasi baru:

  ```bash
  npm run migration:create -- src/migration/NamaMigrasi
  ```

- Generate migrasi dari perubahan entity:

  ```bash
  npm run migration:generate -- src/migration/NamaMigrasi
  ```

Panduan lengkap: [guide/migration.md](guide/migration.md).

## Dokumentasi API

Detail endpoint dan request/response ada di folder `docs/`:

| Modul      | File                                     | Deskripsi                                  |
| ---------- | ---------------------------------------- | ------------------------------------------ |
| Auth       | [docs/auth.md](docs/auth.md)             | Login, register, refresh, verifikasi email |
| Users      | [docs/users.md](docs/users.md)           | CRUD user, profile                         |
| Products   | [docs/products.md](docs/products.md)     | CRUD produk                                |
| Categories | [docs/categories.md](docs/categories.md) | CRUD kategori                              |
| Roles      | [docs/roles.md](docs/roles.md)           | Manajemen role & permission                |

## Scripts

| Perintah             | Keterangan         |
| -------------------- | ------------------ |
| `npm run start:dev`  | Dev server (watch) |
| `npm run build`      | Build production   |
| `npm run start:prod` | Jalankan build     |
| `npm test`           | Unit test          |
| `npm run lint`       | ESLint             |
| `npm run format`     | Prettier           |

## Lisensi

UNLICENSED (private).
