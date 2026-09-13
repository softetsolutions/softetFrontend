import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [22.5937, 78.9629];
const DEFAULT_ZOOM = 5;

const COLOR_MAP = {
  green: "#22c55e",
  blue: "#3b82f6",
  red: "#ef4444",
  darkred: "#b91c1c",
  orange: "#f97316",
  gray: "#9ca3af",
};

function markerColor(m) {
  if (m.color && COLOR_MAP[m.color]) return COLOR_MAP[m.color];
  if (m.isOnline === false) return COLOR_MAP.gray;
  return COLOR_MAP.green;
}

function createDivIcon(m) {
  const color = markerColor(m);
  const size = m.type === "ping" ? 8 : 16;
  const pulse = m.pulse
    ? `box-shadow:0 0 0 0 ${color};animation:tracking-pulse 1.6s infinite;`
    : `box-shadow:0 0 0 2px rgba(0,0,0,0.18);`;

  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};border:2px solid white;${pulse}
    "></div>`,
  });
}

/**
 * Leaflet map with free Carto tiles.
 * markers: [{ lat, lng, label?, color?, isOnline?, type?, pulse? }]
 * route:   [{ lat, lng }] polyline path
 */
export default function TrackingMap({
  markers = [],
  route = null,
  height = 360,
  className = "",
  emptyLabel = "No location data yet",
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    const style = document.createElement("style");
    style.setAttribute("data-tracking-map", "1");
    style.textContent = `
      @keyframes tracking-pulse {
        0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.55); }
        70% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
        100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
      }
    `;
    if (!document.head.querySelector("[data-tracking-map]")) {
      document.head.appendChild(style);
    }

    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const bounds = [];

    if (route?.length > 1) {
      const latlngs = route
        .filter((p) => p.lat != null && p.lng != null)
        .map((p) => [p.lat, p.lng]);
      if (latlngs.length > 1) {
        L.polyline(latlngs, {
          color: "#5b8cff",
          weight: 4,
          opacity: 0.9,
          lineJoin: "round",
          lineCap: "round",
        }).addTo(layer);
        latlngs.forEach((ll) => bounds.push(ll));
      }
    }

    markers.forEach((m) => {
      if (m.lat == null || m.lng == null) return;
      const marker = L.marker([m.lat, m.lng], { icon: createDivIcon(m) });
      if (m.label) marker.bindPopup(m.label);
      marker.addTo(layer);
      bounds.push([m.lat, m.lng]);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    }

    requestAnimationFrame(() => map.invalidateSize());
  }, [markers, route]);

  const isEmpty = markers.length === 0 && (!route || route.length === 0);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
      }}
      className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-gray-500 pointer-events-none z-[400]">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}
