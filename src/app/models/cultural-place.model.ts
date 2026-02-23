export enum CulturalPlaceType {
  Museum = 'museum',
  Gallery = 'gallery',
  Theater = 'theater',
  Library = 'library',
  Heritage = 'heritage',
  ArtsCenter = 'arts-center',
}

export interface CulturalPlace {
  readonly id: string;
  readonly name: string;
  readonly type: CulturalPlaceType;
  readonly lat: number;
  readonly lng: number;
  readonly address: string;
  readonly city: 'Rennes';
  readonly shortDescription: string;
  readonly openingHours?: string;
  readonly website?: string;
  readonly tags: readonly string[];
}
