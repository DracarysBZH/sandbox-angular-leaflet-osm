import { CulturalPlaceType } from '../models/cultural-place.model';

export interface PlaceTypeMarkerVisual {
  readonly label: string;
  readonly iconPath: string;
}

export const PLACE_TYPE_MARKER_VISUALS: Readonly<Record<CulturalPlaceType, PlaceTypeMarkerVisual>> =
  {
    [CulturalPlaceType.Museum]: {
      label: 'Musée',
      iconPath: 'icons/map-markers/museum.svg',
    },
    [CulturalPlaceType.Gallery]: {
      label: 'Galerie',
      iconPath: 'icons/map-markers/gallery.svg',
    },
    [CulturalPlaceType.Theater]: {
      label: 'Théâtre',
      iconPath: 'icons/map-markers/theater.svg',
    },
    [CulturalPlaceType.Library]: {
      label: 'Bibliothèque',
      iconPath: 'icons/map-markers/library.svg',
    },
    [CulturalPlaceType.Heritage]: {
      label: 'Patrimoine',
      iconPath: 'icons/map-markers/heritage.svg',
    },
    [CulturalPlaceType.ArtsCenter]: {
      label: 'Centre d’art',
      iconPath: 'icons/map-markers/arts-center.svg',
    },
  };
