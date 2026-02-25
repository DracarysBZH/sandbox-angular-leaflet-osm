# 🗺️ SANDBOX [ANGULAR - LEAFLET - OSM]

- [📌 Overview](#-overview)
- [🧰 Prerequisites](#-prerequisites)
- [🚀 Running Locally](#-running-locally)
- [🧪 Running Tests](#-running-tests)
- [📁 Project Structure](#-project-structure)
- [🌍 GitHub Pages](#-github-pages)
- [📝 Notes](#-notes)

## 📌 Overview

This repository is a front-end sandbox to learn and practice:

- Angular (standalone components + signals)
- Leaflet + OpenStreetMap integration
- Marker clustering with `leaflet.markercluster`
- UI synchronization between map and side panel
- Filtering and interaction patterns (hover, selection, focus)

Current feature set includes:

- Rennes cultural places mock dataset
- Leaflet map with clustered custom markers
- Right panel synced with map viewport
- Type filters (multi-select)
- Map <-> panel hover and selection sync
- Selection focus without forced zoom-out
- Auto-scroll to selected card in the right panel

## 🧰 Prerequisites

1. Node.js `20+` (recommended)
2. npm `10+`

## 🚀 Running Locally

1. Install dependencies

```bash
npm install
```

2. Start the Angular dev server

```bash
npm run start
```

App URL:

- [http://localhost:4200](http://localhost:4200)

## 🧪 Running Tests

Run all unit tests:

```bash
npm run test -- --watch=false
```

Build production bundle:

```bash
npm run build
```

## 📁 Project Structure

```text
src/app/
├── components/
│   ├── map-view/                 # Leaflet map, markers, clusters, map interactions
│   ├── place-card/               # Right panel place card
│   └── right-panel/              # Filters + visible places list
├── constants/
│   └── place-type-marker-visuals.constant.ts
├── data/
│   └── rennes-cultural-places.mock.ts
├── models/
│   └── cultural-place.model.ts
├── services/
│   └── culture-map-state.service.ts  # Feature state (signals)
└── utils/
    └── place-filters.ts
```

## 📝 Notes

- This repository is a sandbox for learning and experimentation.
- It is not intended for production use.
- The project currently uses a local mock dataset (Rennes cultural places).
