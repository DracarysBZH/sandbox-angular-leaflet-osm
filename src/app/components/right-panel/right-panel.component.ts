import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PlaceCardComponent } from '../place-card/place-card.component';
import { CulturalPlace, CulturalPlaceType } from '../../models/cultural-place.model';
import { CultureMapStateService } from '../../services/culture-map-state.service';

@Component({
  selector: 'app-right-panel',
  imports: [PlaceCardComponent],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent {
  private readonly store = inject(CultureMapStateService);

  readonly visiblePlaces = input.required<readonly CulturalPlace[]>();
  readonly selectedTypes = input<readonly CulturalPlaceType[]>([]);
  readonly selectedPlaceId = input<string | null>(null);
  readonly hoveredPlaceId = input<string | null>(null);
  readonly availableTypes = input<readonly CulturalPlaceType[]>([]);

  protected readonly visibleCountLabel = computed(() => {
    const count = this.visiblePlaces().length;
    return `${count} lieu${count > 1 ? 'x' : ''}`;
  });

  protected isTypeSelected(type: CulturalPlaceType): boolean {
    return this.selectedTypes().includes(type);
  }

  protected onTypeToggle(type: CulturalPlaceType): void {
    this.store.toggleType(type);
  }

  protected onCardHover(placeId: string | null): void {
    this.store.setHoveredPlace(placeId);
  }

  protected onCardSelect(placeId: string): void {
    this.store.toggleSelectedPlace(placeId);
  }
}
