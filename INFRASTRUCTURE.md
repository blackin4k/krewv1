# Krew Infrastructure Map

## Backend (API & SocketIO)
- **Primary Domain:** `https://api.kreewaux.xyz` (Custom Domain)
- **Service URL:** `https://krew-backend.onrender.com` (Render)
- **Database:** PostgreSQL on Render (`dpg-d5pb8aer433s73d713jg-a`)

## Storage (CDN)
- **Music & Covers:** Cloudflare R2 (`krew-music`)
- **Public Access:** Via Backend Redirects -> R2 Signed/Public URLs

## Frontend Clients
- **iOS (PWA):** `https://ios.kreewaux.xyz` (Vercel)
- **Android APK:** Built via GitHub Actions (`sha256:3a31...`)
- **Demo / Web Player:** `https://demo.kreewaux.xyz` (Vercel)
- **Landing Page:** `https://kreewaux.xyz` (Cloudflare Pages)

## Tools
- **Downloader:** Local Python App (`krew_downloader`)
