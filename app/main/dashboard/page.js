"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

/* ================= LEAFLET (CLIENT ONLY) ================= */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

import "leaflet/dist/leaflet.css";

/* ================= GEO HELPERS ================= */
const deg2rad = (d) => d * (Math.PI / 180);
const rad2deg = (r) => (r * 180) / Math.PI;

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getBearing = (lat1, lon1, lat2, lon2) => {
  const y = Math.sin(deg2rad(lon2 - lon1)) * Math.cos(deg2rad(lat2));
  const x =
    Math.cos(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) -
    Math.sin(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.cos(deg2rad(lon2 - lon1));
  return (rad2deg(Math.atan2(y, x)) + 360) % 360;
};

const compass = [
  "N","NNE","NE","ENE","E","ESE","SE","SSE",
  "S","SSW","SW","WSW","W","WNW","NW","NNW"
];
const toCompass = (deg) => compass[Math.floor(deg / 22.5 + 0.5) % 16];

/* ================= STAR RATING ================= */
const Stars = ({ value, onRate }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        onClick={(e) => {
          e.stopPropagation();
          onRate(n);
        }}
        style={{
          cursor: "pointer",
          fontSize: 18,
          color: n <= value ? "#f1c40f" : "#ccc",
        }}
      >
        ★
      </span>
    ))}
  </div>
);

/* ================= COMPONENT ================= */
export default function Dashboard() {
  const router = useRouter();
  const mapRef = useRef(null);

  const [alerts, setAlerts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [token, setToken] = useState(null);

  /* 🔐 AUTH (CLIENT SAFE) */
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) router.replace("/auth");
    else setToken(t);
  }, [router]);

  /* 📍 GEOLOCATION */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watch = navigator.geolocation.watchPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  /* 🌍 FETCH ALERTS */
  const fetchAlerts = useCallback(
    async (isManual = false) => {
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/alerts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        const mapped = data.map((a) => {
          if (!userLocation || !a.location?.lat) return a;
          const dist = getDistance(
            userLocation.lat,
            userLocation.lng,
            a.location.lat,
            a.location.lng
          );
          const bear = toCompass(
            getBearing(
              userLocation.lat,
              userLocation.lng,
              a.location.lat,
              a.location.lng
            )
          );
          return { ...a, _distance: dist, _bearing: bear };
        });

        mapped.sort(
          (a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity)
        );

        setAlerts(mapped);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [token, userLocation]
  );

  useEffect(() => {
    fetchAlerts();
    const i = setInterval(fetchAlerts, 8000);
    return () => clearInterval(i);
  }, [fetchAlerts]);

  const rateAlert = (id, rating) => {
    localStorage.setItem(`alert-rating-${id}`, rating);
    setAlerts((prev) =>
      prev.map((a) => (a._id === id ? { ...a, _rating: rating } : a))
    );
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;

  return (
    <div style={{ display: "flex", height: "100vh", gap: 20 }}>
      {/* FEED */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <h2 style={{ textAlign: "center", color: "#e74c3c" }}>
          Live Alerts Nearby
        </h2>

        {alerts.map((a) => (
          <div key={a._id} style={{ marginBottom: 14 }}>
            <h3>{a.type}</h3>
            <p>{a.additionalInfo}</p>
            {a._distance && (
              <p>
                🧭 {a._distance.toFixed(2)} km {a._bearing}
              </p>
            )}
            <Stars
              value={
                a._rating ||
                Number(localStorage.getItem(`alert-rating-${a._id}`)) ||
                0
              }
              onRate={(n) => rateAlert(a._id, n)}
            />
          </div>
        ))}
      </div>

      {/* MAP */}
      <div style={{ flex: 2 }}>
        <MapContainer
          center={[7.3697, 12.3547]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {alerts.map(
            (a) =>
              a.location?.lat && (
                <Marker
                  key={a._id}
                  position={[a.location.lat, a.location.lng]}
                >
                  <Popup>
                    <strong>{a.type}</strong>
                    <br />
                    {a.additionalInfo}
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
}
