import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PlaceCardComponent } from '../place-card/place-card.component';
import { CulturalPlaceType } from '../../models/cultural-place.model';
import { CultureMapStateService } from '../../services/culture-map-state.service';
import { PLACE_TYPE_MARKER_VISUALS } from '../../constants/place-type-marker-visuals.constant';

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

  protected readonly selectedTypesLabel = computed(() => {
    const selectedCount = this.cultureMapStateService.selectedTypes().size;

    if (selectedCount === 0) {
      return 'Tous les types';
    }

    return `${selectedCount} type${selectedCount > 1 ? 's' : ''} sélectionné${selectedCount > 1 ? 's' : ''}`;
  });

  protected readonly emptyStateLabel = computed(() =>
    this.cultureMapStateService.selectedTypes().size > 0
      ? 'Aucun lieu visible pour les types sélectionnés.'
      : 'Aucun lieu visible pour le moment.',
  );

  protected isTypeSelected(type: CulturalPlaceType): boolean {
    return this.cultureMapStateService.isTypeSelected(type);
  }

  protected onTypeToggle(type: CulturalPlaceType): void {
    this.cultureMapStateService.toggleType(type);
  }

  protected getTypeLabel(type: CulturalPlaceType): string {
    return PLACE_TYPE_MARKER_VISUALS[type].label;
  }
}
