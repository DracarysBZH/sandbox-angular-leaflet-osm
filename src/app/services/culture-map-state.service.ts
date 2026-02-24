import { computed, Injectable, signal } from '@angular/core';
import { RENNES_CULTURAL_PLACES } from '../data/rennes-cultural-places.mock';
import { CulturalPlaceType } from '../models/cultural-place.model';

@Injectable({
  providedIn: 'root',
})
export class CultureMapStateService {
  readonly allPlaces = RENNES_CULTURAL_PLACES;
  readonly availableTypes = Object.values(CulturalPlaceType) as readonly CulturalPlaceType[];

  private readonly selectedTypesState = signal<readonly CulturalPlaceType[]>([]);
  private readonly selectedPlaceIdState = signal<string | null>(null);
  private readonly hoveredPlaceIdState = signal<string | null>(null);

  readonly selectedTypes = this.selectedTypesState.asReadonly();
  readonly selectedPlaceId = this.selectedPlaceIdState.asReadonly();
  readonly hoveredPlaceId = this.hoveredPlaceIdState.asReadonly();

  readonly visibleFilteredPlaces = computed(() => {
    const activeTypes = this.selectedTypesState();
    const places = activeTypes.length
      ? this.allPlaces.filter((place) => activeTypes.includes(place.type))
      : this.allPlaces;

    return [...places].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  });

  toggleType(type: CulturalPlaceType): void {
    this.selectedTypesState.update((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );
  }

  setHoveredPlace(placeId: string | null): void {
    this.hoveredPlaceIdState.set(placeId);
  }

  toggleSelectedPlace(placeId: string): void {
    this.selectedPlaceIdState.update((current) => (current === placeId ? null : placeId));
  }

  selectMarker(placeId: string): void {
    this.toggleSelectedPlace(placeId);
  }

  handleViewportChanged(): void {
    // Phase 5: viewport filtering will be handled here.
  }
}
