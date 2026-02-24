import { CulturalPlaceType } from '../models/cultural-place.model';

export interface PlaceTypeMarkerVisual {
  readonly label: string;
  readonly iconSvg: string;
}

export const PLACE_TYPE_MARKER_VISUALS: Readonly<Record<CulturalPlaceType, PlaceTypeMarkerVisual>> =
  {
    [CulturalPlaceType.Museum]: {
      label: 'Musée',
      iconSvg:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-4 9 4"/><path d="M5 10v7"/><path d="M9 10v7"/><path d="M15 10v7"/><path d="M19 10v7"/><path d="M3 19h18"/><path d="M2 9h20"/></svg>',
    },
    [CulturalPlaceType.Gallery]: {
      label: 'Galerie',
      iconSvg:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 14l3-3 2 2 3-4 2 5"/><circle cx="9" cy="9" r="1.2"/></svg>',
    },
    [CulturalPlaceType.Theater]: {
      label: 'Théâtre',
      iconSvg:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v10a7 7 0 0 1-14 0z"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M9 14c1.6 1.4 4.4 1.4 6 0"/></svg>',
    },
    [CulturalPlaceType.Library]: {
      label: 'Bibliothèque',
      iconSvg:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h10a2 2 0 0 1 2 2v12H8a2 2 0 0 0-2 2z"/><path d="M6 5v16"/><path d="M10 9h5"/><path d="M10 12h5"/></svg>',
    },
    [CulturalPlaceType.Heritage]: {
      label: 'Patrimoine',
      iconSvg:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16"/><path d="M5 19V9l3 2V9l4 2V7l4 2v10"/><path d="M9 13h.01"/><path d="M15 13h.01"/></svg>',
    },
    [CulturalPlaceType.ArtsCenter]: {
      label: 'Centre d’art',
      iconSvg:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l1.3 3.7L17 9l-3.7 1.3L12 14l-1.3-3.7L7 9l3.7-1.3z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/><path d="M6 15l.6 1.6L8 17l-1.4.5L6 19l-.6-1.5L4 17l1.4-.4z"/></svg>',
    },
  };
