# 02 - Functional Spec

## Ecran unique

### Layout desktop

- Colonne gauche: carte (~65%)
- Colonne droite: panel (~35%)
- Hauteur totale: viewport (`70vh`)
- Marge haute et sur les côté

### Layout mobile/tablette

- Carte en haut (hauteur fixe ou ~40vh)
- Panel en dessous (scrollable)

## Carte

- Base map: tuiles OpenStreetMap
- Centre initial: Rennes
- Zoom initial: ~13
- Interactions activees:
  - drag
  - zoom molette
  - zoom boutons Leaflet
  - clic markers
  - clic clusters

## Panel de droite

Le panel affiche uniquement les lieux qui respectent:

1. `dans le viewport courant`
2. `matchent les filtres type actifs`

## Filtres par type

### UX attendue

- Chips/boutons en haut du panel
- Multi-selection autorisee
- Etat actif/inactif visuel clair

### Regle fonctionnelle

- Aucun type selectionne = tous les types
- Un ou plusieurs types selectionnes = union des types selectionnes

## Interactions panel -> carte

### Hover sur card

- Met a jour `hoveredPlaceId`
- Tente de mettre le marker individuel en surbrillance
- Si le point est encore clusterise: pas de zoom automatique

### Mouseout sur card

- Retire la surbrillance hover
- Conserve la selection si la card etait selectionnee

### Clic sur card

- Met a jour `selectedPlaceId`
- Centre/zoome la carte sur le lieu (`flyTo` ou `setView`)
- Zoom cible: `15` ou `16`
- Le point doit devenir identifiable rapidement (marker individuel ou cluster eclate par zoom)

## Interactions carte -> panel

### Clic marker

- Selectionne le lieu
- Met en surbrillance la card correspondante
- Scroll du panel vers la card (si implemente en V1)

### Clic cluster

- Zoom sur le cluster (comportement plugin standard)

### Move / zoom carte

- Recalcul de la liste sur `moveend`
- Le panel est la vue derivee de l'etat carte + filtres

## Etats UI obligatoires

- Etat normal: liste de cards
- Etat vide: aucun lieu visible dans la zone (ou pour les filtres actifs)
- Compteur: `X lieux visibles`

## Cards (contenu)

- Nom du lieu
- Type de lieu
- Adresse
- Description courte
- Tags
- Horaires / site web (si dispo dans le mock)
