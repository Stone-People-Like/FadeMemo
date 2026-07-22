---
name: "project-navigator"
description: "Provides FadeMemo project context: architecture overview, module structure, key file locations, and tech stack. Invoke when onboarding to the project, exploring codebase structure, or when AI needs to understand where things are located."
---

# Project Navigator

Quick reference for navigating the FadeMemo codebase.

## Project Overview

**FadeMemo (记·忘)** — A spaced repetition note-taking app that makes notes "decay" over time, forcing active recall through a repair mechanic. Built with Flutter for cross-platform support (iOS, Android, Web, macOS, Linux, Windows).

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI Framework | Flutter + Dart | Cross-platform app |
| State Management | Hive | Local NoSQL database |
| Build System | Flutter CLI | Build & packaging |
| Website | Vite + React + TypeScript + Tailwind CSS | Product landing page |
| Version Control | Git + GitHub | Source control |
| CI/CD | GitHub Actions (planned) | Automated testing & builds |

## Repository Structure

```
FadeMemo/
├── lib/                          # Flutter app source code
│   └── (main application code)
├── test/                         # Unit & widget tests
├── web/                          # Flutter web assets
│   ├── index.html                # Web entry point
│   ├── manifest.json             # PWA manifest
│   └── icons/                    # Web app icons
├── website/                      # Product landing page (Vite + React)
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── data/                 # Content data
│   │   ├── App.tsx               # Root component
│   │   └── main.tsx              # Entry point
│   └── index.html                # Website entry
├── assets/                        # Static assets
│   └── logo.svg                  # App logo
├── .github/                      # GitHub config
│   └── PULL_REQUEST_TEMPLATE.md  # PR template
├── .trae/                        # Trae/AI config
│   ├── documents/
│   │   ├── PRD.md                # Product requirements
│   │   └── TechnicalArchitecture.md  # Tech architecture
│   └── skills/                   # Project-level AI skills
├── CONTRIBUTING.md               # Contribution guide + AI Agent spec
├── VERSIONING.md                  # Version control specification
├── CHANGELOG.md                  # Release history
├── README.md                     # Project overview
├── pubspec.yaml                  # Flutter dependencies
├── build.yaml                    # Build configuration
└── 记·忘_产品概念报告.md           # Product concept report (Chinese)
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `CONTRIBUTING.md` | Contribution guide + AI Agent specification (HTML comments) |
| `VERSIONING.md` | Semantic versioning rules and release flow |
| `CHANGELOG.md` | Version history and release notes |
| `pubspec.yaml` | Flutter project config, dependencies, version number |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR submission template |
| `.trae/documents/PRD.md` | Product requirements document |
| `.trae/documents/TechnicalArchitecture.md` | Technical architecture design |
| `记·忘_产品概念报告.md` | Original product concept report |

## Protected Branches

| Branch | Role | Protection Level |
|--------|------|-----------------|
| `main` | Production stable | Highest — no direct push, no force push |
| `develop` | Development mainline | Strong — no direct push, no force push |

## Core Concepts

- **Note Decay**: Notes gradually "corrupt" over time based on a forgetting curve
- **Active Recall**: Users repair decayed notes, reinforcing memory
- **Decay Level**: Visual corruption intensity (higher = more degraded)
- **Hive Storage**: Raw content stored intact; corruption is computed at display time
- **Note Types**: Learning notes (decay enabled) vs. utility notes (always intact)

## Getting Started Commands

```bash
# Install dependencies
flutter pub get

# Run on connected device/emulator
flutter run

# Run web version
flutter run -d chrome

# Run tests
flutter test

# Static analysis
flutter analyze
```
