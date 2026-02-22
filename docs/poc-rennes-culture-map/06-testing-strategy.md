# 06 - Testing Strategy

## Objectif

Assurer la fiabilite du PoC sur la logique critique:

- filtrage type
- filtrage viewport
- tri
- selection / hover

## Pyramide de tests (PoC)

### 1. Tests unitaires (priorite haute)

Portee:

- fonctions pures dans `place-filters.ts`
- helpers de tri / type / viewport

Cas a couvrir:

- aucun filtre type actif => tous les lieux
- un type actif => sous-ensemble correct
- plusieurs types actifs => union correcte
- tri alphabetique sur `name`
- viewport inclut / exclut correctement

## 2. Tests composant (priorite moyenne)

Portee:

- logique Angular du composant `App` (container)
- rendu et evenements de `RightPanelComponent`
- rendu et evenements de `PlaceCardComponent`
- contrats d'events de `MapViewComponent` (tests avec mocks/stubs)
- etats `selectedPlaceId`, `hoveredPlaceId`, `visibleFilteredPlaces`

Cas a couvrir:

- toggle filtre met a jour l'etat
- hover card met a jour `hoveredPlaceId`
- click card met a jour `selectedPlaceId`
- etat vide affiche si la liste est vide
- `RightPanelComponent` relaie les evenements emis par `PlaceCardComponent`
- `App` met a jour les props envoyees a `MapViewComponent` apres interaction panel

Note:

- Eviter de dependre du rendu Leaflet reel dans les tests unitaires Angular
- Mock/stub des appels `map`, `flyTo`, `getBounds` si necessaire
- Prioriser les tests sur les `@Input()` / `@Output()` de `MapViewComponent` plutot que sur le DOM Leaflet

## 3. Recette manuelle (obligatoire pour PoC carto)

### Scenarios

1. Chargement initial sur Rennes
2. Presence clusters au dezoom
3. Deplacement carte => panel synchronise
4. Zoom carte => panel synchronise
5. Filtre type simple
6. Filtres multi-selection
7. Hover card => marker surligne (si marker individuel visible)
8. Click card => zoom/centrage
9. Click marker => card correspondante surlignee
10. Etat vide (zone vide ou filtre trop restrictif)

## Non objectifs de tests (V1)

- tests E2E browser automatises
- performance benchmark
- snapshot visuels exhaustifs

## Strategie de debug

- Ajouter logs temporaires sur `moveend` et `visibleFilteredPlaces.length`
- Exposer temporairement les IDs selectionnes/hoveres dans le template en dev si besoin
- Verifier `bounds.contains` avec cas de coordonnees connues
