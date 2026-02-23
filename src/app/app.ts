import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RENNES_CULTURAL_PLACES } from './data/rennes-cultural-places.mock';
import { CulturalPlaceType } from './models/cultural-place.model';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly progressChecklist = [
    'Phase 1 terminée: setup Angular/Tailwind/Leaflet CSS',
    'Phase 2 terminée: types métier + mock Rennes (48 lieux)',
    'Compilation Angular en mode strict OK',
  ];

  protected readonly totalPlaces = RENNES_CULTURAL_PLACES.length;
  protected readonly typeBreakdown = Object.values(CulturalPlaceType).map((type: CulturalPlaceType) => ({
    type,
    count: RENNES_CULTURAL_PLACES.filter((place) => place.type === type).length,
  }));
}
