"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* -------------------- GEO HELPERS -------------------- */
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
  "S","SSW","SW","WSW","W","WNW","NW","NNW",
];

const toCompass = (deg) =>
  compass[Math.floor(deg / 22.5 + 0.5) % 16];

/* -------------------- STAR RATING -------------------- */
const Stars = ({ value, onRate }) => (
  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        onClick={() => onRate(n)}
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

/* -------------------- PAGE -------------------- */
export default function FeedPage() {
  const router = useRouter();

  const [alerts, setAlerts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  /* -------------------- AUTH GUARD -------------------- */
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) router.replace("/auth");
  }, [token, router]);

  /* -------------------- LIVE LOCATION -------------------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  /* -------------------- FETCH ALERTS -------------------- */
  const fetchAlerts = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        router.replace("/auth");
        return;
      }

      const data = await res.json();

      const mapped = Array.isArray(data)
        ? data.map((a) => {
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
          })
        : [];

      mapped.sort(
        (a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity)
      );

      setAlerts(mapped);
    } catch (err) {
      console.error("Feed fetch failed:", err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [token, userLocation, router, API_BASE]);

  useEffect(() => {
    fetchAlerts();
    const i = setInterval(fetchAlerts, 10000);
    return () => clearInterval(i);
  }, [fetchAlerts]);

  const rateAlert = (id, rating) => {
    localStorage.setItem(`alert-rating-${id}`, rating);
    setAlerts((prev) =>
      prev.map((a) => (a._id === id ? { ...a, _rating: rating } : a))
    );
  };

  /* -------------------- UI -------------------- */
  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading alerts…
      </p>
    );

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 12px" }}>
      <h2 style={{ textAlign: "center", color: "#e74c3c" }}>
        Live Alert Feed
      </h2>

      {alerts.length === 0 && (
        <p style={{ textAlign: "center" }}>No alerts available.</p>
      )}

      {alerts.map((a) => (
        <div
          key={a._id}
          style={{
            background: "#fff",
            borderRadius: 10,
            padding: 14,
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,.06)",
          }}
        >
          {a.imageUrl && (
            <img
              src={a.imageUrl}
              alt={a.type}
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 10,
                objectFit: "cover",
              }}
            />
          )}

          <h3 style={{ color: "crimson" }}>{a.type}</h3>

          {a.additionalInfo && <p>{a.additionalInfo}</p>}

          {userLocation && a._distance != null && (
            <p style={{ color: "#555", fontSize: 14 }}>
              🧭 <strong>{a._distance.toFixed(1)} km</strong>{" "}
              {a._bearing}
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

          <p style={{ fontSize: 12, marginTop: 6 }}>
            {new Date(a.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
