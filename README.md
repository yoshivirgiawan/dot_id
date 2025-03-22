# NestJS API with Posts and Comments

Aplikasi ini adalah contoh implementasi API menggunakan NestJS yang mengambil data dari [JSONPlaceholder](https://jsonplaceholder.typicode.com/) dan menyimpannya ke database MySQl. Aplikasi ini mencakup fitur-fitur seperti:
- Fetch dan simpan data posts dan comments dari API eksternal.
- Menyimpan data ke database menggunakan TypeORM.
- Menggunakan cache untuk meningkatkan performa.
- Autentikasi menggunakan JWT untuk mengakses endpoint tertentu.

---

## Struktur Kode

Berikut adalah struktur folder dan file utama dalam proyek ini:

```
src/
├── auth/                        # Modul untuk autentikasi
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
├── common/                      # Folder untuk interceptors dan filters global
│   ├── filters/
│   ├── interceptors/
├── modules/
│   ├── comment/                 # Modul untuk komentar
│   │   ├── comment.controller.ts
│   │   ├── comment.service.ts
│   │   ├── comment.module.ts
│   │   ├── comment.entity.ts
│   ├── post/                    # Modul untuk posts
│   │   ├── post.controller.ts
│   │   ├── post.service.ts
│   │   ├── post.module.ts
│   │   │── post.entity.ts
│   ├── user/                    # Modul untuk user (jika diperlukan)
├── main.ts                      # File entry point aplikasi
```

---

## Fitur

1. **Posts**:
   - Fetch data posts dari API eksternal dan simpan ke database.
   - Dapatkan semua posts atau posts berdasarkan ID.
   - Buat, update, patch, dan hapus posts.
   - Dapatkan posts berdasarkan ID user yang sedang login.

2. **Comments**:
   - Fetch data comments dari API eksternal dan simpan ke database.
   - Dapatkan semua comments atau comments berdasarkan ID post.

3. **Autentikasi**:
   - Login dan dapatkan token JWT.
   - Endpoint tertentu dilindungi oleh JWT Guard.

4. **Caching**:
   - Menggunakan cache untuk menyimpan data posts sementara.

---

## Instalasi

### Prasyarat
- Node.js (versi 16 atau lebih baru)
- MySQL
- NestJS CLI (opsional)

### Langkah-langkah

1. **Clone Repository**:
   ```bash
   git clone https://github.com/username/nestjs-api.git
   cd nestjs-api
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Database**:
   - Buat database MySQL baru.
   - Update konfigurasi database di file `.env` atau `ormconfig.json`:
     ```env
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     DB_DATABASE=nestjs_api
     ```

4. **Jalankan Aplikasi**:
   ```bash
   npm run start
   ```

5. **Akses Aplikasi**:
   - Aplikasi akan berjalan di `http://localhost:4000`.

6. **Fetch User**:
   ```bash
   {{base_url}}/users/fetch
   ```

7. **Fetch Post & Comment**:
   ```bash
   {{base_url}}/posts/fetch
   ```

---

## Endpoint API

### Posts
- **GET `/posts`**: Dapatkan posts berdasarkan ID user yang sedang login (dilindungi oleh JWT).
- **GET `/posts/fetch`**: Fetch dan simpan post dari API eksternal.
- **GET `/posts/:id`**: Dapatkan post berdasarkan ID.
- **POST `/posts`**: Buat post baru.
- **PUT `/posts/:id`**: Update post berdasarkan ID.
- **PATCH `/posts/:id`**: Patch post berdasarkan ID.
- **DELETE `/posts/:id`**: Hapus post berdasarkan ID.

### Users
- **POST `/users/fetch`**: Fetch dan simpan users dari API eksternal.

### Comments
- **POST `/comments/fetch`**: Fetch dan simpan comments dari API eksternal.

### Autentikasi
- **POST `/auth/login`**: Login dan dapatkan token JWT.

---

## Cara Menggunakan

1. **Login**:
   - Kirim request ke `POST /auth/login` dengan body:
     ```json
     {
       "email": "your_email"
     }
     ```
   - Anda akan mendapatkan token JWT.

2. **Akses Endpoint yang Dilindungi**:
   - Gunakan token JWT yang didapatkan untuk mengakses endpoint yang dilindungi (misalnya, `GET /posts`).
   - Tambahkan header `Authorization: Bearer your_jwt_token` di request.

3. **Fetch Data dari API Eksternal**:
   - Kirim request ke `POST /posts/fetch` untuk fetch dan simpan data posts dan comments dari API eksternal.

---

## Environment Variables

Berikut adalah variabel lingkungan yang diperlukan:

| Variabel         | Deskripsi                          | Contoh Value        |
|------------------|------------------------------------|---------------------|
| `DB_HOST`        | Host database MySQL           | `localhost`         |
| `DB_PORT`        | Port database MySQL           | `5432`              |
| `DB_USERNAME`    | Username database MySQL       | `your_username`     |
| `DB_PASSWORD`    | Password database MySQL       | `your_password`     |
| `DB_DATABASE`    | Nama database MySQL           | `nestjs_api`        |
| `JWT_SECRET`     | Secret key untuk JWT               | `your_secret_key`   |
| `JWT_TTL` | Durasi kedaluwarsa token JWT        | `1h`                |
