import { CulturalPlace, CulturalPlaceType } from '../models/cultural-place.model';

export interface ViewportBounds {
  readonly north: number;
  readonly south: number;
  readonly east: number;
  readonly west: number;
}

export const filterPlacesByTypes = (
  places: readonly CulturalPlace[],
  selectedTypes: ReadonlySet<CulturalPlaceType>,
): readonly CulturalPlace[] =>
  selectedTypes.size
    ? places.filter((place) => selectedTypes.has(place.type))
    : places;

export const filterPlacesByViewport = (
  places: readonly CulturalPlace[],
  viewport: ViewportBounds | null,
): readonly CulturalPlace[] =>
  viewport
    ? places.filter((place) => isPlaceInsideViewport(place, viewport))
    : places;

export const isPlaceInsideViewport = (place: CulturalPlace, viewport: ViewportBounds): boolean => {
  const isWithinLatitude = place.lat >= viewport.south && place.lat <= viewport.north;

  if (!isWithinLatitude) {
    return false;
  }

  // Handles standard bounds and antimeridian crossing.
  if (viewport.west <= viewport.east) {
    return place.lng >= viewport.west && place.lng <= viewport.east;
  }

  return place.lng >= viewport.west || place.lng <= viewport.east;
};

export const sortPlacesByName = (places: readonly CulturalPlace[]): CulturalPlace[] =>
  [...places].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
