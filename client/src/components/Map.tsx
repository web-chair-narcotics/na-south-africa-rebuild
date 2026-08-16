/// <reference types="@types/google.maps" />

import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useEffect, useRef, useState } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global { interface Window { google?: typeof google; } }

const MAPS_PROXY_CREDENTIAL = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;
let scriptPromise: Promise<void> | null = null;

function loadMapScript() {
  if (window.google?.maps) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.dataset.naMapsLoader = "true";
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${MAPS_PROXY_CREDENTIAL}&v=weekly&loading=async&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      const waitForMaps = (remainingAttempts: number) => {
        if (window.google?.maps?.Map) {
          resolve();
          return;
        }
        if (remainingAttempts <= 0) {
          scriptPromise = null;
          script.remove();
          reject(new Error("Google Maps did not initialize."));
          return;
        }
        window.setTimeout(() => waitForMaps(remainingAttempts - 1), 50);
      };
      waitForMaps(100);
    };
    script.onerror = () => {
      scriptPromise = null;
      script.remove();
      reject(new Error("Google Maps could not be loaded."));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export type MeetingMapPoint = {
  id: number;
  meetingName: string;
  latitude: string | number | null;
  longitude: string | number | null;
  areaName: string;
  venueName: string | null;
  streetAddress: string | null;
  suburb: string | null;
  city: string | null;
};

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
}

export function MapView({ className, initialCenter = { lat: -30.5595, lng: 22.9375 }, initialZoom = 5, onMapReady }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [error, setError] = useState(false);
  const init = usePersistFn(async () => {
    try {
      await loadMapScript();
      if (!mapContainer.current || !window.google?.maps) return;
      map.current = new window.google.maps.Map(mapContainer.current, { zoom: initialZoom, center: initialCenter, mapTypeControl: false, fullscreenControl: true, zoomControl: true, streetViewControl: false });
      onMapReady?.(map.current);
    } catch (error) { console.error(error); setError(true); }
  });
  useEffect(() => { void init(); }, [init]);
  if (error) return <div className={cn("flex h-[460px] items-center justify-center bg-[#edf0e8] p-8 text-center text-[#405057]", className)} role="alert"><div><p className="font-serif text-2xl text-[#142d2a]">The map is temporarily unavailable.</p><p className="mx-auto mt-3 max-w-sm text-sm leading-6">Meeting details and direct Google Maps directions remain available in the result list. You can retry the embedded map now.</p><button type="button" onClick={() => { setError(false); void init(); }} className="mt-5 min-h-11 rounded-full bg-[#0f584a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c463c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f584a]">Retry map</button></div></div>;
  return <div ref={mapContainer} className={cn("h-[460px] w-full", className)} aria-label="Meeting locations map" />;
}

export function MeetingMap({ points, selectedId, onSelect }: { points: MeetingMapPoint[]; selectedId?: number; onSelect: (id: number) => void }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clusterRef = useRef<MarkerClusterer | null>(null);

  const redraw = usePersistFn(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) return;
    clusterRef.current?.clearMarkers();
    markersRef.current.forEach(marker => marker.setMap(null));
    const bounds = new window.google.maps.LatLngBounds();
    const usable = points.flatMap(point => {
      const lat = Number(point.latitude); const lng = Number(point.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];
      const marker = new window.google.maps.Marker({ position: { lat, lng }, title: point.meetingName, animation: point.id === selectedId ? window.google.maps.Animation.DROP : undefined });
      marker.addListener("click", () => onSelect(point.id));
      bounds.extend({ lat, lng });
      return [marker];
    });
    markersRef.current = usable;
    clusterRef.current = new MarkerClusterer({ map, markers: usable });
    if (usable.length === 1) { map.setCenter(usable[0].getPosition()!); map.setZoom(14); }
    else if (usable.length > 1) map.fitBounds(bounds, 56);
  });

  useEffect(() => { redraw(); return () => { clusterRef.current?.clearMarkers(); }; }, [points, selectedId, redraw]);
  return <MapView className="h-[460px]" onMapReady={map => { mapRef.current = map; redraw(); }} />;
}
