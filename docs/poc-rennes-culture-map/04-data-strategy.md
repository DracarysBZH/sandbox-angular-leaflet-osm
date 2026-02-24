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

Implementation retenue:

- `CulturalPlaceType` en `enum` string (contrat front/back explicite)
- `CulturalPlace` en interface TypeScript stricte

```ts
export enum CulturalPlaceType {
  Museum = 'museum',
  Gallery = 'gallery',
  Theater = 'theater',
  Library = 'library',
  Heritage = 'heritage',
  ArtsCenter = 'arts-center',
}

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

## Note implementation actuelle

- Le mock est un fichier TS local strictement type
- Pas de helper de validation runtime dans l'application (choix volontaire pour garder la feature legere)
- Si besoin, les checks de coherence du mock pourront etre ajoutes en tests (dataset/unit)
