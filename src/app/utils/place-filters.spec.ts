import { describe, expect, it } from 'vitest';
import { CulturalPlaceType, type CulturalPlace } from '../models/cultural-place.model';
import {
  filterPlacesByTypes,
  filterPlacesByViewport,
  isPlaceInsideViewport,
  sortPlacesByName,
  type ViewportBounds,
} from './place-filters';

const makePlace = (
  id: string,
  name: string,
  type: CulturalPlaceType,
  lat: number,
  lng: number,
): CulturalPlace => ({
  id,
  name,
  type,
  lat,
  lng,
  address: `Adresse ${id}`,
  city: 'Rennes',
  shortDescription: `Description ${id}`,
  tags: ['test'],
});

describe('place-filters', () => {
  const places: readonly CulturalPlace[] = [
    makePlace('1', 'Zinc', CulturalPlaceType.Museum, 48.12, -1.68),
    makePlace('2', 'Alpha', CulturalPlaceType.Gallery, 48.11, -1.67),
    makePlace('3', 'Beta', CulturalPlaceType.Theater, 48.10, -1.66),
    makePlace('4', 'WrapWest', CulturalPlaceType.Library, 10, 179.5),
    makePlace('5', 'WrapEast', CulturalPlaceType.Heritage, 10, -179.5),
  ];

  describe('filterPlacesByTypes', () => {
    it('returns the same array reference when no type is selected', () => {
      const selectedTypes = new Set<CulturalPlaceType>();

      const result = filterPlacesByTypes(places, selectedTypes);

      expect(result).toBe(places);
    });

    it('filters places matching selected types', () => {
      const selectedTypes = new Set<CulturalPlaceType>([
        CulturalPlaceType.Museum,
        CulturalPlaceType.Theater,
      ]);

      const result = filterPlacesByTypes(places, selectedTypes);

      expect(result.map((place) => place.id)).toEqual(['1', '3']);
    });
  });

  describe('isPlaceInsideViewport', () => {
    it('returns true when a place is inside standard bounds', () => {
      const viewport: ViewportBounds = {
        north: 48.13,
        south: 48.10,
        east: -1.66,
        west: -1.69,
      };

      expect(isPlaceInsideViewport(places[0], viewport)).toBe(true);
    });

    it('includes points on the viewport boundary', () => {
      const viewport: ViewportBounds = {
        north: 48.12,
        south: 48.12,
        east: -1.68,
        west: -1.68,
      };

      expect(isPlaceInsideViewport(places[0], viewport)).toBe(true);
    });

    it('returns false when latitude is outside bounds', () => {
      const viewport: ViewportBounds = {
        north: 48.09,
        south: 48.08,
        east: -1.60,
        west: -1.80,
      };

      expect(isPlaceInsideViewport(places[0], viewport)).toBe(false);
    });

    it('supports antimeridian-crossing bounds', () => {
      const viewport: ViewportBounds = {
        north: 11,
        south: 9,
        east: -179,
        west: 179,
      };

      expect(isPlaceInsideViewport(places[3], viewport)).toBe(true);
      expect(isPlaceInsideViewport(places[4], viewport)).toBe(true);
      expect(isPlaceInsideViewport(places[0], viewport)).toBe(false);
    });
  });

  describe('filterPlacesByViewport', () => {
    it('returns the same array reference when viewport is null', () => {
      const result = filterPlacesByViewport(places, null);

      expect(result).toBe(places);
    });

    it('filters places inside the viewport', () => {
      const viewport: ViewportBounds = {
        north: 48.115,
        south: 48.095,
        east: -1.655,
        west: -1.675,
      };

      const result = filterPlacesByViewport(places, viewport);

      expect(result.map((place) => place.id)).toEqual(['2', '3']);
    });
  });

  describe('sortPlacesByName', () => {
    it('returns a new array sorted by french locale name', () => {
      const source = [places[0], places[2], places[1]];

      const result = sortPlacesByName(source);

      expect(result.map((place) => place.name)).toEqual(['Alpha', 'Beta', 'Zinc']);
      expect(result).not.toBe(source);
      expect(source.map((place) => place.name)).toEqual(['Zinc', 'Beta', 'Alpha']);
    });
  });
});
