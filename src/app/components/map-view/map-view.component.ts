import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { PLACE_TYPE_MARKER_VISUALS } from '../../constants/place-type-marker-visuals.constant';
import { CulturalPlace } from '../../models/cultural-place.model';
import { CultureMapStateService } from '../../services/culture-map-state.service';
import { filterPlacesByTypes, ViewportBounds } from '../../utils/place-filters';

const RENNES_CENTER: L.LatLngExpression = [48.117266, -1.677793];
const RENNES_INITIAL_ZOOM = 12;
const SELECTION_FOCUS_ZOOM = 14;
const MARKER_SIZE = 30;

@Component({
  selector: 'app-map-view',
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  protected readonly cultureMapStateService = inject(CultureMapStateService);

  private readonly mapContainerRef = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  private map: L.Map | null = null;
  private markerClusterGroup: L.MarkerClusterGroup | null = null;
  private readonly markersById = new Map<string, L.Marker>();

  constructor() {
    effect(() => {
      const hoveredPlace = this.cultureMapStateService.hoveredPlace();
      const selectedPlace = this.cultureMapStateService.selectedPlace();
      void hoveredPlace;
      void selectedPlace;
      this.refreshMarkerStyles();
    });

    effect(() => {
      const selectedTypes = this.cultureMapStateService.selectedTypes();
      void selectedTypes;
      this.refreshVisibleMarkers();
    });

    effect(() => {
      const selectedPlace = this.cultureMapStateService.selectedPlace();

      if (!selectedPlace || !this.map) {
        return;
      }

      this.focusSelectedPlace(selectedPlace);
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.initializeMarkers();
    this.refreshVisibleMarkers();
  }

  ngOnDestroy(): void {
    this.markersById.clear();
    this.markerClusterGroup = null;
    this.map?.remove();
    this.map = null;
  }

  private initializeMap(): void {
    const mapElement = this.mapContainerRef().nativeElement;

    this.map = L.map(mapElement, {
      center: RENNES_CENTER,
      zoom: RENNES_INITIAL_ZOOM,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      minZoom: 10,
      subdomains: 'abcd',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors ' +
        '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    }).addTo(this.map);

    this.markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
    });

    this.map.addLayer(this.markerClusterGroup);
    this.syncViewportBounds();
    this.map.on('moveend', () => {
      this.syncViewportBounds();
    });
  }

  private initializeMarkers(): void {
    if (!this.markerClusterGroup) {
      return;
    }

    for (const place of this.cultureMapStateService.allPlaces) {
      const markerVisual = PLACE_TYPE_MARKER_VISUALS[place.type];
      const marker = L.marker([place.lat, place.lng], {
        alt: place.name,
        keyboard: true,
        icon: this.createPlaceMarkerIcon(place),
      });

      marker.bindTooltip(
        `
          <div class="culture-place-tooltip">
            <div class="culture-place-tooltip__name">${place.name}</div>
            <div class="culture-place-tooltip__meta">${markerVisual.label}</div>
          </div>
        `,
        {
          direction: 'top',
          offset: [0, -18],
          opacity: 1,
          className: 'culture-place-tooltip-shell',
        },
      );

      marker.on('click', () => {
        this.cultureMapStateService.toggleSelectedPlace(place);
      });
      marker.on('mouseover', () => {
        this.cultureMapStateService.setHoveredPlace(place);
      });
      marker.on('mouseout', () => {
        this.cultureMapStateService.setHoveredPlace(null);
      });

      this.markersById.set(place.id, marker);
      this.markerClusterGroup.addLayer(marker);
    }
  }

  private createPlaceMarkerIcon(place: CulturalPlace): L.DivIcon {
    const visual = PLACE_TYPE_MARKER_VISUALS[place.type];
    const iconMaskUrl = `url('${visual.iconPath}')`;
    const isSelected = this.cultureMapStateService.isPlaceSelected(place);
    const isHovered = this.cultureMapStateService.isPlaceHovered(place);
    const interactionClass = isSelected
      ? 'culture-place-marker--selected'
      : isHovered
        ? 'culture-place-marker--hovered'
        : 'culture-place-marker--idle';

    return L.divIcon({
      className: `culture-place-marker culture-place-marker--${place.type} ${interactionClass}`,
      html: `
        <span
          class="culture-place-marker__dot"
          aria-hidden="true"
        >
          <span
            class="culture-place-marker__icon"
            style="--marker-icon-mask: ${iconMaskUrl};"
          ></span>
        </span>
      `,
      iconSize: [MARKER_SIZE, MARKER_SIZE],
      iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE / 2],
    });
  }

  private refreshMarkerStyles(): void {
    if (this.markersById.size === 0) {
      return;
    }

    for (const place of this.cultureMapStateService.allPlaces) {
      const marker = this.markersById.get(place.id);
      if (!marker) {
        continue;
      }

      marker.setIcon(this.createPlaceMarkerIcon(place));
    }
  }

  private refreshVisibleMarkers(): void {
    if (!this.markerClusterGroup) {
      return;
    }

    this.markerClusterGroup.clearLayers();

    const visiblePlaces = filterPlacesByTypes(
      this.cultureMapStateService.allPlaces,
      this.cultureMapStateService.selectedTypes(),
    );

    for (const place of visiblePlaces) {
      const marker = this.markersById.get(place.id);
      if (!marker) {
        continue;
      }

      this.markerClusterGroup.addLayer(marker);
    }
  }

  private focusSelectedPlace(place: CulturalPlace): void {
    if (!this.map) {
      return;
    }

    const marker = this.markersById.get(place.id);
    const clusterGroup = this.markerClusterGroup;

    if (marker && clusterGroup) {
      clusterGroup.zoomToShowLayer(marker, () => {
        this.centerOnPlace(place);
      });
      return;
    }

    this.centerOnPlace(place);
  }

  private centerOnPlace(place: CulturalPlace): void {
    if (!this.map) {
      return;
    }

    const currentZoom = this.map.getZoom();
    const targetZoom = Math.max(currentZoom, SELECTION_FOCUS_ZOOM);

    if (targetZoom > currentZoom) {
      this.map.flyTo([place.lat, place.lng], targetZoom, {
        animate: true,
        duration: 0.45,
      });
      return;
    }

    this.map.panTo([place.lat, place.lng], {
      animate: true,
    });
  }

  private syncViewportBounds(): void {
    if (!this.map) {
      return;
    }

    const bounds = this.map.getBounds();
    const viewportBounds: ViewportBounds = {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    };

    this.cultureMapStateService.setViewportBounds(viewportBounds);
  }
}
