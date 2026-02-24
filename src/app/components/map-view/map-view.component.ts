import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { PLACE_TYPE_MARKER_VISUALS } from '../../constants/place-type-marker-visuals.constant';
import { CulturalPlace } from '../../models/cultural-place.model';
import { CultureMapStateService } from '../../services/culture-map-state.service';

const RENNES_CENTER: L.LatLngExpression = [48.117266, -1.677793];
const RENNES_INITIAL_ZOOM = 13;
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

  protected readonly selectedPlaceName = computed(
    () => this.cultureMapStateService.selectedPlace()?.name ?? null,
  );
  protected readonly hoveredPlaceName = computed(
    () => this.cultureMapStateService.hoveredPlace()?.name ?? null,
  );

  ngAfterViewInit(): void {
    this.initializeMap();
    this.initializeMarkers();
  }

  ngOnDestroy(): void {
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

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    }).addTo(this.map);

    this.markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
    });

    this.map.addLayer(this.markerClusterGroup);
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

      this.markerClusterGroup.addLayer(marker);
    }
  }

  private createPlaceMarkerIcon(place: CulturalPlace): L.DivIcon {
    const visual = PLACE_TYPE_MARKER_VISUALS[place.type];

    return L.divIcon({
      className: `culture-place-marker culture-place-marker--${place.type}`,
      html: `
        <span
          class="culture-place-marker__dot"
          aria-hidden="true"
        >
          <span class="culture-place-marker__icon">${visual.iconSvg}</span>
        </span>
      `,
      iconSize: [MARKER_SIZE, MARKER_SIZE],
      iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE / 2],
    });
  }
}
