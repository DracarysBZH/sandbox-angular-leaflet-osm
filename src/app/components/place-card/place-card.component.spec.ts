import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PlaceCardComponent } from './place-card.component';
import { CulturalPlaceType, type CulturalPlace } from '../../models/cultural-place.model';
import { CultureMapStateService } from '../../services/culture-map-state.service';

describe('PlaceCardComponent', () => {
  let fixture: ComponentFixture<PlaceCardComponent>;
  let component: PlaceCardComponent;

  const place: CulturalPlace = {
    id: 'test-place',
    name: 'Les Champs Libres',
    type: CulturalPlaceType.Library,
    lat: 48.1,
    lng: -1.67,
    address: '10 Cr des Alliés',
    city: 'Rennes',
    shortDescription: 'Un lieu culturel test.',
    tags: ['lecture', 'expo'],
  };

  const mockSelected = signal(false);
  const mockHovered = signal(false);
  const serviceMock: Partial<CultureMapStateService> = {
    isPlaceSelected: vi.fn(() => mockSelected()),
    isPlaceHovered: vi.fn(() => mockHovered()),
    setHoveredPlace: vi.fn(),
    toggleSelectedPlace: vi.fn(),
  };

  beforeEach(async () => {
    mockSelected.set(false);
    mockHovered.set(false);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [PlaceCardComponent],
      providers: [{ provide: CultureMapStateService, useValue: serviceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('place', place);
    fixture.detectChanges();
  });

  it('should render place information', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.textContent).toContain(place.name);
    expect(button.textContent).toContain(place.address);
    expect(button.textContent).toContain(place.shortDescription);
    expect(button.textContent).toContain(place.type);
  });

  it('should reflect mockSelected state in aria and data attributes', () => {
    mockSelected.set(true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('data-state')).toBe('selected');
  });

  it('should reflect mockHovered state when not mockSelected', () => {
    mockHovered.set(true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('data-state')).toBe('hovered');
  });

  it('should notify service on pointer/focus interactions and click', () => {
    const buttonDe = fixture.debugElement.query(By.css('button'));

    buttonDe.triggerEventHandler('mouseenter', {});
    buttonDe.triggerEventHandler('mouseleave', {});
    buttonDe.triggerEventHandler('focus', {});
    buttonDe.triggerEventHandler('blur', {});
    buttonDe.triggerEventHandler('click', {});

    expect(serviceMock.setHoveredPlace).toHaveBeenCalledWith(place);
    expect(serviceMock.setHoveredPlace).toHaveBeenCalledWith(null);
    expect(serviceMock.toggleSelectedPlace).toHaveBeenCalledWith(place);
  });
});
