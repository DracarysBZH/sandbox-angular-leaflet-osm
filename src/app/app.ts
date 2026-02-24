import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MapViewComponent } from './components/map-view/map-view.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';

@Component({
  selector: 'app-root',
  imports: [MapViewComponent, RightPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
