# 03 - Technical Architecture

## Stack

- Angular standalone (v21 generee)
- TailwindCSS (styles utilitaires)
- Leaflet
- `leaflet.markercluster`

## Structure cible des fichiers applicatifs

- `src/app/app.ts`
- `src/app/app.html`
- `src/app/app.scss` (ou minimal, avec Tailwind majoritaire)
- `src/app/components/map-view/map-view.component.ts`
- `src/app/components/map-view/map-view.component.html`
- `src/app/components/map-view/map-view.component.scss` (ou minimal)
- `src/app/components/right-panel/right-panel.component.ts`
- `src/app/components/right-panel/right-panel.component.html`
- `src/app/components/right-panel/right-panel.component.scss` (ou minimal)
- `src/app/components/place-card/place-card.component.ts`
- `src/app/components/place-card/place-card.component.html`
- `src/app/components/place-card/place-card.component.scss` (ou minimal)
- `src/app/models/cultural-place.model.ts`
- `src/app/data/rennes-cultural-places.mock.ts`
- `src/app/services/culture-map-state.service.ts`
- `src/app/utils/place-filters.ts`
- `src/app/utils/place-filters.spec.ts`

## Positionnement architectural (etat actuel)

Choix retenu pour ce projet:

- feature orientee produit (pas de recherche de genericite)
- store de feature partage via `CultureMapStateService`
- `App` minimal (shell de page + composition)
- composants UI autorises a etre couples au store si cela simplifie la plomberie

Ce choix privilegie:

- vitesse d'iteration
- lisibilite du flux metier
- simplicite pour les phases Leaflet/viewport/interactions

## Etat UI (source de verite)

Etat logique principal (store de feature):

- `places: CulturalPlace[]`
- `selectedTypes: Set<CulturalPlaceType>`
- `selectedPlace: CulturalPlace | null`
- `hoveredPlace: CulturalPlace | null`
- `visibleFilteredPlaces: CulturalPlace[]`
- `map: L.Map | null` (phase 4+)
- `markerClusterGroup: L.MarkerClusterGroup | null` (phase 4+)
- `markersById: Map<string, L.Marker>` (phase 4+)

## Strategie de separation

### Composant `App`

Responsabilites:

- composer la page (header + zone carte/panel)
- rester minimal et lisible
- servir de shell d'entree de la feature

### Service `CultureMapStateService`

Responsabilites:

- charger le dataset mock local
- stocker l'etat de feature (filtres, hover, selection)
- exposer les signaux calcules (`visibleFilteredPlaces`)
- centraliser les mutations (`toggleType`, `setHoveredPlace`, `toggleSelectedPlace`)

### Composant `MapViewComponent`

Responsabilites:

- phase 3: placeholder de carte + lecture etat hover/selection depuis le store
- phase 4+: initialiser la carte Leaflet
- phase 4+: creer/gerer markers + clusters
- phase 4/5+: brancher les evenements Leaflet (`moveend`, clic marker)
- appliquer les etats visuels des markers (`hovered`, `selected`)

### Composant `RightPanelComponent`

Responsabilites:

- afficher compteur, filtres, etat vide et liste des lieux visibles
- lire les donnees utiles depuis le store
- appliquer les actions de filtre via le store
- deleguer le rendu unitaire a `PlaceCardComponent`

### Composant `PlaceCardComponent`

Responsabilites:

- afficher les details d'un lieu culturel
- gerer les etats visuels de la card (`hovered`, `selected`)
- appliquer hover/selection via le store de feature

But:

- composant UI contextuel a la feature (couplage accepte)

### Utilitaires purs (`place-filters.ts`)

Responsabilites (phase 5/8):

- appliquer filtre type
- filtrer par viewport (via bounds simplifie ou adaptateur)
- trier les lieux

But:

- rendre les tests unitaires simples, sans dependre du DOM Leaflet

## Flux de donnees (etat actuel puis cible)

### Phase 3 (actuel)

1. `CultureMapStateService` charge `allPlaces` depuis mock local
2. `App` compose `MapViewComponent` et `RightPanelComponent`
3. `RightPanelComponent` lit `visibleFilteredPlaces` et `availableTypes` depuis le store
4. `PlaceCardComponent` met a jour hover/selection via le store
5. `MapViewComponent` lit l'etat hover/selection depuis le store

### Phase 4/5+ (cible)

1. `MapViewComponent` initialise Leaflet + markers/clusters
2. `MapViewComponent` remonte / applique les changements de viewport
3. Le store combine:
   - filtre type
   - filtre viewport
   - tri
4. `RightPanelComponent` se met a jour automatiquement via `visibleFilteredPlaces`

## Clustering

- Un unique `MarkerClusterGroup` pour tous les markers
- Le panel liste des lieux, pas des clusters
- Le cluster n'affecte pas la logique de visibilite (visibilite = coordonnees dans bounds)

## Strategy marker highlight

Deux niveaux d'etat visuel:

- `selected`: style prioritaire
- `hovered`: style secondaire

Implementation recommandee:

- `L.divIcon` custom pour controler les classes CSS (`is-selected`, `is-hovered`) ou un attribut `data-state`
- Fonction de refresh de l'icone du marker a partir de l'etat courant

## Contrats de composants (phase 3 actuelle)

### `MapViewComponent`

- lit le store de feature (`CultureMapStateService`)
- pas de Leaflet branche en phase 3 (placeholder UI)

### `RightPanelComponent`

- lit les listes / filtres depuis le store
- applique `toggleType(...)` via le store
- delegue le rendu des items a `PlaceCardComponent`

### `PlaceCardComponent`

Inputs:

- `place: CulturalPlace`

Etat / actions:

- derive `selected/hovered` depuis le store (a partir de `place`)
- met a jour hover/selection via le store

## Integration Tailwind / styles globaux

- `src/styles.css`: `@import "tailwindcss";`
- Imports CSS Leaflet + MarkerCluster a ajouter dans la config Angular (`angular.json`) ou dans `styles.css` si resolu par build
- CSS custom minimal pour:
  - conteneur Leaflet
  - marker custom
  - ajustements cluster/Leaflet

Note pratique Angular + Tailwind:

- Eviter les bindings Angular du type `[class.bg-.../10]` (peu ergonomiques pour les IDE)
- Preferer `data-state` + variantes Tailwind (`data-[state=selected]:...`)
