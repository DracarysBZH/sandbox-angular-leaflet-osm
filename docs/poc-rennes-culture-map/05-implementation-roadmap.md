# 05 - Implementation Roadmap

## Strategie globale

Construire la feature par couches, dans cet ordre:

1. socle projet (deps/styles)
2. donnees/types
3. architecture composants (container + carte + panel + card)
4. carte + markers
5. panel synchronise viewport
6. filtres
7. interactions avancees (hover/selection)
8. tests et stabilisation

## Phase 1 - Setup technique

### Taches

- Installer dependances:
  - `leaflet`
  - `leaflet.markercluster`
  - types associes si necessaires
- Verifier Tailwind actif sur templates Angular
- Ajouter imports CSS Leaflet / MarkerCluster

### Definition of done

- `npm run start` affiche une page Angular sans erreur
- Tailwind applique des classes visibles
- Leaflet CSS charge correctement

## Phase 2 - Types + mock Rennes

### Taches

- Creer `CulturalPlaceType` et `CulturalPlace`
- Creer `rennes-cultural-places.mock.ts` (40-60 lieux)
- Ajouter helpers de validation simples (optionnel)

### Definition of done

- Le mock est importable et typage strict OK
- Les coordonnees couvrent Rennes et produisent des zones denses

## Phase 3 - Architecture composants

### Taches

- Creer `MapViewComponent`
- Creer `RightPanelComponent`
- Creer `PlaceCardComponent`
- Definir les `@Input()` / `@Output()` entre `App` et les composants
- Garder `App` comme container (etat + orchestration)

### Definition of done

- Le template `App` reste simple (composition des enfants)
- Les responsabilites Leaflet sont isolees dans `MapViewComponent`
- Les cards sont rendues via `PlaceCardComponent`

## Phase 4 - Carte + clusters

### Taches

- Initialiser map Leaflet (AfterViewInit)
- Configurer OSM tile layer
- Corriger les icones Leaflet par defaut (asset path ou icons custom)
- Creer `MarkerClusterGroup`
- Generer un marker par lieu et stocker dans `markersById`
- Gerer `ngOnDestroy` / `map.remove()`

### Definition of done

- La carte affiche Rennes
- Les points sont visibles
- Les clusters apparaissent au dezoom et se decomposent au zoom

## Phase 5 - Panel synchronise au viewport

### Taches

- Implementer utilitaires de filtrage viewport
- Ecouter `moveend`
- Calculer `visibleFilteredPlaces` (sans filtre type au debut)
- Afficher compteur + liste de cards
- Ajouter etat vide

### Definition of done

- Le panel change quand on deplace/zoome la carte
- La liste est triee par nom

## Phase 6 - Filtres par type

### Taches

- Ajouter UI de filtres (chips Tailwind)
- Gerer `selectedTypes` (multi-selection)
- Recalculer `visibleFilteredPlaces` a chaque toggle
- Afficher etat visuel actif des filtres

### Definition of done

- Les filtres modifient la liste visible
- Aucun filtre selectionne => tous types

## Phase 7 - Interactions panel/carte

### Taches

- Hover card => `hoveredPlaceId` + refresh style marker
- Mouseout => reset hover
- Click card => zoom/centrage + selection
- Click marker => selection + sync panel
- (Optionnel V1) scroll to card selectionnee

### Definition of done

- L'utilisateur peut retrouver visuellement un lieu depuis la liste
- La selection est visible cote carte et panel

## Phase 8 - Stabilisation + tests

### Taches

- Tester utilitaires de filtrage/sort
- Tester comportements de selection/hover (logique pure)
- Nettoyer CSS marker custom / etats
- Recette manuelle complete

### Definition of done

- Tests unitaires passent
- Aucun comportement bloquant dans la recette

## Ordre de commits recommande

- `chore: setup leaflet markercluster styles`
- `feat: add rennes cultural places mock dataset`
- `feat: split ui into map panel and place-card components`
- `feat: render map with clustered markers`
- `feat: sync right panel with viewport`
- `feat: add type filters`
- `feat: add panel to map hover and selection interactions`
- `test: cover filtering and viewport logic`
