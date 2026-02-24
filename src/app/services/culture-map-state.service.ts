import { computed, Injectable, signal } from '@angular/core';
import { RENNES_CULTURAL_PLACES } from '../data/rennes-cultural-places.mock';
import { CulturalPlace, CulturalPlaceType } from '../models/cultural-place.model';

@Injectable({
  providedIn: 'root',
})
export class CultureMapStateService {
  public readonly allPlaces = RENNES_CULTURAL_PLACES;
  public readonly availableTypes = Object.values(CulturalPlaceType) as readonly CulturalPlaceType[];

  private readonly selectedTypesState = signal<ReadonlySet<CulturalPlaceType>>(new Set());
  private readonly selectedPlaceIdState = signal<string | null>(null);
  private readonly hoveredPlaceIdState = signal<string | null>(null);
  private readonly placesById = computed(
    () => new Map(this.allPlaces.map((place) => [place.id, place] as const)),
  );

  public readonly selectedTypes = computed(() => [...this.selectedTypesState()]);
  public readonly selectedPlaceId = this.selectedPlaceIdState.asReadonly();
  public readonly hoveredPlaceId = this.hoveredPlaceIdState.asReadonly();

  public readonly visibleFilteredPlaces = computed(() => {
    const activeTypes = this.selectedTypesState();
    const places = activeTypes.size
      ? this.allPlaces.filter((place) => activeTypes.has(place.type))
      : this.allPlaces;

    return [...places].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  });

  isTypeSelected(type: CulturalPlaceType): boolean {
    return this.selectedTypesState().has(type);
  }

  isPlaceSelected(placeId: string): boolean {
    return this.selectedPlaceIdState() === placeId;
  }

  isPlaceHovered(placeId: string): boolean {
    return this.hoveredPlaceIdState() === placeId;
  }

  getPlaceById(placeId: string | null): CulturalPlace | null {
    if (!placeId) {
      return null;
    }

    return this.placesById().get(placeId) ?? null;
  }

  public readonly selectedPlace = computed(() => this.getPlaceById(this.selectedPlaceIdState()));
  public readonly hoveredPlace = computed(() => this.getPlaceById(this.hoveredPlaceIdState()));

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

  setHoveredPlace(placeId: string | null): void {
    this.hoveredPlaceIdState.set(placeId);
  }

  toggleSelectedPlace(placeId: string): void {
    this.selectedPlaceIdState.update((current) => (current === placeId ? null : placeId));
  }
}
