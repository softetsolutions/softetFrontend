import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapboxMap({
  markers = [],
  route = null,
  height = 360,
  emptyLabel = "No location data yet",
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerObjsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!mapboxgl.accessToken) {
      console.error("VITE_MAPBOX_TOKEN is not set — the map will not render.");
      return;
    }

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.9629, 22.5937],
      zoom: 4,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyUpdates = () => {
      // clear previous markers
      markerObjsRef.current.forEach((m) => m.remove());
      markerObjsRef.current = [];

      const bounds = new mapboxgl.LngLatBounds();
      let hasBounds = false;

      markers.forEach((m) => {
        if (m.lat == null || m.lng == null) return;
        const el = document.createElement("div");
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.18)";
        el.style.background = m.isOnline === false ? "#9ca3af" : "#22c55e";
        el.style.cursor = "pointer";

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([m.lng, m.lat])
          .setPopup(new mapboxgl.Popup({ offset: 14 }).setText(m.label || ""))
          .addTo(map);

        markerObjsRef.current.push(marker);
        bounds.extend([m.lng, m.lat]);
        hasBounds = true;
      });

      if (map.getSource("trip-route")) {
        if (map.getLayer("trip-route-line")) map.removeLayer("trip-route-line");
        map.removeSource("trip-route");
      }
      if (route && route.length > 1) {
        const coords = route.map((p) => [p.lng, p.lat]);
        map.addSource("trip-route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: coords },
            properties: {},
          },
        });
        map.addLayer({
          id: "trip-route-line",
          type: "line",
          source: "trip-route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#5b8cff", "line-width": 4 },
        });
        coords.forEach((c) => bounds.extend(c));
        hasBounds = true;

        // start/end markers for the route, distinct from live-rep markers
        const start = coords[0];
        const end = coords[coords.length - 1];
        const startEl = document.createElement("div");
        startEl.style.cssText =
          "width:14px;height:14px;border-radius:50%;background:#22c55e;border:2px solid white;box-shadow:0 0 0 2px rgba(0,0,0,0.18);";
        const endEl = document.createElement("div");
        endEl.style.cssText =
          "width:14px;height:14px;border-radius:50%;background:#ef4444;border:2px solid white;box-shadow:0 0 0 2px rgba(0,0,0,0.18);";

        markerObjsRef.current.push(
          new mapboxgl.Marker({ element: startEl })
            .setLngLat(start)
            .setPopup(new mapboxgl.Popup({ offset: 14 }).setText("Start"))
            .addTo(map),
          new mapboxgl.Marker({ element: endEl })
            .setLngLat(end)
            .setPopup(new mapboxgl.Popup({ offset: 14 }).setText("End"))
            .addTo(map),
        );
      }

      if (hasBounds) {
        map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 500 });
      }
    };

    if (map.isStyleLoaded()) applyUpdates();
    else map.once("load", applyUpdates);
  }, [markers, route]);

  const isEmpty = markers.length === 0 && (!route || route.length === 0);

  return (
    <div
      style={{ position: "relative", width: "100%", height }}
      className="rounded-lg overflow-hidden border border-gray-200"
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-gray-500 pointer-events-none">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}
