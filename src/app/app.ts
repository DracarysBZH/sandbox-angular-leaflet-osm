import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MapViewComponent } from './components/map-view/map-view.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { RENNES_CULTURAL_PLACES } from './data/rennes-cultural-places.mock';
import { CulturalPlaceType } from './models/cultural-place.model';

@Component({
  selector: 'app-root',
  imports: [MapViewComponent, RightPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly allPlaces = RENNES_CULTURAL_PLACES;
  protected readonly availableTypes = Object.values(CulturalPlaceType) as readonly CulturalPlaceType[];

  protected readonly selectedTypes = signal<readonly CulturalPlaceType[]>([]);
  protected readonly selectedPlaceId = signal<string | null>(null);
  protected readonly hoveredPlaceId = signal<string | null>(null);

  protected readonly visibleFilteredPlaces = computed(() => {
    const activeTypes = this.selectedTypes();
    const places = activeTypes.length
      ? this.allPlaces.filter((place) => activeTypes.includes(place.type))
      : this.allPlaces;

    return [...places].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  });

  protected toggleType(type: CulturalPlaceType): void {
    this.selectedTypes.update((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );
  }

  protected setHoveredPlace(placeId: string | null): void {
    this.hoveredPlaceId.set(placeId);
  }

  protected selectPlace(placeId: string): void {
    this.selectedPlaceId.update((current) => (current === placeId ? null : placeId));
  }

  protected handleMarkerSelected(placeId: string): void {
    this.selectPlace(placeId);
  }

  protected handleViewportChanged(): void {
    // Phase 5: viewport filtering will be handled here.
  }
}
