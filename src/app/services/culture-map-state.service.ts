import { computed, Injectable, signal } from '@angular/core';
import { RENNES_CULTURAL_PLACES } from '../data/rennes-cultural-places.mock';
import { CulturalPlace, CulturalPlaceType } from '../models/cultural-place.model';
import {
  filterPlacesByTypes,
  filterPlacesByViewport,
  sortPlacesByName,
  type ViewportBounds,
} from '../utils/place-filters';

@Injectable({
  providedIn: 'root',
})
export class CultureMapStateService {
  public readonly allPlaces = RENNES_CULTURAL_PLACES;
  public readonly availableTypes = Object.values(CulturalPlaceType) as readonly CulturalPlaceType[];

  private readonly selectedTypesState = signal<ReadonlySet<CulturalPlaceType>>(new Set());
  private readonly selectedPlaceState = signal<CulturalPlace | null>(null);
  private readonly hoveredPlaceState = signal<CulturalPlace | null>(null);
  private readonly viewportBoundsState = signal<ViewportBounds | null>(null);

  public readonly selectedPlace = this.selectedPlaceState.asReadonly();
  public readonly hoveredPlace = this.hoveredPlaceState.asReadonly();

  public readonly visibleFilteredPlaces = computed(() => {
    const typeFilteredPlaces = filterPlacesByTypes(this.allPlaces, this.selectedTypesState());
    const viewportFilteredPlaces = filterPlacesByViewport(typeFilteredPlaces, this.viewportBoundsState());

    return sortPlacesByName(viewportFilteredPlaces);
  });

  isTypeSelected(type: CulturalPlaceType): boolean {
    return this.selectedTypesState().has(type);
  }

  isPlaceSelected(place: CulturalPlace): boolean {
    return this.selectedPlaceState()?.id === place.id;
  }

  isPlaceHovered(place: CulturalPlace): boolean {
    return this.hoveredPlaceState()?.id === place.id;
  }

  toggleType(type: CulturalPlaceType): void {
    this.selectedTypesState.update((current) => {
      const next = new Set(current);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }

      return next;
    });
  }

  setViewportBounds(bounds: ViewportBounds): void {
    this.viewportBoundsState.set(bounds);
  }

  clearViewportBounds(): void {
    this.viewportBoundsState.set(null);
  }

  setHoveredPlace(place: CulturalPlace | null): void {
    this.hoveredPlaceState.set(place);
  }

  toggleSelectedPlace(place: CulturalPlace): void {
    this.selectedPlaceState.update((current) => (current?.id === place.id ? null : place));
  }
}
