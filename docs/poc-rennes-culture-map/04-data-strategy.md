# 04 - Data Strategy

## Objectif du dataset mock

Fournir un dataset local credible pour demontrer le comportement de la feature sans dependre d'une API.

## Contraintes de qualite

- Lieux reels de Rennes (noms/adresses/coordonnees plausibles)
- 40 a 60 elements
- Categories variees
- IDs stables
- Descriptions courtes et homogenes

## Modele de donnees

```ts
export type CulturalPlaceType =
  | 'museum'
  | 'gallery'
  | 'theater'
  | 'library'
  | 'heritage'
  | 'arts-center';

export interface CulturalPlace {
  id: string;
  name: string;
  type: CulturalPlaceType;
  lat: number;
  lng: number;
  address: string;
  city: 'Rennes';
  shortDescription: string;
  openingHours?: string;
  website?: string;
  tags: string[];
}
```

## Strategie de construction du mock

### Source de constitution (hors runtime)

- Recherche manuelle des lieux reels (noms/adresses)
- Saisie dans un fichier TS local
- Verifications visuelles sur une carte (coherence des lat/lng)

### Repartition cible par type (indicative)

- `library`: 8-12
- `theater`: 6-10
- `museum`: 4-8
- `gallery`: 6-10
- `arts-center`: 6-10
- `heritage`: 8-12

## Regles de formatage des IDs

- Format recommande: `type-slug`
- Exemples:
  - `museum-mba-rennes`
  - `library-champs-libres`
  - `theater-tnb`

## Tags (pour enrichissement visuel)

Tags courts utiles pour demo:

- `famille`
- `gratuit`
- `exposition`
- `spectacle`
- `patrimoine`
- `centre-ville`
- `etudiant`

## Plan de validation du dataset

- Verifier toutes les coordonnees dans/around Rennes
- Verifier unicite des IDs
- Verifier types valides
- Verifier presence des champs obligatoires
- Verifier qu'un dezoom montre des clusters (densite suffisante)
