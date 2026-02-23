import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PlaceCardComponent } from '../place-card/place-card.component';
import { CulturalPlace, CulturalPlaceType } from '../../models/cultural-place.model';

@Component({
  selector: 'app-right-panel',
  imports: [PlaceCardComponent],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent {
  readonly visiblePlaces = input.required<readonly CulturalPlace[]>();
  readonly selectedTypes = input<readonly CulturalPlaceType[]>([]);
  readonly selectedPlaceId = input<string | null>(null);
  readonly hoveredPlaceId = input<string | null>(null);
  readonly availableTypes = input<readonly CulturalPlaceType[]>([]);

  readonly typeToggled = output<CulturalPlaceType>();
  readonly placeHovered = output<string | null>();
  readonly placeSelected = output<string>();

  protected readonly visibleCountLabel = computed(() => {
    const count = this.visiblePlaces().length;
    return `${count} lieu${count > 1 ? 'x' : ''}`;
  });

  protected isTypeSelected(type: CulturalPlaceType): boolean {
    return this.selectedTypes().includes(type);
  }

  protected onTypeToggle(type: CulturalPlaceType): void {
    this.typeToggled.emit(type);
  }

  protected onCardHover(placeId: string | null): void {
    this.placeHovered.emit(placeId);
  }

  protected onCardSelect(placeId: string): void {
    this.placeSelected.emit(placeId);
  }
}
