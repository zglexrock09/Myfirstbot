# WhatsApp Warmer Bot

Auto warmer WhatsApp dengan panel Telegram, AI Auto Text/PM, dan pairing device (tanpa scan QR).

## Fitur Utama

- Login WA via pairing code (bukan QR) — aman, mudah, anti-banned.
- Auto join group, auto chat grup, auto chat PM (random/AI).
- Kontrol penuh lewat Telegram: login, logout, status, auto-opsi dan pengaturan delay.
- Multi nomor WhatsApp, multi admin Telegram.
- Simpel DB berbasis file (lowdb) — bisa diupgrade ke Mongo/Redis.
- Anti-pattern, delay manusiawi, dan AI variation random untuk chat (minim banned).

## Instalasi
1. git clone ...
2. npm install
3. Copy .env.example menjadi .env lalu isi token Telegram & OpenAI API.
4. Jalankan: npm start
5. Jalankan semua perintah melalui Telegram bot Anda:

## Daftar Perintah Telegram

- /login 628xxxxxxxxx
- /logout 628xxxxxxxxx
- /status
- /autojoingc on/off
- /autochatgc on/off
- /setchatgc teks
- /autochatpm on/off
- /setchatpm teks1|teks2|...
- /setdelaygc detik
- /setdelaypm detik

> Catatan: Untuk pairing device, buka WhatsApp HP > Linked Devices > Link a Device > Pair with code.

---

## Tips Anti-Banned
- Jangan terlalu sering mass-message/group chat, gunakan delay > 30 detik.
- Gunakan variasi pesan (pakai AI, random, dsb).
- Jangan gunakan nomor utama WA pribadi untuk tes intens.