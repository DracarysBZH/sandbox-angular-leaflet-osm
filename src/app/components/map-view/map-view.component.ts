import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CultureMapStateService } from '../../services/culture-map-state.service';
@Component({
  selector: 'app-map-view',
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent {
  protected readonly cultureMapStateService = inject(CultureMapStateService);

  protected readonly selectedPlaceName = computed(
    () => this.cultureMapStateService.selectedPlace()?.name ?? null,
  );
  protected readonly hoveredPlaceName = computed(
    () => this.cultureMapStateService.hoveredPlace()?.name ?? null,
  );
}
