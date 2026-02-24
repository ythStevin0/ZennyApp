# Zenny App — Expo Go (React Native)

Aplikasi pengelola keuangan mobile offline berbasis Expo Go.

## 📁 Struktur Folder

```
ZennyApp/
├── App.tsx                  # Entry point utama
├── index.js                 # Register root component
├── app.json                 # Konfigurasi Expo
├── babel.config.js
├── package.json
├── tsconfig.json
└── src/
    ├── components/
    │   ├── Layout.tsx        # Bottom navigation
    │   ├── Dashboard.tsx     # Halaman utama
    │   ├── AddTransaction.tsx
    │   ├── SmartView.tsx     # Grafik & heatmap
    │   ├── Goals.tsx
    │   ├── AddGoal.tsx
    │   ├── Reminder.tsx
    │   ├── AddReminder.tsx
    │   └── Profile.tsx
    ├── hooks/
    │   ├── useTransactions.ts
    │   ├── useGoals.ts
    │   └── useReminders.ts
    ├── types/
    │   └── index.ts
    └── utils/
        ├── index.ts
        └── colors.ts
```

## 🚀 Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan
npx expo start

# 3. Scan QR di Expo Go (HP & laptop harus 1 WiFi)
```

Jika error saat install:
```bash
npm install --legacy-peer-deps
```
