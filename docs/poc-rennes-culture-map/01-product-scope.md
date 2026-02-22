# 01 - Product Scope

## Vision du PoC

Construire une page unique qui permet a un utilisateur d'explorer des lieux culturels reels de Rennes sur une carte, avec une liste contextuelle qui se met a jour selon la zone affichee.

Le PoC doit montrer la valeur de la synchronisation carte + panel pour une navigation geographique simple.

## Problematique metier (inventee pour le PoC)

"Comment aider un utilisateur a decouvrir des lieux culturels adaptes a la zone de Rennes qu'il est en train d'explorer, sans surcharger l'interface ?"

## Public cible (PoC)

- Equipe produit / technique (demonstration interne)
- Parties prenantes qui veulent valider l'approche UX

## Objectifs de demonstration

- Montrer qu'Angular peut piloter une experience cartographique reactive
- Illustrer la synchronisation viewport -> panel
- Montrer la gestion de densite avec clustering
- Valider des interactions de focus entre liste et carte

## Perimetre IN

- Angular standalone
- Leaflet + OpenStreetMap
- Donnees mock locales (lieux reels de Rennes)
- Filtres par type de lieu culturel
- Panel liste des lieux visibles dans le viewport
- Clusters au dezoom
- Hover/clic depuis panel vers carte
- Clic marker vers panel
- UI TailwindCSS

## Perimetre OUT (V1)

- Backend / base de donnees
- API live (OSM Overpass, open data Rennes)
- Recherche texte
- Filtres par quartier
- Routing multi-pages
- Auth
- Telemetrie/analytics

## Criteres de succes

- La carte s'ouvre sur Rennes avec points et clusters visibles
- Le panel varie quand on deplace/zoome la carte
- Le filtre par type reduit la liste visible
- Cliquer une card permet de localiser rapidement le point sur la carte
- Les superpositions de points sont geres via cluster
