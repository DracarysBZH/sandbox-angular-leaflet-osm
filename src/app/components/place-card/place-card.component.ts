import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CulturalPlace } from '../../models/cultural-place.model';
import { CultureMapStateService } from '../../services/culture-map-state.service';

@Component({
  selector: 'app-place-card',
  imports: [],
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceCardComponent {
  public readonly place = input.required<CulturalPlace>();

  protected readonly isSelected = computed(() => this.cultureMapStateService.isPlaceSelected(this.place()));
  protected readonly isHovered = computed(() => this.cultureMapStateService.isPlaceHovered(this.place()));

  private readonly cultureMapStateService = inject(CultureMapStateService);

  protected onMouseEnter(): void {
    this.cultureMapStateService.setHoveredPlace(this.place());
  }

  protected onMouseLeave(): void {
    this.cultureMapStateService.setHoveredPlace(null);
  }

  protected onSelect(): void {
    this.cultureMapStateService.toggleSelectedPlace(this.place());
  }
}
