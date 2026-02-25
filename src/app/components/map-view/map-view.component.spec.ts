import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MapViewComponent } from './map-view.component';
import { CultureMapStateService } from '../../services/culture-map-state.service';
import { CulturalPlaceType, type CulturalPlace } from '../../models/cultural-place.model';

const leafletMocks = vi.hoisted(() => {
  const mockBounds = {
    getNorth: vi.fn(() => 48.2),
    getSouth: vi.fn(() => 48.0),
    getEast: vi.fn(() => -1.5),
    getWest: vi.fn(() => -1.8),
  };

  const mockMap = {
    addLayer: vi.fn(),
    on: vi.fn(),
    getBounds: vi.fn(() => mockBounds),
    remove: vi.fn(),
  };

  const mockClusterGroup = {
    addLayer: vi.fn(),
  };

  const mockMarker = {
    bindTooltip: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
  };

  return {
    mockMap,
    mockClusterGroup,
    mockMarker,
    mockBounds,
    map: vi.fn(() => mockMap),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    markerClusterGroup: vi.fn(() => mockClusterGroup),
    marker: vi.fn(() => mockMarker),
    divIcon: vi.fn((config) => ({ ...config })),
  };
});

vi.mock('leaflet', () => leafletMocks);
vi.mock('leaflet.markercluster', () => ({}));

describe('MapViewComponent', () => {
  let fixture: ComponentFixture<MapViewComponent>;
  let component: MapViewComponent;

  const place: CulturalPlace = {
    id: 'p1',
    name: 'Musée test',
    type: CulturalPlaceType.Museum,
    lat: 48.11,
    lng: -1.68,
    address: '1 rue test',
    city: 'Rennes',
    shortDescription: 'desc',
    tags: ['tag'],
  };

  const selectedPlace = signal<CulturalPlace | null>(null);
  const hoveredPlace = signal<CulturalPlace | null>(null);
  const serviceMock: Partial<CultureMapStateService> = {
    allPlaces: [place] as readonly CulturalPlace[],
    selectedPlace,
    hoveredPlace,
    setViewportBounds: vi.fn(),
    toggleSelectedPlace: vi.fn(),
  };

  beforeEach(async () => {
    selectedPlace.set(null);
    hoveredPlace.set(null);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MapViewComponent],
      providers: [{ provide: CultureMapStateService, useValue: serviceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should expose selected and hovered place names', () => {
    expect((component as any).selectedPlaceName()).toBeNull();
    expect((component as any).hoveredPlaceName()).toBeNull();

    selectedPlace.set(place);
    hoveredPlace.set(place);

    expect((component as any).selectedPlaceName()).toBe(place.name);
    expect((component as any).hoveredPlaceName()).toBe(place.name);
  });

  it('should initialize map and markers after view init', () => {
    component.ngAfterViewInit();

    expect(leafletMocks.map).toHaveBeenCalled();
    expect(leafletMocks.tileLayer).toHaveBeenCalled();
    expect(leafletMocks.markerClusterGroup).toHaveBeenCalled();
    expect(leafletMocks.marker).toHaveBeenCalledWith([place.lat, place.lng], expect.any(Object));
    expect(leafletMocks.mockClusterGroup.addLayer).toHaveBeenCalledWith(leafletMocks.mockMarker);
    expect(serviceMock.setViewportBounds).toHaveBeenCalledWith({
      north: 48.2,
      south: 48.0,
      east: -1.5,
      west: -1.8,
    });
  });

  it('should sync viewport when the map move ends', () => {
    component.ngAfterViewInit();

    const moveEndHandler = leafletMocks.mockMap.on.mock.calls.find(
      ([eventName]) => eventName === 'moveend',
    )?.[1] as (() => void) | undefined;

    expect(moveEndHandler).toBeDefined();

    vi.mocked(serviceMock.setViewportBounds).mockClear();
    moveEndHandler?.();

    expect(serviceMock.setViewportBounds).toHaveBeenCalledWith({
      north: 48.2,
      south: 48.0,
      east: -1.5,
      west: -1.8,
    });
  });

  it('should toggle place selection when marker is clicked', () => {
    component.ngAfterViewInit();

    const clickHandler = leafletMocks.mockMarker.on.mock.calls.find(
      ([eventName]) => eventName === 'click',
    )?.[1] as (() => void) | undefined;

    expect(clickHandler).toBeDefined();

    clickHandler?.();

    expect(serviceMock.toggleSelectedPlace).toHaveBeenCalledWith(place);
  });

  it('should clean up map resources on destroy', () => {
    component.ngAfterViewInit();
    component.ngOnDestroy();

    expect(leafletMocks.mockMap.remove).toHaveBeenCalled();
    expect((component as any).map).toBeNull();
    expect((component as any).markerClusterGroup).toBeNull();
  });

  it('should create marker icon using type visual metadata', () => {
    const icon = (component as any).createPlaceMarkerIcon(place);

    expect(leafletMocks.divIcon).toHaveBeenCalled();
    expect(icon.className).toContain(`culture-place-marker--${place.type}`);
    expect(icon.html).toContain('/icons/map-markers/museum.svg');
  });
});
