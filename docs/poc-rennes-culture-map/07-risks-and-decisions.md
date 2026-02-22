# 07 - Risks and Decisions

## Decisions verrouillees

- Ville: `Rennes`
- Donnees runtime: `mock local` uniquement
- UI: `TailwindCSS`
- Architecture UI:
  - `App` = container/orchestrateur
  - `MapViewComponent` = carte Leaflet + clusters
  - `RightPanelComponent` = panel droite + filtres + liste
  - `PlaceCardComponent` = detail d'un lieu (card unitaire)
- Filtres V1: `type` uniquement
- Clusters: `leaflet.markercluster` avec clic => zoom standard
- Interaction panel:
  - hover => surbrillance
  - clic => zoom/centrage
- Tri panel: alphabetique par `name`

## Risques techniques

### 1. CSS Leaflet / MarkerCluster non charge

Impact:

- carte non stylisee, markers/clusters mal affiches

Mitigation:

- ajouter les CSS explicitement dans `angular.json` (ordre controle)
- verifier visuellement des le setup

### 2. Icônes Leaflet par defaut cassees

Impact:

- markers invisibles (images 404)

Mitigation:

- utiliser `L.divIcon` custom pour les markers du PoC
- ou configurer les paths d'assets explicitement

### 3. Survol panel sur point encore clusterise

Impact:

- pas de feedback visible immediate sur la carte

Decision V1:

- pas de de-clustering automatique au hover
- le clic card resout ce cas via zoom

### 4. Couplage trop fort logique/UI/Leaflet dans `App`

Impact:

- tests difficiles

Mitigation:

- extraire les fonctions pures (filtres, tri, viewport) dans `utils`
- garder `App` comme orchestration uniquement
- isoler Leaflet dans `MapViewComponent` et l'UI de liste dans `RightPanelComponent`

### 5. Dataset mock de faible qualite

Impact:

- demo moins credible
- clusters/filtres moins pertinents

Mitigation:

- verification manuelle coordonnees
- checklist de validation du mock
- densite suffisante dans le centre-ville

## Risques produit / UX

### 1. Trop d'informations dans les cards

Impact:

- panel charge, lisibilite faible

Mitigation:

- garder description courte
- 1-2 meta lignes max visibles
- tags compacts

### 2. Mobile moins prioritaire

Impact:

- demo desktop OK mais experience mobile fragile

Mitigation:

- definir layout responsive des le debut
- tester au moins un viewport mobile pendant la recette

## Decisions a reevaluer en V2 (hors PoC)

- recherche texte
- filtre par quartier
- popup riche sur marker
- API data reelle (OSM/Overpass/Open Data Rennes)
- spiderfy / popup cluster
- scroll auto garanti vers card selectionnee
