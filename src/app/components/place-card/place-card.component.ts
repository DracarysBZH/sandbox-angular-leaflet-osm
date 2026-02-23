import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CulturalPlace } from '../../models/cultural-place.model';

@Component({
  selector: 'app-place-card',
  imports: [],
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class PlaceCardComponent {
  readonly place = input.required<CulturalPlace>();
  readonly selected = input(false);
  readonly hovered = input(false);

  readonly cardHover = output<string | null>();
  readonly cardSelect = output<string>();

  protected readonly ariaPressed = computed(() => String(this.selected()));

  protected onMouseEnter(): void {
    this.cardHover.emit(this.place().id);
  }

  protected onMouseLeave(): void {
    this.cardHover.emit(null);
  }

  protected onSelect(): void {
    this.cardSelect.emit(this.place().id);
  }
}
