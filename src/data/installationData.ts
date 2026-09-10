export interface NativePlatformPackage {
  id: string;
  name: string;
  category: 'mobile' | 'desktop' | 'web';
  wrapperFramework: 'Capacitor' | 'Tauri' | 'PWA';
  fileExtension: string;
  badge: string;
  description: string;
  requirements: string[];
  commandQuickstart: string;
  distributionPath: string;
}

export const NATIVE_PLATFORMS: NativePlatformPackage[] = [
  {
    id: 'android',
    name: 'Android Package',
    category: 'mobile',
    wrapperFramework: 'Capacitor',
    fileExtension: '.apk / .aab',
    badge: 'Capacitor 6+',
    description: 'Compile into an optimized APK for direct sideloading onto student Android tablets and phones, or signed AAB for Google Play Store.',
    requirements: ['Android SDK 34+', 'JDK 17 (Zulu / Temurin)', 'Node.js 20+'],
    commandQuickstart: 'npm run build && npx cap sync android && cd android && ./gradlew assembleRelease',
    distributionPath: 'android/app/build/outputs/apk/release/app-release.apk',
  },
  {
    id: 'windows',
    name: 'Windows Desktop Installer',
    category: 'desktop',
    wrapperFramework: 'Tauri',
    fileExtension: '.exe / .msi',
    badge: 'Tauri 2+ (Rust)',
    description: 'Extremely lightweight (~8 MB bundle vs 130 MB Electron). Runs via Microsoft Edge WebView2 with native system security and instant launch.',
    requirements: ['Visual Studio C++ Build Tools', 'Rust (rustup stable)', 'WebView2 Runtime'],
    commandQuickstart: 'npm run build && npx tauri build',
    distributionPath: 'src-tauri/target/release/bundle/nsis/KayBiT_CEHexam_1.0.0_x64-setup.exe',
  },
  {
    id: 'macos',
    name: 'macOS Universal Disk Image',
    category: 'desktop',
    wrapperFramework: 'Tauri',
    fileExtension: '.dmg / .app',
    badge: 'Apple Silicon & Intel',
    description: 'Hardware-accelerated native macOS application utilizing WebKit. Sandboxed, offline-capable, and minimal memory footprint (<30 MB RAM).',
    requirements: ['Xcode Command Line Tools', 'Rust (rustup stable)', 'macOS 12+'],
    commandQuickstart: 'npm run build && npx tauri build --target universal-apple-darwin',
    distributionPath: 'src-tauri/target/release/bundle/dmg/KayBiT_CEHexam_1.0.0_universal.dmg',
  },
  {
    id: 'pwa',
    name: 'Progressive Web App (PWA)',
    category: 'web',
    wrapperFramework: 'PWA',
    fileExtension: 'Instant Web App',
    badge: 'Zero-Install Offline',
    description: 'Service Worker and Web App Manifest caching all notes, cheatsheets, and simulators locally in the browser with desktop install badge.',
    requirements: ['Any Modern Browser (Chrome, Edge, Safari, Firefox)', 'HTTPS / localhost'],
    commandQuickstart: 'npm run build && npm run preview',
    distributionPath: 'dist/ (Deployable to Vercel, Netlify, Cloudflare Pages, S3)',
  },
];

export const CONFIG_SNIPPETS = {
  capacitorConfig: `// capacitor.config.ts
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

export default config;`,

  tauriConfig: `{
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
      "shell": { "open": true }
    },
    "bundle": {
      "active": true,
      "targets": ["nsis", "msi", "dmg", "deb"],
      "identifier": "com.kaybit.cehexam"
    }
  }
}`,

  githubActions: `# .github/workflows/release-builds.yml
name: Build Cross-Platform Native Packages

on:
  push:
    tags: ['v*']

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: actions/setup-java@v4
        with: { distribution: 'zulu', java-version: 17 }
      - uses: android-actions/setup-android@v3
      - run: npm ci && npm run build && npx cap sync android
      - run: cd android && ./gradlew assembleRelease
      - uses: actions/upload-artifact@v4
        with:
          name: KayBiT_CEHexam-Android-APK
          path: android/app/build/outputs/apk/release/*.apk

  build-desktop:
    strategy:
      matrix:
        os: [windows-latest, macos-latest]
    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: dtolnay/rust-toolchain@stable
      - run: npm ci
      - uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,

  webManifest: `{
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
    }
  ]
}`,
};

export const DISTRIBUTION_TIERS = [
  {
    title: 'Self-Hosted S3 / CDN Distribution',
    summary: 'Direct downloads for campus / university offline intranets',
    steps: [
      'Create an Amazon S3 bucket or Cloudflare R2 bucket with public read permissions.',
      'Maintain an immutable release structure: `/downloads/cehexam/v1.0.0/` and `/latest/`.',
      'Deploy `version.json` with SHA-256 hashes so client apps can query updates without app store delays.',
    ],
  },
  {
    title: 'Vercel / Netlify / Cloudflare Pages',
    summary: 'Zero-configuration global edge PWA hosting',
    steps: [
      'Connect GitHub repository directly to Vercel or Netlify.',
      'Build command: `npm run build`, Output directory: `dist`.',
      'Automatic SSL certificate provisioning and CDN edge caching across 300+ global points of presence.',
    ],
  },
];
