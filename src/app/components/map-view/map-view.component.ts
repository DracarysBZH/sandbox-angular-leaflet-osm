import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CulturalPlace } from '../../models/cultural-place.model';

export interface MapViewportBounds {
  readonly north: number;
  readonly south: number;
  readonly east: number;
  readonly west: number;
}

@Component({
  selector: 'app-map-view',
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent {
  readonly places = input.required<readonly CulturalPlace[]>();
  readonly selectedPlaceId = input<string | null>(null);
  readonly hoveredPlaceId = input<string | null>(null);

  readonly viewportChanged = output<MapViewportBounds>();
  readonly markerSelected = output<string>();

  protected readonly selectedPlaceName = computed(() => {
    const selectedId = this.selectedPlaceId();
    if (!selectedId) {
      return null;
    }

    return this.places().find((place) => place.id === selectedId)?.name ?? null;
  });

  protected readonly hoveredPlaceName = computed(() => {
    const hoveredId = this.hoveredPlaceId();
    if (!hoveredId) {
      return null;
    }

    return this.places().find((place) => place.id === hoveredId)?.name ?? null;
  });

  protected emitMockViewport(): void {
    this.viewportChanged.emit({
      north: 48.14,
      south: 48.07,
      east: -1.62,
      west: -1.72,
    });
  }
}
