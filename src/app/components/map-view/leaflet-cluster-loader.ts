import { InjectionToken } from '@angular/core';
import * as L from 'leaflet';

export async function loadMarkerCluster(): Promise<void> {
  (window as Window & typeof globalThis & { L?: typeof L }).L = L;
  await import('leaflet.markercluster');
}

export const LEAFLET_CLUSTER_LOADER = new InjectionToken<() => Promise<void>>(
  'LEAFLET_CLUSTER_LOADER',
  {
    factory: () => loadMarkerCluster,
  },
);
