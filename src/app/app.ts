import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly phaseOneChecklist = [
    'npm run start affiche une page Angular sans erreur',
    'Tailwind applique des classes visibles',
    'Leaflet CSS / MarkerCluster CSS chargés correctement',
  ];
}
