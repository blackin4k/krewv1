# Krew Music Ecosystem 🎵

Krew is a modern, full-stack music streaming platform designed for artists and listeners. It features a robust backend API, a versatile cross-platform mobile and desktop application, and a dedicated promotional site.

## 🚀 Project Overview

The Krew ecosystem consists of three main components:
- **[Krew Backend](file:///Ubuntu-24.04/home/amaanthegoat/krewv1/krew_backend)**: A high-performance Flask API handling audio processing, metadata extraction, and real-time synchronization.
- **[Krew Mobile/Desktop](file:///Ubuntu-24.04/home/amaanthegoat/krewv1/krew-mobile-cap)**: A premium React-based application powered by Capacitor (Android) and Electron (Desktop).
- **[Krew Promo Site](file:///Ubuntu-24.04/home/amaanthegoat/krewv1/krew-promo-site)**: A dedicated promotional landing page for the platform.

---

## ✨ Key Features

- **Artist Hub**: Seamless audio uploads with automatic metadata extraction (ID3/FLAC) using Mutagen.
- **Hybrid Storage**: Intelligent audio management with local caching and background synchronization to **Cloudflare R2**.
- **Smart Queueing**: Advanced "vibe-based" autoplay logic that suggests similar tracks instantly.
- **Interactive UX**: Premium player experience with drag-and-drop queue management and micro-animations.
- **Real-time Engine**: Socket.io integration for instant updates and collaborative features.
- **Cross-Platform**: Unified codebase for Android (Capacitor), Desktop (Electron), and Web (Vite).
- **Analytics Dashboard**: Detailed user listening stats, top genres, and artist performance tracking.

---

## 🛠 Tech Stack

### Backend (`/krew_backend`)
- **Core**: Python, Flask
- **Database**: PostgreSQL (Production) / SQLite (Development) with SQLAlchemy
- **Security**: JWT Authentication, Bcrypt hashing, Flask-Limiter
- **Storage**: Cloudflare R2 (S3-compatible) via Boto3
- **DevOps**: Gevent for concurrency, python-dotenv for config

### Mobile & Desktop (`/krew-mobile-cap`)
- **Framework**: React 18, Vite, TypeScript
- **Runtime**: Capacitor 6 (Mobile), Electron (Desktop)
- **Styling**: Tailwind CSS, Radix UI (shadcn/ui), Framer Motion
- **State Management**: Zustand, TanStack Query (React Query)
- **Networking**: Axios, Socket.io-client
- **Media**: Capacitor Music Controls Plugin (native notification controls)

---

## 📁 Project Structure

```text
krewv1/
├── krew_backend/        # Flask API, Models, and background workers
├── krew-mobile-cap/     # React frontend (Vite + Capacitor + Electron)
├── krew-promo-site/    # Promotional website
├── demo pages.../       # Design assets and mockups
└── README.md            # This file
```

---

## 🚦 Getting Started

### Backend Setup
1. Navigate to `krew_backend`.
2. Create a virtual environment: `python -m venv venv`.
3. Install dependencies: `pip install -r requirements.txt`.
4. Configure `.env` with `DATABASE_URL`, `JWT_SECRET_KEY`, and R2 credentials.
5. Run the server: `python app.py`.

### Mobile/Desktop Setup
1. Navigate to `krew-mobile-cap`.
2. Install dependencies: `npm install`.
3. Run development server: `npm run dev`.
4. Run Android: `npx cap run android`.
5. Run Electron: `npm run electron:dev`.

---

## 📄 License

Internal project for Krew Music. All rights reserved.
