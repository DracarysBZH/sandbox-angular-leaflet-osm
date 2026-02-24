import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PlaceCardComponent } from '../place-card/place-card.component';
import { CulturalPlaceType } from '../../models/cultural-place.model';
import { CultureMapStateService } from '../../services/culture-map-state.service';

@Component({
  selector: 'app-right-panel',
  imports: [PlaceCardComponent],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent {
  protected readonly cultureMapStateService = inject(CultureMapStateService);

  protected readonly visibleCountLabel = computed(() => {
    const count = this.cultureMapStateService.visibleFilteredPlaces().length;
    return `${count} lieu${count > 1 ? 'x' : ''}`;
  });

  protected isTypeSelected(type: CulturalPlaceType): boolean {
    return this.cultureMapStateService.isTypeSelected(type);
  }

  protected onTypeToggle(type: CulturalPlaceType): void {
    this.cultureMapStateService.toggleType(type);
  }
}
