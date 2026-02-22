# PoC Rennes Culture Map - Feature Planning

Ce dossier decompose la strategie de developpement du PoC Angular + Leaflet + OpenStreetMap pour Rennes.

## Objectif

Documenter un plan de dev actionnable, par sous-features, pour implementer:

- une carte Leaflet/OSM sur Rennes,
- un panel synchronise avec les points visibles,
- des filtres par type de lieu culturel,
- du clustering au dezoom,
- des interactions panel <-> carte.

## Structure des documents

- `01-product-scope.md`: vision produit, objectifs, perimetre et succes
- `02-functional-spec.md`: comportements fonctionnels et UX
- `03-technical-architecture.md`: architecture Angular, Leaflet, et etat UI
- `04-data-strategy.md`: dataset mock Rennes reel, modele et regles de qualite
- `05-implementation-roadmap.md`: ordre de dev recommande et taches par sprint
- `06-testing-strategy.md`: tests unitaires, integration, recette
- `07-risks-and-decisions.md`: risques techniques, decisions et mitigations

## Convention de travail

- Priorite a un PoC stable et demonstrable.
- Pas d'API externe runtime dans la V1.
- Chaque tache implementee doit pouvoir etre demontree manuellement.
- Les decisions verrouillees sont centralisees dans `07-risks-and-decisions.md`.
