# KayBiT_CEHexam: Full-Stack Installation, Packaging & Distribution Guide

This comprehensive guide details the installation, server configuration, containerization, and native cross-platform packaging for **KayBiT_CEHexam**:
- **Full-Stack Web & Container**: Node.js, Express, Vite, `@google/genai`, Docker, Google Cloud Run
- **Android**: Standalone APK and Google Play Store AAB via Capacitor
- **iOS**: Native IPA package via Xcode / Capacitor, or installable PWA
- **Windows**: Lightweight native `.exe` installer and `.msi` package via Tauri
- **macOS**: Universal Apple Silicon / Intel `.dmg` disk image via Tauri
- **Progressive Web App (PWA)**: Zero-install browser experience with offline caching

---

## 1. Environment & Architecture Overview

KayBiT_CEHexam uses a full-stack architecture combining a high-performance Express backend with a modern React 19 + TypeScript + Vite frontend.

```text
┌─────────────────────────────────────────────────────────────┐
│                    KayBiT_CEHexam Client                    │
│   React 19 + TypeScript + Tailwind CSS v4 + Motion + Recharts│
└──────────────────────────────┬──────────────────────────────┘
                               │
               API Requests: /api/* (Port 3000)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Express Backend Server                   │
│          server.ts -> compiled to dist/server.cjs           │
│                                                             │
│   • POST /api/generate-scenario-questions                   │
│   • Google GenAI SDK (@google/genai) with gemini-3.8-flash  │
│   • Curated High-Yield Offline Fallback Scenario Bank       │
│   • Vite Middleware (Dev) / Static Asset Serving (Prod)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
               GEMINI_API_KEY (Server-Side Secret)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Google Gemini 3.8 API                    │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Safeguards
1. **API Key Security**: The `GEMINI_API_KEY` is strictly managed server-side. It is **never** bundled into the client build or exposed in browser network requests.
2. **Port Binding**: Both dev and production servers bind to `0.0.0.0:3000` for compatibility with reverse proxies and Cloud Run containers.
3. **Resilient Offline Fallback**: If the server is offline or no Gemini API key is configured, the scenario lab automatically serves from a curated offline scenario bank across all 9 CEH domains.
4. **Zero-Asset Audio & Offline Persistence**: All sound effects (completion cues, timer alerts) are procedurally generated using the native Web Audio API oscillators—no external sound files required. All study bookmarks (`kaybit_ceh_study_bookmarks`), audio preferences (`kaybit_ceh_audio_cues_enabled`, `kaybit_ceh_completion_cues_enabled`, `kaybit_ceh_timer_alerts_enabled`), and focus mode states (`kaybit_ceh_focus_mode`) are automatically persisted in client `localStorage` for complete offline functionality.

---

## 2. Local Development Setup

### Prerequisites
- Node.js 18.x or 20.x+
- npm 9.x+ (or Bun / pnpm)
- (Optional) Google AI Studio API Key for Gemini scenario generation

### Step-by-Step Setup
```bash
# 1. Clone repository
git clone https://github.com/your-username/kaybit-cehexam.git
cd kaybit-cehexam

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

Edit `.env` and configure your API key:
```env
# Server-side Gemini API key (optional - offline fallback will be used if omitted)
GEMINI_API_KEY=your_gemini_api_key_here
```

```bash
# 4. Start development server
npm run dev
```
The server will start at `http://localhost:3000`. In development mode, Express mounts Vite's middleware so changes are hot-reloaded automatically.

---

## 3. Production Build & Server Execution

The production build pipeline compiles both the frontend React client and the backend TypeScript server into an optimized, self-contained bundle:

```bash
# Run the complete production build
npm run build
```

This single command performs:
1. `vite build`: Compiles the React SPA assets into `/dist`.
2. `esbuild server.ts`: Bundles the Express server into a standalone CommonJS file at `dist/server.cjs` with sourcemaps and externalized npm modules.

### Launching the Production Server:
```bash
# Start the production Node server
npm run start
# or: node dist/server.cjs
```

The production server serves the optimized static assets from `/dist` and exposes the `/api/*` endpoints on port 3000.

---

## 4. Docker & Cloud Container Deployment

Deploying KayBiT_CEHexam to Google Cloud Run, AWS ECS, or any standard Docker host:

### Production `Dockerfile`
```dockerfile
# Multi-stage Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./
RUN npm ci

# Copy source code and config
COPY . .

# Build client and server bundles
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled outputs from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
```

### Building and Running the Container:
```bash
# Build Docker image
docker build -t kaybit-cehexam:latest .

# Run container locally on port 3000
docker run -p 3000:3000 \
  -e GEMINI_API_KEY="your_api_key_here" \
  kaybit-cehexam:latest
```

---

## 5. Cross-Platform Native Packaging

For air-gapped lab computers, offline student laptops, or tablet deployments, KayBiT_CEHexam can be packaged natively:

| Target Platform | Recommended Modern Tool | Distribution Format |
|---|---|---|
| **Android** | **Capacitor 6+** (`@capacitor/android`) | Standalone `.apk` & Play Store `.aab` |
| **iOS** | **Capacitor 6+** (`@capacitor/ios`) | `.ipa` via Xcode or PWA home screen |
| **Windows** | **Tauri 2+** | Standalone `.exe` installer & `.msi` |
| **macOS** | **Tauri 2+** | Universal `.dmg` disk image & `.app` |
| **Web Browser** | **Progressive Web App (PWA)** | Installable web app with service worker |

---

### A. Android & iOS Packaging (Capacitor)

1. **Install Capacitor CLI and platforms**:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

2. **Configuration (`capacitor.config.ts`)**:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaybit.cehexam',
  appName: 'KayBiT_CEHexam',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;
```

3. **Build APK**:
```bash
# Build production client
npm run build

# Initialize and sync Capacitor
npx cap add android
npx cap sync android

# Compile Android release APK
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

*Note: In standalone mobile builds without a local Node server, the app automatically switches to its comprehensive built-in offline scenario bank for all domain practice questions.*

---

### B. Desktop Packaging: Windows & macOS (Tauri)

Tauri generates ultra-compact native desktop executables (~8 MB vs Electron's 120+ MB):

1. **Install Tauri CLI**:
```bash
npm install -D @tauri-apps/cli
npx tauri init
```

2. **Configuration (`src-tauri/tauri.conf.json`)**:
```json
{
  "$schema": "https://raw.githubusercontent.com/tauri-apps/tauri/dev/tooling/cli/schema.json",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:3000",
    "distDir": "../dist"
  },
  "package": {
    "productName": "KayBiT_CEHexam",
    "version": "1.1.0"
  },
  "tauri": {
    "bundle": {
      "active": true,
      "targets": ["msi", "nsis", "dmg", "deb"],
      "identifier": "com.kaybit.cehexam",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ]
    },
    "windows": [
      {
        "title": "KayBiT_CEHexam - CEH Written & Practical Master Hub",
        "width": 1360,
        "height": 900,
        "resizable": true,
        "fullscreen": false
      }
    ]
  }
}
```

3. **Build Desktop Installers**:
```bash
npm run build
npx tauri build
```
Outputs:
- **Windows**: `src-tauri/target/release/bundle/nsis/KayBiT_CEHexam_1.1.0_x64-setup.exe`
- **macOS**: `src-tauri/target/release/bundle/dmg/KayBiT_CEHexam_1.1.0_x64.dmg`

---

### C. Progressive Web App (PWA) Setup

Add `public/manifest.webmanifest`:
```json
{
  "name": "KayBiT_CEHexam",
  "short_name": "CEH Exam Hub",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#020617",
  "theme_color": "#10b981",
  "description": "All-in-one CEH Written & Practical Exam Preparation App for intermediate programmers.",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Link the manifest in `index.html`:
```html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#10b981">
```

---

## 6. GitHub Actions Automated CI/CD Workflow

Create `.github/workflows/build-artifacts.yml` to automatically build and release binaries on tag pushes (`git tag v1.1.0 && git push --tags`):

```yaml
name: Cross-Platform Build Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 17
      - uses: android-actions/setup-android@v3

      - name: Build Web & Sync Capacitor
        run: |
          npm ci
          npm run build
          npx cap sync android

      - name: Compile APK
        run: |
          cd android && chmod +x gradlew
          ./gradlew assembleRelease

      - uses: actions/upload-artifact@v4
        with:
          name: KayBiT_CEHexam-Android-APK
          path: android/app/build/outputs/apk/release/*.apk

  build-desktop:
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: windows-latest
            artifact: KayBiT_CEHexam-Windows.exe
          - os: macos-latest
            artifact: KayBiT_CEHexam-macOS.dmg
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - uses: dtolnay/rust-toolchain@stable

      - name: Build Tauri Package
        run: |
          npm ci
          npm run build
          npx tauri build
```

---

## 7. Educator Hosting & Direct Download Strategy

Organize your institution's downloads directory as follows:

```text
https://your-domain.edu/downloads/cehexam/
├── latest/
│   ├── KayBiT_CEHexam-Setup.exe       (Windows 64-bit installer)
│   ├── KayBiT_CEHexam.dmg             (macOS Universal Disk Image)
│   ├── KayBiT_CEHexam.apk             (Android Direct APK)
│   └── version.json                   (Release manifest)
```

### Version Manifest (`version.json`):
```json
{
  "version": "1.1.0",
  "releaseDate": "2026-09-12",
  "minRequiredVersion": "1.0.0",
  "platforms": {
    "windows-x86_64": {
      "url": "https://your-domain.edu/downloads/cehexam/latest/KayBiT_CEHexam-Setup.exe"
    },
    "darwin-universal": {
      "url": "https://your-domain.edu/downloads/cehexam/latest/KayBiT_CEHexam.dmg"
    },
    "android-apk": {
      "url": "https://your-domain.edu/downloads/cehexam/latest/KayBiT_CEHexam.apk"
    }
  }
}
```

Students can easily verify file hashes and run the application natively in air-gapped classroom labs or remote study environments.
