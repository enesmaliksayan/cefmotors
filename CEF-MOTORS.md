# CEF MOTORS — Oto Galeri Yönetim Sistemi

## Genel Bakış

İki Next.js uygulamasından oluşan monorepo:
- **apps/web** (port 3000) — Halka açık araç vitrini
- **apps/admin** (port 3001) — Admin paneli (CRUD, yönetim)
- **packages/database** — Paylaşılan Prisma şeması + seed

---

## Dizin Yapısı

```
cef/
├── .env                          # Kök env (reference amaçlı)
├── package.json                  # npm workspaces
├── apps/
│   ├── admin/                    # Admin paneli (Next.js, port 3001)
│   │   ├── .env                  # DATABASE_URL, JWT_SECRET, ADMIN_*
│   │   ├── next.config.ts
│   │   ├── public/uploads/       # Yüklenen resimlerin durduğu yer
│   │   └── src/
│   │       ├── proxy.ts          # Auth middleware (JWT)
│   │       ├── lib/auth.ts       # JWT helper'ları
│   │       ├── components/
│   │       │   ├── AdminLayout.tsx   # Sidebar + header layout
│   │       │   └── CarForm.tsx       # Araç ekleme/düzenleme formu
│   │       └── app/
│   │           ├── globals.css       # Dark/light tema
│   │           ├── layout.tsx
│   │           ├── page.tsx          # / → /dashboard yönlendirme
│   │           ├── login/
│   │           ├── dashboard/
│   │           ├── cars/             # cars/new, cars/[id], cars/[id]/edit, cars/[id]/images
│   │           ├── messages/
│   │           ├── team/
│   │           ├── settings/
│   │           └── api/              # auth/, cars/, messages/, settings/, team/, upload/
│   └── web/                      # Halka açık site (Next.js, port 3000)
│       ├── .env                  # Aynı env değerleri
│       ├── next.config.ts         # /uploads/* → localhost:3001 rewrite
│       └── src/
│           ├── app/
│           │   ├── globals.css    # Aynı tema + noise overlay
│           │   ├── layout.tsx     # Header + Footer + ThemeProvider
│           │   ├── page.tsx       # Anasayfa (hero, featured araçlar, CTA)
│           │   ├── cars/          # cars/page, cars/[id]/page
│           │   ├── about/
│           │   ├── contact/
│           │   └── api/           # cars/, contact/, settings/, team/
│           └── components/
│               ├── Header.tsx
│               ├── Footer.tsx
│               ├── Map.tsx        # Leaflet harita
│               └── ThemeProvider.tsx  # Dark/light context
└── packages/
    ├── database/
    │   ├── prisma/schema.prisma   # 6 model: Car, CarImage, CarVideo, ContactMessage, Gallery, TeamMember, AdminUser
    │   └── src/
    │       ├── index.ts           # PrismaClient singleton
    │       └── seed.ts
    └── prisma/
        └── dev.db                 # SQLite veritabanı
```

---

## Teknolojiler

| Teknoloji | Sürüm | Not |
|-----------|-------|-----|
| Next.js | 16.2.7 | App Router |
| React | 19.2.4 | |
| TypeScript | 5.7 | |
| Tailwind CSS | v4 | |
| Prisma | 6.19.3 | PostgreSQL |
| bcryptjs | 3.0.3 | Şifre hash |
| jsonwebtoken | 9.0.3 | JWT auth |
| Leaflet | 1.9.4 | Harita |
| Lucide React | 1.17 | İkonlar |
| Framer Motion | 12.40 | Animasyon (şu an aktif kullanımı yok) |

---

## Veritabanı Modelleri

### Gallery (galeri ayarları)
| Alan | Tip | Varsayılan |
|------|-----|-----------|
| id | Int (PK) | autoincrement |
| name | String | "CEF MOTORS" |
| address | String | "" |
| phone | String | "" |
| email | String | "" |
| workingHours | String | "" |
| about | String | "" |
| logoUrl | String? | null |
| mapsUrl | String? | null |
| latitude | Float? | null |
| longitude | Float? | null |
| teamMembers | TeamMember[] | relation |

### TeamMember (ekip üyesi)
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | Int (PK) | |
| galleryId | Int | FK → Gallery (cascade) |
| name | String | |
| title | String | |
| photo | String? | |
| phone | String? | |
| email | String? | |
| order | Int | sıralama |

### Car (araç)
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | Int (PK) | |
| brand, model | String | Marka/model |
| year | Int | |
| price | Float | |
| currency | String | "TL", "USD", "EUR" |
| mileage | Int? | km |
| fuelType | String? | Benzin/Dizel/Hibrit/Elektrik/LPG |
| transmission | String? | Manuel/Otomatik/Yari Otomatik |
| color | String? | |
| enginePower | String? | |
| description | String | |
| status | String | "available", "reserved", "sold" |
| isFeatured | Boolean | Öne çıkan |
| isPublished | Boolean | Yayında mı |
| publishedAt | DateTime? | İlk yayın tarihi |
| images | CarImage[] | relation (cascade) |
| videos | CarVideo[] | relation (cascade) |
| contactMessages | ContactMessage[] | relation (set null) |

### CarImage (araç resmi)
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | Int (PK) | |
| carId | Int | FK → Car |
| url | String | "/uploads/{dosya}" |
| isPrimary | Boolean | Kapak fotoğrafı |
| order | Int | sıralama |

### CarVideo (araç videosu)
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | Int (PK) | |
| carId | Int | FK → Car |
| url | String | YouTube/Vimeo linki |
| title | String? | |

### ContactMessage (iletişim mesajı)
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | Int (PK) | |
| name, email, phone | String | Gönderen bilgisi |
| message | String | |
| carId | Int? | FK → Car (null olabilir) |
| carBrand, carModel | String? | Denormalize araç bilgisi |
| isRead | Boolean | Admin tarafından okundu mu |
| createdAt | DateTime | |

### AdminUser (admin kullanıcısı)
| Alan | Tip |
|------|-----|
| id | Int (PK) |
| username | String (unique) |
| passwordHash | String (bcrypt) |

---

## API Endpoints

### Admin (port 3001)

| Yöntem | Route | Auth | Ne işe yarar |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | Hayır | Giriş, JWT cookie döner |
| GET | `/api/auth/login` | Hayır | Çıkış, cookie'yi temizler |
| GET | `/api/auth/verify` | Hayır | Token doğrulama |
| GET | `/api/cars` | Evet | Tüm araçları listeler |
| POST | `/api/cars` | Evet | Araç oluşturur (isPublished=true ise publishedAt atar) |
| GET | `/api/cars/stats` | Evet | Dashboard istatistikleri |
| GET | `/api/cars/[id]` | Evet | Tek araç (resimler+videolar) |
| PUT | `/api/cars/[id]` | Evet | Araç günceller (publishedAt yönetimi) |
| DELETE | `/api/cars/[id]` | Evet | Araç siler |
| GET | `/api/messages` | Evet | Tüm mesajlar |
| POST | `/api/messages` | Hayır | Mesaj oluşturur |
| PATCH | `/api/messages/[id]` | Evet | Okundu işaretler |
| DELETE | `/api/messages/[id]` | Evet | Mesaj siler |
| GET/PUT | `/api/settings` | Evet | Galeri ayarları |
| GET/POST | `/api/team` | Evet | Ekip üyeleri |
| PUT/DELETE | `/api/team/[id]` | Evet | Tek ekip üyesi |
| POST | `/api/upload` | Evet | Resim yükler (multipart: file + carId) |
| DELETE | `/api/upload/[id]` | Evet | Resim siler |
| PATCH | `/api/upload/[id]` | Evet | Resmi kapak yapar |

### Web (port 3000)

| Yöntem | Route | Ne işe yarar |
|--------|-------|-------------|
| GET | `/api/cars` | Yayındaki araçlar (filtre+arama+sıralama) |
| GET | `/api/cars/featured` | Öne çıkan araçlar (max 6) |
| GET | `/api/cars/[id]` | Tek araç (sadece yayındakiler) |
| POST | `/api/contact` | İletişim mesajı gönder |
| GET | `/api/settings` | Galeri bilgileri |
| GET | `/api/team` | Ekip üyeleri |

---

## Auth Mekanizması

### Giriş
1. `/login` → username/password POST → `/api/auth/login`
2. Sunucu bcrypt ile doğrular, JWT imzalar (24h)
3. `Set-Cookie: token=<jwt>; HttpOnly; Path=/; SameSite=Strict`
4. Frontend `/dashboard`'a yönlendirir

### Middleware (proxy.ts)
- **Dosya adı** `proxy.ts`, `middleware.ts` değil → **Next.js middleware olarak çalışmaz**
- Auth sadece admin API route'larında token kontrolü ile yapılır
- Public rotalar: `/login`, `/api/auth/login`, `/api/auth/verify`

### Client-side kontrol
- `AdminLayout.tsx` mount olunca `/api/auth/verify` çağırır
- Token yoksa `/login`'e yönlendirir

### Çıkış
- `GET /api/auth/login` → cookie temizlenir → `/login`'e yönlendirilir

---

## Resim Yükleme Sistemi

### Upload akışı
1. Admin `/cars/[id]/images` sayfasında dosya seçer
2. `FormData` (file + carId) → `POST /api/upload`
3. Sunucu: `apps/admin/public/uploads/{carId}-{timestamp}.{ext}` yazar
4. `CarImage` kaydı oluşturur (ilk resimse `isPrimary: true`)
5. Frontend galeriyi yeniler

### Resimlerin web'de gösterimi
- `apps/web/next.config.ts`:
  ```ts
  async rewrites() {
    return [{ source: '/uploads/:path*', destination: 'http://localhost:3001/uploads/:path*' }]
  }
  ```
- Geliştirmede **her iki sunucu da çalışıyor olmalı** (port 3000 + 3001)

### Primary (kapak) resim
- `PATCH /api/upload/[id]` → tüm resimlerin `isPrimary=false` yapar, hedef resmin `isPrimary=true` yapar

### Resim silme
- Önce dosyayı diskten siler (hata yutulur), sonra DB kaydını siler

### Placeholder
- Resim yoksa `/placeholder-car.svg` gösterilir

---

## Tema Sistemi

- CSS class: `<html class="light">` kontrolü ile dark/light
- Varsayılan: dark tema
- CSS değişkenleri (`--bg`, `--bg-card`, `--text`, `--gold`, `--accent` vb.)
- `ThemeProvider.tsx` localStorage'a kaydeder, context ile dağıtır
- `globals.css`'de `html:not(.light)` dark, `html.light` light tema

---

## Sayfalar

### Admin (port 3001)

| Route | İçerik |
|-------|--------|
| `/login` | Giriş formu |
| `/dashboard` | İstatistik kartları (toplam araç, yayındaki, satılan, okunmamış mesaj) |
| `/cars` | Araç listesi tablosu (arama, publish toggle, sil, düzenle) |
| `/cars/new` | Yeni araç formu |
| `/cars/[id]` | Araç detayı (fotoğraf, özellikler, video) |
| `/cars/[id]/edit` | Araç düzenleme formu |
| `/cars/[id]/images` | Resim/video yönetimi |
| `/messages` | Gelen mesaj kutusu (okundu/okunmamış) |
| `/team` | Ekip yönetimi |
| `/settings` | Galeri ayarları (adres, telefon, harita koordinatları) |

### Web (port 3000)

| Route | İçerik |
|-------|--------|
| `/` | Anasayfa (hero, öne çıkan araçlar, CTA) |
| `/cars` | Araç listesi (filtre, sıralama, arama) |
| `/cars/[id]` | Araç detayı (galeri, özellikler, iletişim formu) |
| `/about` | Hakkımızda + ekip |
| `/contact` | İletişim formu + Leaflet harita + Google Maps linki |

---

## Önemli İş Kuralları

1. **publishedAt**: İlk yayınlandığında atanır, tekrar yayınlarsan değişmez. Yayından kaldırınca `null` olur.
2. **publishedAt = null**: Sadece `isPublished = false` yapılınca.
3. **Sadece yayındaki araçlar** web'de görünür (API'ler `where: { isPublished: true }` ile sorgular).
4. **Featured (öne çıkan)**: Web anasayfada max 6 araç gösterilir.
5. **Mesajlar**: Web'deki iletişim formları `POST /api/contact` ile admin veritabanına yazar (admin API'sine proxy yok, doğrudan DB'ye yazar).
6. **Araba durumları**: `available` (Satista), `reserved` (Rezerve), `sold` (Satildi)
7. **Yakıt tipleri**: Benzin, Dizel, Hibrit, Elektrik, LPG
8. **Şanzıman**: Manuel, Otomatik, Yari Otomatik

---

## Seed Verisi

```json
AdminUser: { username: "admin", password: "cefadmin2026" }

Gallery: {
  name: "CEF MOTORS",
  address: "Cumhuriyet Mahallesi, 52. Sk. No:4, 34906 Büyükçekmece/İstanbul",
  phone: "+90 (212) 555 01 23",
  email: "info@cefmotors.com",
  workingHours: "Hafta içi 09:00 - 19:00 / Cumartesi 10:00 - 17:00",
  mapsUrl: "https://maps.google.com/?q=41.0754783,28.9722343",
  latitude: 41.0754783,
  longitude: 28.9722343
}

Team: [
  { name: "Ahmet Yılmaz", title: "Genel Müdür", phone: "+90 532 111 22 33", email: "ahmet@cefmotors.com", order: 0 },
  { name: "Mehmet Demir", title: "Satış Danışmanı", phone: "+90 533 222 33 44", email: "mehmet@cefmotors.com", order: 1 },
  { name: "Ayşe Kaya", title: "Pazarlama Uzmanı", phone: "+90 534 333 44 55", email: "ayse@cefmotors.com", order: 2 }
]
```

---

## Ortam Değişkenleri

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cef_motors?schema=public"
JWT_SECRET="cef-motors-super-secret-key-change-in-production"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="cefadmin2026"
```

`.env` dosyası **hem `apps/admin/` hem de `apps/web/` dizininde** bulunmalıdır çünkü Next.js `.env`'yi kendi proje kökünden okur.

---

## Çalıştırma

```bash
# Geliştirme (iki uygulama paralel)
npm run dev

# Tek uygulama
npm run dev:web     # port 3000
npm run dev:admin   # port 3001

# Veritabanı
npm run db:push     # şema değişikliklerini uygula
npm run db:seed     # seed verisini yükle
npm run db:generate # Prisma Client'ı yeniden oluştur

# Build
npm run build       # database → web → admin sırasıyla
```

---

## Önemli Notlar / Gotchas

### Middleware çalışmıyor
`apps/admin/src/proxy.ts` dosyası `middleware.ts` değil, `proxy.ts`. Next.js sadece `middleware.ts`/`.js` dosyasını middleware olarak tanır. Bu nedenle middleware **çalışmaz**. Auth sadece API route'larında token kontrolü ile yapılır. Sayfalar sadece client-side'da `AdminLayout` mount olunca kontrol edilir.

### .env dosyası
Next.js kendi proje kökündeki `.env`'yi okur. Monorepo kökündeki `.env`'yi okumaz. Bu yüzden `apps/admin/.env` ve `apps/web/.env` ayrı ayrı olmalıdır.

### Dosya yolu
Windows'da `writeFile`'a verilen yolun doğru olduğundan emin olun. Resimler `apps/admin/public/uploads/` altına yazılır.

### Web'de resimler
Geliştirmede çalışması için hem web (3000) hem admin (3001) çalışıyor olmalıdır. Next.js rewrite `/uploads/*` → `http://localhost:3001/uploads/*` yapar.

### PostgreSQL gereksinimleri
Production'da PostgreSQL kullanılır. Geliştirmede de PostgreSQL çalışıyor olmalıdır. Bağlantı ayarları `.env`'deki `DATABASE_URL` üzerinden yapılır.

### `publishedAt` yönetimi
- `POST /api/cars`: `isPublished: true` gelirse `new Date()` atanır
- `PUT /api/cars/[id]`: `isPublished: true` ve `publishedAt` null ise `new Date()` atanır; `isPublished: false` gelirse `publishedAt` null yapılır
- Frontend publish toggle yapınca bu mantık otomatik çalışır

### Prisma generate hatası
"EPERM: operation not permitted" hatası alınırsa:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
npx prisma generate
```

---

## Production Deployment

1. **Storage**: Yerel disk → S3/B2/R2 (dosyaları object storage'a taşı, upload API'lerini güncelle)
2. **Deploy**: Vercel (her app ayrı project, root directory: `apps/web` ve `apps/admin`) veya Docker + VPS
3. **Security**: `JWT_SECRET` güçlü rastgele anahtar ile değiştir, `ADMIN_PASSWORD` değiştir
4. **Rewrite**: Web'deki `/uploads/*` rewritelarını production'da CDN/object storage URL'ine yönlendir
5. **PostgreSQL**: Sunucuda PostgreSQL çalışıyor olmalı, `DATABASE_URL` bağlantı bilgileriyle güncellenmeli
