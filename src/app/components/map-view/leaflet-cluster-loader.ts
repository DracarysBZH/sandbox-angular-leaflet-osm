import { InjectionToken } from '@angular/core';
import * as L from 'leaflet';

export async function loadMarkerCluster(): Promise<typeof L> {
  (window as Window & typeof globalThis & { L?: typeof L }).L = L;
  await import('leaflet.markercluster');
  return L;
}

export const LEAFLET_CLUSTER_LOADER = new InjectionToken<() => Promise<typeof L>>(
  'LEAFLET_CLUSTER_LOADER',
  {
    factory: () => loadMarkerCluster,
  },
);
