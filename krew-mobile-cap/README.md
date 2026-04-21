# Krew Mobile & Desktop App 📱💻

The Krew mobile and desktop application is a premium React-based interface powered by Vite, Capacitor, and Electron. It provides a seamless listening experience across Android, Windows, and Web.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Mobile Runtime**: Capacitor 6
- **Desktop Runtime**: Electron
- **Styling**: Tailwind CSS, Radix UI (shadcn/ui), Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Real-time**: Socket.io-client
- **Media Controls**: Capacitor Music Controls Plugin (Native Notification Integration)

## 🚀 Key Features

- **Cross-Platform Player**: Unified player engine for Mobile and Desktop.
- **Native Notifications**: System-level playback controls on Android and Desktop.
- **Interactive Queue**: Drag-and-drop song reordering and "vibe-based" autoplay.
- **Dynamic UI**: Glassmorphism design with smooth Framer Motion transitions.
- **Offline Support**: Intelligent caching for uninterrupted listening.
- **Artist Hub**: In-app tools for artists to manage their profile and uploads.

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or bun

### Installation
```bash
npm install
```

### Development
```bash
# Run web version
npm run dev

# Run Electron (Desktop)
npm run electron:dev

# Run Android
npx cap run android
```

### Build
```bash
# Build web/static
npm run build

# Build Electron
npm run electron:build
```

## 📄 License
Internal project for Krew Music.
