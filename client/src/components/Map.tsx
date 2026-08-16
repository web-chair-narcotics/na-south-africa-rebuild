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
  if (window.google?.maps?.Map) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    document.querySelectorAll('script[data-na-maps-loader="true"]').forEach(existing => existing.remove());
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
  const retryCount = useRef(0);
  const [error, setError] = useState(false);
  const init = usePersistFn(async () => {
    try {
      await loadMapScript();
      if (!mapContainer.current || !window.google?.maps) return;
      map.current = new window.google.maps.Map(mapContainer.current, { zoom: initialZoom, center: initialCenter, mapTypeControl: false, fullscreenControl: true, zoomControl: true, streetViewControl: false });
      retryCount.current = 0;
      onMapReady?.(map.current);
    } catch (error) {
      console.error(error);
      scriptPromise = null;
      if (retryCount.current < 2) {
        retryCount.current += 1;
        window.setTimeout(() => { void init(); }, retryCount.current * 900);
        return;
      }
      setError(true);
    }
  });
  useEffect(() => { void init(); }, [init]);
  if (error) {
    const lat = initialCenter.lat;
    const lng = initialCenter.lng;
    const query = `${lat},${lng}`;
    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${initialZoom}&output=embed`;
    const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    return <div className={cn("relative h-[460px] overflow-hidden rounded-2xl border border-[#DDE6EB] bg-[#F8F8F8]", className)} role="region" aria-label="Meeting locations map">
      <iframe title="Meeting locations on Google Maps" src={googleMapUrl} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur"><p className="text-sm font-semibold text-[#54595F]">Google Maps fallback</p><div className="flex gap-2"><a href={googleMapLink} target="_blank" rel="noreferrer" className="rounded-lg bg-[#20752C] px-3 py-2 text-sm font-bold text-white hover:bg-[#185D22]">Open in Google Maps</a><button type="button" onClick={() => { retryCount.current = 0; scriptPromise = null; setError(false); void init(); }} className="rounded-lg border border-[#085C84]/25 px-3 py-2 text-sm font-bold text-[#085C84] hover:bg-[#EAF5EC]">Retry map</button></div></div>
    </div>;
  }
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
  const firstPoint = points.find(point => Number.isFinite(Number(point.latitude)) && Number.isFinite(Number(point.longitude)));
  const fallbackCenter = firstPoint ? { lat: Number(firstPoint.latitude), lng: Number(firstPoint.longitude) } : undefined;
  return <MapView className="h-[460px]" initialCenter={fallbackCenter} initialZoom={fallbackCenter ? 9 : 5} onMapReady={map => { mapRef.current = map; redraw(); }} />;
}
