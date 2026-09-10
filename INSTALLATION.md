# KayBiT_CEHexam: Cross-Platform Native Packaging & Distribution Guide

This guide provides instructors and developers with the complete, step-by-step roadmap to package and distribute **KayBiT_CEHexam** natively across:
- **Android**: Standalone APK and Google Play Store AAB
- **iOS**: Native IPA package via Xcode or Installable PWA with offline caching
- **Windows**: Lightweight native `.exe` installer and `.msi` package
- **macOS**: Universal Apple Silicon / Intel `.dmg` disk image and `.app` bundle
- **Web / Progressive Web App (PWA)**: Instant zero-install browser experience with offline support

---

## 1. Tooling Selection

For modern React + Vite + TypeScript web applications, choose tools that maximize performance, minimize bundle bloat, and maintain a single shared codebase:

| Target Platform | Recommended Modern Tool | Alternative | Why It's Recommended |
|---|---|---|---|
| **Android & iOS** | **Capacitor 6+** (`@capacitor/core`) | Cordova (Legacy) | Official modern successor to Cordova. Uses native modern webviews (Android WebView & WKWebView), zero plugin overhead, full TypeScript support, direct access to native APIs. |
| **Desktop (Windows & macOS)** | **Tauri 2+** | Electron | Tauri compiles a tiny Rust binary wrapper around the system webview (WebView2 on Windows, WebKit on macOS). Bundle size is **~8 MB** compared to Electron's **120+ MB**, uses **~30 MB RAM** instead of 250 MB+, and boots instantly. |
| **Universal / Browser** | **Progressive Web App (PWA)** | Standard Webpage | Uses Service Workers and `manifest.webmanifest`. Enables "Install to Desktop / Home Screen" button in Chrome, Edge, and Safari without submitting to app stores. |

---

## 2. Project Restructuring for Native Wrappers

To ensure seamless compilation across native shells, make sure your React/Vite codebase adheres to these principles:

### A. Relative Asset Base Path
In `vite.config.ts`, ensure `base` is configured relatively so native webviews reading from `file://` or `tauri://` can resolve assets:
```typescript
// vite.config.ts
export default defineConfig({
  base: './', // CRITICAL: Ensures assets load properly inside Capacitor & Tauri local schemes
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
```

### B. Client-Side Hash or Memory Routing
Avoid server-dependent HTML5 pushState routing unless deep links are explicitly handled by native URL schemes. A hash-based or single-page state pattern (like the tab manager in `App.tsx`) works 100% offline out-of-the-box in all native containers.

### C. Persistent Local Storage
Use standard `window.localStorage` or `@capacitor/preferences` for persistence. In KayBiT_CEHexam, living command sheets, tools checklist states, and practice exam scores are stored in `localStorage`, guaranteeing zero cloud dependency when students are offline in air-gapped lab environments.

### D. Offline-First PWA Manifest & Service Worker
Place a `manifest.webmanifest` file in `/public/` and register a service worker in `index.html` to cache the app shell and scripts.

---

## 3. Concrete Configuration Files

### A. Capacitor Configuration (`capacitor.config.ts`)
Run `npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios` and create:

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
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.jks',
      keystoreAlias: 'kaybit',
    }
  }
};

export default config;
```

#### Android Build Commands:
```bash
# 1. Build web distribution
npm run build

# 2. Initialize Capacitor & sync assets
npx cap init KayBiT_CEHexam com.kaybit.cehexam --web-dir dist
npx cap add android
npx cap sync android

# 3. Build signed release APK
cd android && ./gradlew assembleRelease
# APK is generated at: android/app/build/outputs/apk/release/app-release.apk
```

---

### B. Tauri Desktop Configuration (`src-tauri/tauri.conf.json`)
Run `npm install -D @tauri-apps/cli` and `npx tauri init`. Set `src-tauri/tauri.conf.json`:

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
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "fs": { "all": false },
      "shell": { "open": true }
    },
    "bundle": {
      "active": true,
      "targets": ["msi", "nsis", "dmg", "deb"],
      "identifier": "com.kaybit.cehexam",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ]
    },
    "windows": [
      {
        "title": "KayBiT_CEHexam - CEH Written & Practical Master Hub",
        "width": 1280,
        "height": 860,
        "resizable": true,
        "fullscreen": false
      }
    ]
  }
}
```

#### Desktop Build Commands:
```bash
# Compile native desktop installers
npm run build
npx tauri build
# Outputs:
# Windows: src-tauri/target/release/bundle/nsis/KayBiT_CEHexam_1.0.0_x64-setup.exe
# macOS:   src-tauri/target/release/bundle/dmg/KayBiT_CEHexam_1.0.0_x64.dmg
```

---

### C. Web App Manifest (`public/manifest.webmanifest`)
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
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 4. Build Automation: GitHub Actions CI/CD Pipeline

Create `.github/workflows/release-builds.yml` in your repository. This workflow automatically produces all native binaries whenever you push a version tag (`git tag v1.0.0 && git push --tags`):

```yaml
name: Build Cross-Platform Native Installers

on:
  push:
    tags:
      - 'v*'

jobs:
  # Build Android APK via Capacitor
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 17
      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Install dependencies & build web app
        run: |
          npm ci
          npm run build
          npx cap sync android

      - name: Build APK with Gradle
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleRelease

      - name: Upload Android APK
        uses: actions/upload-artifact@v4
        with:
          name: KayBiT_CEHexam-Android-APK
          path: android/app/build/outputs/apk/release/*.apk

  # Build Windows .exe & macOS .dmg via Tauri
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
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install Rust Stable
        uses: dtolnay/rust-toolchain@stable

      - name: Install dependencies
        run: npm ci

      - name: Build Tauri Package
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: ${{ github.ref_name }}
          releaseName: 'KayBiT_CEHexam ${{ github.ref_name }}'
          releaseBody: 'Automatic cross-platform release build.'
          releaseDraft: false
          prerelease: false
```

---

## 5. Hosting & Distribution Strategy for Educator Websites

When publishing direct download links on your educational website:

### Directory Structure on S3 / CDN / Web Server:
```text
https://your-domain.edu/downloads/cehexam/
├── latest/
│   ├── KayBiT_CEHexam-Setup.exe       (Windows 64-bit installer)
│   ├── KayBiT_CEHexam.dmg             (macOS Universal Disk Image)
│   ├── KayBiT_CEHexam.apk             (Android Direct APK)
│   └── version.json                   (Metadata for auto-updater)
└── archives/
    ├── v1.0.0/
    └── v1.1.0/
```

### Auto-Update / Version JSON (`version.json`):
```json
{
  "version": "1.0.0",
  "releaseDate": "2026-09-10",
  "minRequiredVersion": "1.0.0",
  "platforms": {
    "windows-x86_64": {
      "url": "https://your-domain.edu/downloads/cehexam/latest/KayBiT_CEHexam-Setup.exe",
      "signature": "SHA256_HASH_HERE"
    },
    "darwin-universal": {
      "url": "https://your-domain.edu/downloads/cehexam/latest/KayBiT_CEHexam.dmg",
      "signature": "SHA256_HASH_HERE"
    },
    "android-apk": {
      "url": "https://your-domain.edu/downloads/cehexam/latest/KayBiT_CEHexam.apk"
    }
  }
}
```

### Student Download Badges HTML Snippet:
```html
<div class="download-container" style="display:flex; gap:16px; flex-wrap:wrap;">
  <a href="/downloads/cehexam/latest/KayBiT_CEHexam.apk" class="badge">
    🤖 Download for Android (.APK)
  </a>
  <a href="/downloads/cehexam/latest/KayBiT_CEHexam-Setup.exe" class="badge">
    🪟 Download for Windows (.EXE)
  </a>
  <a href="/downloads/cehexam/latest/KayBiT_CEHexam.dmg" class="badge">
    🍎 Download for macOS (.DMG)
  </a>
  <a href="https://your-domain.edu/app" class="badge">
    🌐 Launch Instant Web App (PWA)
  </a>
</div>
```
