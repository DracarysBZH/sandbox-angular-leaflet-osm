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
- `src/app/utils/place-filters.ts`
- `src/app/utils/place-filters.spec.ts`

## Etat UI (source de verite)

- `places: CulturalPlace[]`
- `selectedTypes: Set<CulturalPlaceType>`
- `selectedPlaceId: string | null`
- `hoveredPlaceId: string | null`
- `visibleFilteredPlaces: CulturalPlace[]`
- `map: L.Map | null`
- `markerClusterGroup: L.MarkerClusterGroup | null`
- `markersById: Map<string, L.Marker>`

## Strategie de separation

### Composant `App`

Responsabilites:
- gerer l'etat global de la page (filtres, selection, hover, lieux visibles)
- charger le dataset mock local
- orchestrer les interactions entre la carte et le panel
- composer les composants enfants (carte + panel)

### Composant `MapViewComponent`

Responsabilites:

- initialiser la carte
- creer/gerer les markers et clusters
- ecouter les evenements Leaflet
- emettre les evenements carte vers le container (`viewport`, `marker click`)
- appliquer les etats visuels des markers (`hovered`, `selected`)

### Composant `RightPanelComponent`

Responsabilites:

- afficher compteur, filtres, etat vide et liste des lieux visibles
- relayer les interactions utilisateur (hover/click sur card, toggle filtre)
- deleguer l'affichage unitaire au composant `PlaceCardComponent`

### Composant `PlaceCardComponent`

Responsabilites:

- afficher les details d'un lieu culturel
- gerer les etats visuels de la card (`hovered`, `selected`)
- emettre les interactions de card (hover/click)

But:

- composant presentational reutilisable et sans dependance Leaflet

### Utilitaires purs (`place-filters.ts`)

Responsabilites:

- appliquer filtre type
- filtrer par viewport (via bounds simplifie ou adaptateur)
- trier les lieux

But:

- rendre les tests unitaires simples, sans dependre du DOM Leaflet

## Flux de donnees

1. `App` charge `allPlaces` depuis mock local
2. `App` passe l'etat a `MapViewComponent` et `RightPanelComponent`
3. `MapViewComponent` initialise Leaflet, les markers et le `MarkerClusterGroup`
4. A chaque `moveend`, `MapViewComponent` emet le viewport courant
5. `App` applique:
   - filtre type
   - filtre viewport
   - tri
   - mise a jour de `visibleFilteredPlaces`
6. `RightPanelComponent` rend la liste et les filtres
7. Interactions UI:
   - `PlaceCardComponent` hover/click -> `RightPanelComponent` -> `App`
   - `App` met a jour `hoveredPlaceId` / `selectedPlaceId`
   - `App` transmet les changements a `MapViewComponent`
   - `MapViewComponent` applique surbrillance et zoom

## Clustering

- Un unique `MarkerClusterGroup` pour tous les markers
- Le panel liste des lieux, pas des clusters
- Le cluster n'affecte pas la logique de visibilite (visibilite = coordonnees dans bounds)

## Strategy marker highlight

Deux niveaux d'etat visuel:

- `selected`: style prioritaire
- `hovered`: style secondaire

Implementation recommandee:

- `L.divIcon` custom pour controler les classes CSS (`is-selected`, `is-hovered`)
- Fonction de refresh de l'icone du marker a partir de l'etat courant

## Contrats de composants (Inputs / Outputs)

### `MapViewComponent`

Inputs:

- `places: CulturalPlace[]`
- `selectedPlaceId: string | null`
- `hoveredPlaceId: string | null`
- `focusPlaceId: string | null` (optionnel pour declencher un zoom depuis le panel)

Outputs:

- `viewportChanged` (bounds courants)
- `markerSelected` (`placeId`)

### `RightPanelComponent`

Inputs:

- `visiblePlaces: CulturalPlace[]`
- `selectedTypes: CulturalPlaceType[]` (ou set converti)
- `selectedPlaceId: string | null`
- `hoveredPlaceId: string | null`

Outputs:

- `typeToggled` (`CulturalPlaceType`)
- `placeHovered` (`placeId | null`)
- `placeSelected` (`placeId`)

### `PlaceCardComponent`

Inputs:

- `place: CulturalPlace`
- `selected: boolean`
- `hovered: boolean`

Outputs:

- `cardHover` (`placeId | null`)
- `cardSelect` (`placeId`)

## Integration Tailwind / styles globaux

- `src/styles.css`: `@import "tailwindcss";`
- Imports CSS Leaflet + MarkerCluster a ajouter dans la config Angular (`angular.json`) ou dans `styles.css` si resolu par build
- CSS custom minimal pour:
  - conteneur Leaflet
  - marker custom
  - ajustements cluster/Leaflet
