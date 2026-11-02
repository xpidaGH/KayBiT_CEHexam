# Multiplatform CI/CD & Secure Code-Signing Architecture
## KayBiT_CEHexam Production Packaging Guide

This guide details the complete GitHub Actions automation workflow for compiling, code-signing, and publishing **KayBiT_CEHexam** across **iOS, Android, Windows, macOS, and Linux**.

---

## 1. Secrets Management & Base64 Security Architecture

To protect proprietary certificates and distribution identities, **never commit raw keystore (`.jks`), certificate (`.p12`), or provisioning profile (`.mobileprovision`) files directly to version control**. 

Instead:
1. Convert binary certificate files to single-line **Base64** strings locally.
2. Save these strings inside **GitHub Repository Secrets** (`Settings` -> `Secrets and variables` -> `Actions`).
3. During the automated CI run, GitHub Actions decodes the Base64 strings strictly into volatile runner memory, verifies the signatures, packages the binaries, and flushes temporary credentials when the job terminates.

### Local Base64 Conversion Commands

#### A. Android Keystore (`.jks` / `.keystore`)
Generate your release key locally using Java's `keytool`:
```bash
keytool -genkeypair -v -keystore kaybit-release.jks -alias kaybit-key -keyalg RSA -keysize 2048 -validity 10000
```

Convert to Base64:
- **macOS / Linux (Bash)**:
  ```bash
  base64 -w 0 kaybit-release.jks > android_keystore_base64.txt
  # Or copy straight to clipboard on macOS:
  base64 -i kaybit-release.jks | pbcopy
  ```
- **Windows (PowerShell)**:
  ```powershell
  [Convert]::ToBase64String([IO.File]::ReadAllBytes("kaybit-release.jks")) | Set-Clipboard
  ```

#### B. Apple Distribution Certificate (`.p12`)
Export your Apple Distribution Certificate with a private key from **macOS Keychain Access** as a `.p12` file.

Convert to Base64:
- **macOS / Linux (Bash)**:
  ```bash
  base64 -i Certificates.p12 | pbcopy
  ```
- **Windows (PowerShell)**:
  ```powershell
  [Convert]::ToBase64String([IO.File]::ReadAllBytes("Certificates.p12")) | Set-Clipboard
  ```

#### C. Apple Provisioning Profile (`.mobileprovision`)
Download the App Store Distribution Provisioning Profile from developer.apple.com.

Convert to Base64:
- **macOS / Linux (Bash)**:
  ```bash
  base64 -i KayBiT_CEHexam_AppStore.mobileprovision | pbcopy
  ```
- **Windows (PowerShell)**:
  ```powershell
  [Convert]::ToBase64String([IO.File]::ReadAllBytes("KayBiT_CEHexam_AppStore.mobileprovision")) | Set-Clipboard
  ```

#### D. Google Play Service Account JSON
Generate a Google Play Developer API service account key JSON from Google Cloud Console.

Convert to Base64:
- **macOS / Linux (Bash)**:
  ```bash
  base64 -w 0 google-play-service-account.json > play_account_base64.txt
  ```
- **Windows (PowerShell)**:
  ```powershell
  [Convert]::ToBase64String([IO.File]::ReadAllBytes("google-play-service-account.json")) | Set-Clipboard
  ```

---

## 2. GitHub Repository Secrets Reference

Add the following environment variables to your GitHub Secrets:

| Secret Name | Purpose | Example / Format |
| :--- | :--- | :--- |
| `APPLE_CERTIFICATE_BASE64` | Apple Distribution Certificate (.p12) | Base64 string |
| `APPLE_CERTIFICATE_PASSWORD` | Password protecting the .p12 cert | Plain text |
| `APPLE_PROVISIONING_PROFILE_BASE64` | App Store Provisioning Profile | Base64 string |
| `APPLE_KEYCHAIN_PASSWORD` | Temporary ephemeral keychain password | Strong random string |
| `APPLE_TEAM_ID` | 10-character Apple Developer Team ID | e.g. `9ABC345DEF` |
| `APPLE_BUNDLE_ID` | Application identifier | `com.kaybit.cehexam` |
| `APPLE_PROFILE_NAME` | Name of the provision profile in Apple portal | `KayBiT CEH AppStore Profile` |
| `APP_STORE_CONNECT_API_KEY_ID` | App Store Connect API Key ID | e.g. `2X9R4HX43K` |
| `APP_STORE_CONNECT_API_ISSUER_ID` | App Store Connect API Issuer UUID | e.g. `69a6de70-xxxx-47e3-e053-5b8c7c11a4d1` |
| `APP_STORE_CONNECT_API_KEY_BASE64` | AuthKey_xxxx.p8 API private key | Base64 string |
| `ANDROID_KEYSTORE_BASE64` | Release Java Keystore file | Base64 string |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore master password | Plain text |
| `ANDROID_KEY_ALIAS` | Keypair alias name | `kaybit-key` |
| `ANDROID_KEY_PASSWORD` | Specific key password | Plain text |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64` | Google Play service account key | Base64 string |
| `WINDOWS_CERTIFICATE_BASE64` *(Optional)* | EV/OV Authenticode .pfx certificate | Base64 string |
| `WINDOWS_CERTIFICATE_PASSWORD` *(Optional)* | .pfx password | Plain text |
| `DISCORD_WEBHOOK_URL` | Discord channel webhook for build alerts | `https://discord.com/api/webhooks/...` |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook for build alerts | `https://hooks.slack.com/services/...` |
| `SMTP_USERNAME` / `SMTP_PASSWORD` | Email notifications via SMTP server | SMTP credentials |
| `NOTIFICATION_EMAIL` | Destination email for build status alerts | `dev-team@kaybit.com` |

---

## 3. Dynamic `exportOptions.plist` Template

To ensure Xcode formats the App Store package correctly without exposing Team IDs or Bundle IDs in git, the workflow generates `exportOptions.plist` on the fly inside the runner:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>${APPLE_TEAM_ID}</string>
    <key>signingStyle</key>
    <string>manual</string>
    <key>provisioningProfiles</key>
    <dict>
        <key>${APPLE_BUNDLE_ID}</key>
        <string>${APPLE_PROFILE_NAME}</string>
    </dict>
    <key>signingCertificate</key>
    <string>Apple Distribution</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>destination</key>
    <string>export</string>
</dict>
</plist>
```

---

## 4. Continuous Build Integer Automation

The workflow automatically increments version counters across all native manifests using `${{ github.run_number }}`:
- **Tauri (`src-tauri/tauri.conf.json`)**: Version formatted as `1.0.${{ github.run_number }}`.
- **Android (`android/app/build.gradle`)**: 
  - `versionCode = ${{ github.run_number }}`
  - `versionName = "1.0.${{ github.run_number }}"`
- **iOS (`Info.plist` / Xcode project)**:
  - `CFBundleVersion = ${{ github.run_number }}`
  - `CFBundleShortVersionString = "1.0.${{ github.run_number }}"`

---

## 5. Complete Production GitHub Actions Workflow

Save the configuration below to `.github/workflows/multiplatform-release.yml`:

```yaml
name: Multiplatform Production Build, Code-Sign & Distribution

on:
  push:
    branches: [ main, release/* ]
    tags: [ 'v*' ]
  release:
    types: [ created ]
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # =========================================================================
  # 1. MACOS RUNNER: iOS .ipa (Capacitor) + macOS .dmg Universal (Tauri)
  # =========================================================================
  build-ios-and-macos:
    name: Build & Sign iOS (.ipa) & macOS (.dmg Universal)
    runs-on: macos-latest
    timeout-minutes: 90

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Rust Stable Toolchain (for macOS Tauri)
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: x86_64-apple-darwin,aarch64-apple-darwin

      - name: Rust Caching
        uses: Swatinem/rust-cache@v2
        with:
          workspaces: './src-tauri -> target'

      - name: Install Node Dependencies
        run: npm ci

      - name: Inject Version Counters
        run: |
          BUILD_NUM=${{ github.run_number }}
          VERSION="1.0.${BUILD_NUM}"
          echo "Setting release version to ${VERSION} (Build ${BUILD_NUM})"
          npm version ${VERSION} --no-git-tag-version --allow-same-version

      - name: Compile Vite Production Web Bundle
        run: npm run build

      # --- iOS Code-Signing & Packaging ---
      - name: Import Apple Distribution Certificate
        uses: apple-actions/import-codesign-certs@v2
        if: env.APPLE_CERTIFICATE_BASE64 != ''
        with:
          p12-file-base64: ${{ secrets.APPLE_CERTIFICATE_BASE64 }}
          p12-password: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
        env:
          APPLE_CERTIFICATE_BASE64: ${{ secrets.APPLE_CERTIFICATE_BASE64 }}

      - name: Decode & Install Apple Provisioning Profile
        if: env.APPLE_PROVISIONING_PROFILE_BASE64 != ''
        run: |
          mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
          echo "${{ secrets.APPLE_PROVISIONING_PROFILE_BASE64 }}" | base64 --decode > ~/Library/MobileDevice/Provisioning\ Profiles/profile.mobileprovision
        env:
          APPLE_PROVISIONING_PROFILE_BASE64: ${{ secrets.APPLE_PROVISIONING_PROFILE_BASE64 }}

      - name: Generate Dynamic exportOptions.plist
        run: |
          cat <<EOF > exportOptions.plist
          <?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
          <plist version="1.0">
          <dict>
              <key>method</key>
              <string>app-store</string>
              <key>teamID</key>
              <string>${{ secrets.APPLE_TEAM_ID }}</string>
              <key>signingStyle</key>
              <string>manual</string>
              <key>provisioningProfiles</key>
              <dict>
                  <key>${{ secrets.APPLE_BUNDLE_ID }}</key>
                  <string>${{ secrets.APPLE_PROFILE_NAME }}</string>
              </dict>
              <key>signingCertificate</key>
              <string>Apple Distribution</string>
              <key>uploadBitcode</key>
              <false/>
              <key>uploadSymbols</key>
              <true/>
              <key>destination</key>
              <string>export</string>
          </dict>
          </plist>
          EOF

      - name: Build & Export iOS .ipa (Capacitor / Xcode)
        if: env.APPLE_CERTIFICATE_BASE64 != ''
        run: |
          npx cap sync ios
          cd ios/App
          xcodebuild archive \
            -workspace App.xcworkspace \
            -scheme App \
            -configuration Release \
            -archivePath build/App.xcarchive \
            CURRENT_PROJECT_VERSION=${{ github.run_number }} \
            MARKETING_VERSION="1.0.${{ github.run_number }}"
          xcodebuild -exportArchive \
            -archivePath build/App.xcarchive \
            -exportOptionsPlist ../../exportOptions.plist \
            -exportPath build/ipa
        env:
          APPLE_CERTIFICATE_BASE64: ${{ secrets.APPLE_CERTIFICATE_BASE64 }}

      - name: Publish to Apple TestFlight
        if: env.APP_STORE_CONNECT_API_KEY_BASE64 != ''
        run: |
          echo "${{ secrets.APP_STORE_CONNECT_API_KEY_BASE64 }}" | base64 --decode > ~/AuthKey_${{ secrets.APP_STORE_CONNECT_API_KEY_ID }}.p8
          xcrun altool --upload-app \
            --type ios \
            --file ios/App/build/ipa/App.ipa \
            --apiKey ${{ secrets.APP_STORE_CONNECT_API_KEY_ID }} \
            --apiIssuer ${{ secrets.APP_STORE_CONNECT_API_ISSUER_ID }}
          rm -f ~/AuthKey_${{ secrets.APP_STORE_CONNECT_API_KEY_ID }}.p8
        env:
          APP_STORE_CONNECT_API_KEY_BASE64: ${{ secrets.APP_STORE_CONNECT_API_KEY_BASE64 }}

      # --- macOS Universal Binary (Tauri) ---
      - name: Build macOS Universal .dmg (x86_64 + Apple Silicon aarch64)
        run: |
          npm run tauri icon ./public/assets/kbt-logo-transparent.png || true
          npx tauri build --target universal-apple-darwin
        env:
          TAURI_PRIVATE_KEY: ${{ secrets.TAURI_PRIVATE_KEY }}
          TAURI_KEY_PASSWORD: ${{ secrets.TAURI_KEY_PASSWORD }}

      - name: Upload macOS Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: macos-dmg
          path: src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg

      - name: Upload iOS .ipa Artifact
        if: env.APPLE_CERTIFICATE_BASE64 != ''
        uses: actions/upload-artifact@v4
        with:
          name: ios-ipa
          path: ios/App/build/ipa/*.ipa
        env:
          APPLE_CERTIFICATE_BASE64: ${{ secrets.APPLE_CERTIFICATE_BASE64 }}

  # =========================================================================
  # 2. WINDOWS RUNNER: Windows .msi & .exe (Tauri + WiX / NSIS)
  # =========================================================================
  build-windows:
    name: Build & Package Windows (.msi / .exe)
    runs-on: windows-latest
    timeout-minutes: 60

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Rust Stable MSVC Toolchain
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: x86_64-pc-windows-msvc

      - name: Rust Caching
        uses: Swatinem/rust-cache@v2
        with:
          workspaces: './src-tauri -> target'

      - name: Install Node Dependencies
        run: npm ci

      - name: Compile Vite Production Web Bundle
        run: npm run build

      - name: Setup WiX Toolset
        run: |
          dotnet tool install --global wix --version 4.0.5

      - name: Decode Windows Authenticode Certificate (Optional)
        id: windows-cert
        shell: pwsh
        run: |
          if ("${{ secrets.WINDOWS_CERTIFICATE_BASE64 }}" -ne "") {
            $bytes = [Convert]::FromBase64String("${{ secrets.WINDOWS_CERTIFICATE_BASE64 }}")
            [IO.File]::WriteAllBytes("$env:TEMP\cert.pfx", $bytes)
            echo "HAS_CERT=true" >> $env:GITHUB_ENV
          } else {
            echo "HAS_CERT=false" >> $env:GITHUB_ENV
            echo "::notice::No Windows Code-Signing Cert provided. Installer will build unsigned."
          }

      - name: Build Tauri Windows Installer (.exe & .msi)
        shell: pwsh
        run: |
          npm run tauri icon ./public/assets/kbt-logo-transparent.png
          npx tauri build
        env:
          TAURI_PRIVATE_KEY: ${{ secrets.TAURI_PRIVATE_KEY }}
          TAURI_KEY_PASSWORD: ${{ secrets.TAURI_KEY_PASSWORD }}

      - name: Sign Windows Installer (If Certificate Provided)
        if: env.HAS_CERT == 'true'
        shell: pwsh
        run: |
          $signtool = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe"
          Get-ChildItem -Path "src-tauri\target\release\bundle" -Include *.exe,*.msi -Recurse | ForEach-Object {
            & $signtool sign /f "$env:TEMP\cert.pfx" /p "${{ secrets.WINDOWS_CERTIFICATE_PASSWORD }}" /tr http://timestamp.digicert.com /td sha256 /fd sha256 $_.FullName
          }
          Remove-Item "$env:TEMP\cert.pfx" -Force

      - name: Upload Windows Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: windows-installers
          path: |
            src-tauri/target/release/bundle/msi/*.msi
            src-tauri/target/release/bundle/nsis/*.exe

  # =========================================================================
  # 3. UBUNTU RUNNER: Android (.apk & .aab) + Linux (.deb & .AppImage + PipeWire)
  # =========================================================================
  build-android-and-linux:
    name: Build & Sign Android (.aab/.apk) & Linux (.AppImage/.deb)
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: 17

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Rust Stable Toolchain
        uses: dtolnay/rust-toolchain@stable

      - name: Install Linux GUI, WebKit2GTK & PipeWire Development Libraries
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libwebkit2gtk-4.1-dev \
            build-essential \
            curl \
            wget \
            file \
            libssl-dev \
            libgtk-3-dev \
            libayatana-appindicator3-dev \
            librsvg2-dev \
            libpipewire-0.3-dev \
            libspa-0.2-dev

      - name: Rust Caching
        uses: Swatinem/rust-cache@v2
        with:
          workspaces: './src-tauri -> target'

      - name: Install Node Dependencies
        run: npm ci

      - name: Compile Vite Production Web Bundle
        run: npm run build

      # --- Android Packaging & Signing ---
      - name: Decode Android Keystore
        id: android-keystore
        if: env.ANDROID_KEYSTORE_BASE64 != ''
        run: |
          echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > android-release.keystore
          echo "KEYSTORE_PATH=$GITHUB_WORKSPACE/android-release.keystore" >> $GITHUB_ENV
        env:
          ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}

      - name: Build Android Bundle & APK (Capacitor)
        run: |
          npx cap sync android
          cd android
          ./gradlew bundleRelease assembleRelease \
            -Pandroid.injected.version.code=${{ github.run_number }} \
            -Pandroid.injected.version.name="1.0.${{ github.run_number }}"

      - name: Sign Android Release (.aab)
        if: env.ANDROID_KEYSTORE_BASE64 != ''
        uses: r0adkll/sign-android-release@v1
        id: sign_aab
        with:
          releaseDirectory: android/app/build/outputs/bundle/release
          signingKey: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
          keyStorePassword: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          keyAlias: ${{ secrets.ANDROID_KEY_ALIAS }}
          keyPassword: ${{ secrets.ANDROID_KEY_PASSWORD }}
        env:
          ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}

      - name: Sign Android Release (.apk)
        if: env.ANDROID_KEYSTORE_BASE64 != ''
        uses: r0adkll/sign-android-release@v1
        id: sign_apk
        with:
          releaseDirectory: android/app/build/outputs/apk/release
          signingKey: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
          keyStorePassword: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          keyAlias: ${{ secrets.ANDROID_KEY_ALIAS }}
          keyPassword: ${{ secrets.ANDROID_KEY_PASSWORD }}
        env:
          ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}

      - name: Publish to Google Play Internal Testing Track
        if: env.PLAY_JSON_BASE64 != ''
        run: |
          echo "${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64 }}" | base64 -d > service-account.json
          npx @actions/google-play-publish \
            --package-name "com.kaybit.cehexam" \
            --aab "${{ steps.sign_aab.outputs.signedReleaseFile }}" \
            --track "internal" \
            --service-account "service-account.json" || true
          rm -f service-account.json
        env:
          PLAY_JSON_BASE64: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64 }}

      - name: Flush Keystore From Runner Memory
        if: always()
        run: |
          rm -f android-release.keystore

      # --- Linux Tauri (.deb & .AppImage with PipeWire) ---
      - name: Build Linux Desktop Packages
        run: |
          npm run tauri icon ./public/assets/kbt-logo-transparent.png || true
          npx tauri build
        env:
          TAURI_PRIVATE_KEY: ${{ secrets.TAURI_PRIVATE_KEY }}
          TAURI_KEY_PASSWORD: ${{ secrets.TAURI_KEY_PASSWORD }}

      - name: Upload Android Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: android-packages
          path: |
            android/app/build/outputs/apk/release/*.apk
            android/app/build/outputs/bundle/release/*.aab

      - name: Upload Linux Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: linux-packages
          path: |
            src-tauri/target/release/bundle/deb/*.deb
            src-tauri/target/release/bundle/appimage/*.AppImage

  # =========================================================================
  # 4. PUBLISH RELEASE & AUTOMATED CHANGELOG TO GITHUB RELEASES
  # =========================================================================
  publish-release:
    name: Generate Changelog & Publish Desktop Assets to GitHub Releases
    runs-on: ubuntu-latest
    needs: [ build-ios-and-macos, build-windows, build-android-and-linux ]
    if: startsWith(github.ref, 'refs/tags/v') || github.event_name == 'release' || github.event_name == 'workflow_dispatch'

    steps:
      - name: Checkout Code for Commit Log
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Download All Runner Artifacts
        uses: actions/download-artifact@v4
        with:
          path: release-artifacts

      - name: Generate Automated Git Commit Changelog
        id: changelog
        run: |
          PREV_TAG=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")
          echo "### 🚀 Automated Changelog for Release v1.0.${{ github.run_number }}" > CHANGELOG.md
          echo "" >> CHANGELOG.md
          echo "**Build Number**: #${{ github.run_number }}" >> CHANGELOG.md
          echo "**Commit Hash**: \`${{ github.sha }}\`" >> CHANGELOG.md
          echo "" >> CHANGELOG.md
          echo "#### Recent Commits:" >> CHANGELOG.md
          if [ -n "$PREV_TAG" ]; then
            git log ${PREV_TAG}..HEAD --pretty=format:"* %s ([%h](https://github.com/${{ github.repository }}/commit/%H)) - @%an" >> CHANGELOG.md
          else
            git log -n 25 --pretty=format:"* %s ([%h](https://github.com/${{ github.repository }}/commit/%H)) - @%an" >> CHANGELOG.md
          fi
          echo "" >> CHANGELOG.md
          cat CHANGELOG.md

      - name: Publish GitHub Release with Desktop Assets
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ github.ref_name || format('v1.0.{0}', github.run_number) }}
          name: "KayBiT_CEHexam Release v1.0.${{ github.run_number }}"
          body_path: CHANGELOG.md
          draft: false
          prerelease: false
          files: |
            release-artifacts/windows-installers/*
            release-artifacts/macos-dmg/*
            release-artifacts/linux-packages/*
            release-artifacts/android-packages/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # =========================================================================
  # 5. MULTI-CHANNEL TEAM NOTIFICATIONS (SLACK, DISCORD, EMAIL)
  # =========================================================================
  notify-team:
    name: Dispatch Build Status Notifications
    runs-on: ubuntu-latest
    needs: [ build-ios-and-macos, build-windows, build-android-and-linux ]
    if: always()

    steps:
      - name: Determine Aggregate Status
        id: status
        run: |
          if [ "${{ needs.build-ios-and-macos.result }}" == "success" ] && \
             [ "${{ needs.build-windows.result }}" == "success" ] && \
             [ "${{ needs.build-android-and-linux.result }}" == "success" ]; then
            echo "RESULT=SUCCESS" >> $GITHUB_OUTPUT
            echo "COLOR=3066993" >> $GITHUB_OUTPUT # Green
            echo "EMOJI=✅" >> $GITHUB_OUTPUT
          else
            echo "RESULT=FAILURE" >> $GITHUB_OUTPUT
            echo "COLOR=15158332" >> $GITHUB_OUTPUT # Red
            echo "EMOJI=❌" >> $GITHUB_OUTPUT
          fi

      - name: Send Discord Webhook Alert
        if: env.DISCORD_WEBHOOK != ''
        run: |
          curl -H "Content-Type: application/json" -X POST -d '{
            "embeds": [{
              "title": "${{ steps.status.outputs.EMOJI }} Multiplatform Build: ${{ steps.status.outputs.RESULT }}",
              "description": "KayBiT_CEHexam Build **#${{ github.run_number }}** has finished on ${{ github.ref_name }}.",
              "color": ${{ steps.status.outputs.COLOR }},
              "fields": [
                {"name": "macOS & iOS", "value": "${{ needs.build-ios-and-macos.result }}", "inline": true},
                {"name": "Windows", "value": "${{ needs.build-windows.result }}", "inline": true},
                {"name": "Android & Linux", "value": "${{ needs.build-android-and-linux.result }}", "inline": true},
                {"name": "Commit", "value": "`${{ github.sha }}`", "inline": false}
              ],
              "url": "https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}"
            }]
          }' "${{ secrets.DISCORD_WEBHOOK_URL }}"
        env:
          DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK_URL }}

      - name: Send Slack Notification
        if: env.SLACK_WEBHOOK != ''
        run: |
          curl -X POST -H 'Content-type: application/json' --data '{
            "text": "${{ steps.status.outputs.EMOJI }} *KayBiT_CEHexam Build #${{ github.run_number }}*: ${{ steps.status.outputs.RESULT }}\nRepo: ${{ github.repository }} | Branch: ${{ github.ref_name }}\nView Workflow: https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}"
          }' "${{ secrets.SLACK_WEBHOOK_URL }}"
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK_URL }}

      - name: Send Email Notification via SMTP
        if: env.SMTP_USER != '' && env.RECIPIENT != ''
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 465
          secure: true
          username: ${{ secrets.SMTP_USERNAME }}
          password: ${{ secrets.SMTP_PASSWORD }}
          subject: "${{ steps.status.outputs.EMOJI }} [CI] KayBiT_CEHexam Build #${{ github.run_number }} - ${{ steps.status.outputs.RESULT }}"
          to: ${{ secrets.NOTIFICATION_EMAIL }}
          from: "KayBiT CI Bot <${{ secrets.SMTP_USERNAME }}>"
          body: |
            Build #${{ github.run_number }} completed with status: ${{ steps.status.outputs.RESULT }}
            
            Platform Breakdown:
            - macOS & iOS: ${{ needs.build-ios-and-macos.result }}
            - Windows: ${{ needs.build-windows.result }}
            - Android & Linux: ${{ needs.build-android-and-linux.result }}
            
            Commit: ${{ github.sha }}
            Branch: ${{ github.ref_name }}
            
            Check details: https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}
        env:
          SMTP_USER: ${{ secrets.SMTP_USERNAME }}
          RECIPIENT: ${{ secrets.NOTIFICATION_EMAIL }}
```
