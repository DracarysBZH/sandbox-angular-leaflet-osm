import { TestBed } from '@angular/core/testing';
import { CulturalPlaceType } from '../models/cultural-place.model';
import { CultureMapStateService } from './culture-map-state.service';

describe('CultureMapStateService', () => {
  let service: CultureMapStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CultureMapStateService);
  });

  it('should expose all place types as available filters', () => {
    expect(service.availableTypes).toEqual(Object.values(CulturalPlaceType));
  });

  it('should sort visible places by name when no filter is selected', () => {
    const visiblePlaces = service.visibleFilteredPlaces();
    const names = visiblePlaces.map((place) => place.name);
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b, 'fr'));

    expect(names).toEqual(sortedNames);
  });

  it('should filter visible places by selected type and toggle the filter off', () => {
    const targetType = CulturalPlaceType.Museum;

    service.toggleType(targetType);
    const museums = service.visibleFilteredPlaces();

    expect(service.isTypeSelected(targetType)).toBe(true);
    expect(museums.length).toBeGreaterThan(0);
    expect(museums.every((place) => place.type === targetType)).toBe(true);

    service.toggleType(targetType);

    expect(service.isTypeSelected(targetType)).toBe(false);
    expect(service.visibleFilteredPlaces().length).toBe(service.allPlaces.length);
  });

  it('should manage hovered place state', () => {
    const place = service.allPlaces[0];

    service.setHoveredPlace(place);

    expect(service.hoveredPlace()).toBe(place);
    expect(service.isPlaceHovered(place)).toBe(true);

    service.setHoveredPlace(null);

    expect(service.hoveredPlace()).toBeNull();
    expect(service.isPlaceHovered(place)).toBe(false);
  });

  it('should toggle selected place state', () => {
    const place = service.allPlaces[0];

    service.toggleSelectedPlace(place);

    expect(service.selectedPlace()).toBe(place);
    expect(service.isPlaceSelected(place)).toBe(true);

    service.toggleSelectedPlace(place);

    expect(service.selectedPlace()).toBeNull();
    expect(service.isPlaceSelected(place)).toBe(false);
  });
});
