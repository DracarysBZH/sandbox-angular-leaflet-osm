import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import type * as Leaflet from 'leaflet';
import { MapViewComponent } from './map-view.component';
import { LEAFLET_CLUSTER_LOADER } from './leaflet-cluster-loader';
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
    getZoom: vi.fn(() => 12),
    flyTo: vi.fn(),
    panTo: vi.fn(),
    remove: vi.fn(),
  };

  const mockClusterGroup = {
    addLayer: vi.fn(),
    clearLayers: vi.fn(),
    zoomToShowLayer: vi.fn((_layer, callback: () => void) => callback()),
  };

  const mockMarker = {
    bindTooltip: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    setIcon: vi.fn().mockReturnThis(),
    getLatLng: vi.fn(() => ({ lat: 48.11, lng: -1.68 })),
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

const loaderSpy = vi.fn(
  async () => leafletMocks as unknown as typeof Leaflet,
);

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
  const selectedTypes = signal<ReadonlySet<CulturalPlaceType>>(new Set());
  const serviceMock: Partial<CultureMapStateService> = {
    allPlaces: [place] as readonly CulturalPlace[],
    selectedPlace,
    hoveredPlace,
    selectedTypes,
    setViewportBounds: vi.fn(),
    setHoveredPlace: vi.fn(),
    toggleSelectedPlace: vi.fn(),
    isPlaceSelected: vi.fn((candidate: CulturalPlace) => selectedPlace()?.id === candidate.id),
    isPlaceHovered: vi.fn((candidate: CulturalPlace) => hoveredPlace()?.id === candidate.id),
  };

  beforeEach(async () => {
    selectedPlace.set(null);
    hoveredPlace.set(null);
    selectedTypes.set(new Set());
    vi.clearAllMocks();
    leafletMocks.mockMap.getZoom.mockReturnValue(12);

    await TestBed.configureTestingModule({
      imports: [MapViewComponent],
      providers: [
        { provide: CultureMapStateService, useValue: serviceMock },
        { provide: LEAFLET_CLUSTER_LOADER, useValue: loaderSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize map and markers after view init', async () => {
    await component.ngAfterViewInit();

    expect(leafletMocks.map).toHaveBeenCalled();
    expect(loaderSpy).toHaveBeenCalled();
    expect(leafletMocks.tileLayer).toHaveBeenCalled();
    expect(leafletMocks.markerClusterGroup).toHaveBeenCalled();
    expect(leafletMocks.marker).toHaveBeenCalledWith([place.lat, place.lng], expect.any(Object));
    expect(leafletMocks.mockClusterGroup.addLayer).toHaveBeenCalledWith(leafletMocks.mockMarker);
    expect(leafletMocks.mockClusterGroup.clearLayers).toHaveBeenCalled();
    expect(serviceMock.setViewportBounds).toHaveBeenCalledWith({
      north: 48.2,
      south: 48.0,
      east: -1.5,
      west: -1.8,
    });
  });

  it('should sync viewport when the map move ends', async () => {
    await component.ngAfterViewInit();

    const moveEndHandler = leafletMocks.mockMap.on.mock.calls.find(
      ([eventName]) => eventName === 'moveend',
    )?.[1] as (() => void) | undefined;

    expect(moveEndHandler).toBeDefined();

    const setViewportBoundsSpy = serviceMock.setViewportBounds as ReturnType<typeof vi.fn>;
    setViewportBoundsSpy.mockClear();
    moveEndHandler?.();

    expect(setViewportBoundsSpy).toHaveBeenCalledWith({
      north: 48.2,
      south: 48.0,
      east: -1.5,
      west: -1.8,
    });
  });

  it('should toggle place selection when marker is clicked', async () => {
    await component.ngAfterViewInit();

    const clickHandler = leafletMocks.mockMarker.on.mock.calls.find(
      ([eventName]) => eventName === 'click',
    )?.[1] as (() => void) | undefined;

    expect(clickHandler).toBeDefined();

    clickHandler?.();

    expect(serviceMock.toggleSelectedPlace).toHaveBeenCalledWith(place);
  });

  it('should set hovered place when marker hover events fire', async () => {
    await component.ngAfterViewInit();

    const mouseOverHandler = leafletMocks.mockMarker.on.mock.calls.find(
      ([eventName]) => eventName === 'mouseover',
    )?.[1] as (() => void) | undefined;
    const mouseOutHandler = leafletMocks.mockMarker.on.mock.calls.find(
      ([eventName]) => eventName === 'mouseout',
    )?.[1] as (() => void) | undefined;

    expect(mouseOverHandler).toBeDefined();
    expect(mouseOutHandler).toBeDefined();

    mouseOverHandler?.();
    mouseOutHandler?.();

    expect(serviceMock.setHoveredPlace).toHaveBeenNthCalledWith(1, place);
    expect(serviceMock.setHoveredPlace).toHaveBeenNthCalledWith(2, null);
  });

  it('should focus the map when a place becomes selected from the panel', async () => {
    await component.ngAfterViewInit();
    leafletMocks.mockClusterGroup.zoomToShowLayer.mockClear();
    leafletMocks.mockMap.flyTo.mockClear();

    selectedPlace.set(place);
    fixture.detectChanges();

    expect(leafletMocks.mockClusterGroup.zoomToShowLayer).toHaveBeenCalledWith(
      leafletMocks.mockMarker,
      expect.any(Function),
    );
    expect(leafletMocks.mockMap.flyTo).toHaveBeenCalledWith([place.lat, place.lng], 14, {
      animate: true,
      duration: 0.45,
    });
  });

  it('should not zoom out when the current zoom is already higher than focus zoom', async () => {
    await component.ngAfterViewInit();
    leafletMocks.mockMap.getZoom.mockReturnValue(16);
    leafletMocks.mockMap.flyTo.mockClear();
    leafletMocks.mockMap.panTo.mockClear();

    selectedPlace.set(place);
    fixture.detectChanges();

    expect(leafletMocks.mockMap.flyTo).not.toHaveBeenCalled();
    expect(leafletMocks.mockMap.panTo).toHaveBeenCalledWith([place.lat, place.lng], {
      animate: true,
    });
  });

  it('should refresh marker icon when hover or selection changes', async () => {
    await component.ngAfterViewInit();
    leafletMocks.mockMarker.setIcon.mockClear();

    hoveredPlace.set(place);
    fixture.detectChanges();

    expect(leafletMocks.mockMarker.setIcon).toHaveBeenCalled();

    leafletMocks.mockMarker.setIcon.mockClear();
    selectedPlace.set(place);
    fixture.detectChanges();

    expect(leafletMocks.mockMarker.setIcon).toHaveBeenCalled();
  });

  it('should refresh visible markers when type filters change', async () => {
    await component.ngAfterViewInit();
    leafletMocks.mockClusterGroup.clearLayers.mockClear();
    leafletMocks.mockClusterGroup.addLayer.mockClear();

    selectedTypes.set(new Set([CulturalPlaceType.Gallery]));
    fixture.detectChanges();

    expect(leafletMocks.mockClusterGroup.clearLayers).toHaveBeenCalled();
    expect(leafletMocks.mockClusterGroup.addLayer).not.toHaveBeenCalled();

    selectedTypes.set(new Set([CulturalPlaceType.Museum]));
    fixture.detectChanges();

    expect(leafletMocks.mockClusterGroup.clearLayers).toHaveBeenCalled();
    expect(leafletMocks.mockClusterGroup.addLayer).toHaveBeenCalledWith(leafletMocks.mockMarker);
  });

  it('should clean up map resources on destroy', async () => {
    await component.ngAfterViewInit();
    component.ngOnDestroy();

    expect(leafletMocks.mockMap.remove).toHaveBeenCalled();
    expect((component as any).map).toBeNull();
    expect((component as any).markerClusterGroup).toBeNull();
  });

  it('should create marker icon using type visual metadata', () => {
    const icon = (component as any).createPlaceMarkerIcon(place);

    expect(leafletMocks.divIcon).toHaveBeenCalled();
    expect(icon.className).toContain(`culture-place-marker--${place.type}`);
    expect(icon.html).toContain('icons/map-markers/museum.svg');
  });
});
