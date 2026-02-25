import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input, signal } from '@angular/core';
import { RightPanelComponent } from './right-panel.component';
import { CultureMapStateService } from '../../services/culture-map-state.service';
import { CulturalPlaceType, type CulturalPlace } from '../../models/cultural-place.model';
import { PlaceCardComponent } from '../place-card/place-card.component';

@Component({
  selector: 'app-place-card',
  template: '',
})
class PlaceCardStubComponent {
  public readonly place = input.required<CulturalPlace>();
}

describe('RightPanelComponent', () => {
  let fixture: ComponentFixture<RightPanelComponent>;

  const placeA: CulturalPlace = {
    id: 'a',
    name: 'A',
    type: CulturalPlaceType.Museum,
    lat: 0,
    lng: 0,
    address: 'addr',
    city: 'Rennes',
    shortDescription: 'desc',
    tags: ['x'],
  };

  const placeB: CulturalPlace = {
    ...placeA,
    id: 'b',
    name: 'B',
    type: CulturalPlaceType.Gallery,
  };

  const visiblePlaces = signal<CulturalPlace[]>([placeA, placeB]);

  const serviceMock: Partial<CultureMapStateService> = {
    availableTypes: [CulturalPlaceType.Museum, CulturalPlaceType.Gallery] as const,
    visibleFilteredPlaces: visiblePlaces,
    isTypeSelected: vi.fn(() => false),
    toggleType: vi.fn(),
  };

  beforeEach(async () => {
    visiblePlaces.set([placeA, placeB]);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [RightPanelComponent],
      providers: [{ provide: CultureMapStateService, useValue: serviceMock }],
    })
      .overrideComponent(RightPanelComponent, {
        remove: { imports: [PlaceCardComponent] },
        add: { imports: [PlaceCardStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RightPanelComponent);
    fixture.detectChanges();
  });

  it('should render plural visible count label', () => {
    expect(fixture.nativeElement.textContent).toContain('2 lieux');
  });

  it('should render singular visible count label', () => {
    visiblePlaces.set([placeA]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('1 lieu');
  });

  it('should render empty state when there is no visible place', () => {
    visiblePlaces.set([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aucun lieu visible pour le moment.');
  });

  it('should toggle a type when filter button is clicked', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();

    expect(serviceMock.toggleType).toHaveBeenCalledWith(CulturalPlaceType.Museum);
  });
});
