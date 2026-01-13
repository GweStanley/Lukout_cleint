"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ================= LEAFLET FIX ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ================= GEO HELPERS ================= */
const deg2rad = (d) => d * (Math.PI / 180);
const rad2deg = (r) => (r * 180) / Math.PI;

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getBearing = (lat1, lon1, lat2, lon2) => {
  const y = Math.sin(deg2rad(lon2 - lon1)) * Math.cos(deg2rad(lat2));
  const x =
    Math.cos(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) -
    Math.sin(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(lon2 - lon1));
  return (rad2deg(Math.atan2(y, x)) + 360) % 360;
};

const compass = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
const toCompass = (deg) => compass[Math.floor(deg / 22.5 + 0.5) % 16];

/* ================= STAR RATING ================= */
const Stars = ({ value, onRate }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        onClick={(e) => { e.stopPropagation(); onRate(n); }}
        style={{ cursor: "pointer", fontSize: 18, color: n <= value ? "#f1c40f" : "#ccc" }}
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

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) router.replace("/auth");
  }, [token, router]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  const fetchAlerts = useCallback(async (isManual = false) => {
    try {
      const res = await fetch("http://localhost:5000/api/alerts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const mapped = data.map((a) => {
        if (!userLocation || !a.location?.lat) return a;
        const dist = getDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng);
        const bear = toCompass(getBearing(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng));
        return { ...a, _distance: dist, _bearing: bear };
      });

      mapped.sort((a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity));
      setAlerts(mapped);
      
      if (isManual) {
        alert("Proximity updated!");
        setIsRefreshing(false);
      }
    } catch {
      setAlerts([]);
      setIsRefreshing(false);
    } finally {
      setLoading(false);
    }
  }, [token, userLocation]);

  useEffect(() => {
    fetchAlerts();
    const i = setInterval(() => fetchAlerts(false), 8000);
    return () => clearInterval(i);
  }, [fetchAlerts]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchAlerts(true);
  };

  const centerOnAlert = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 16);
    }
  };

  const rateAlert = (id, rating) => {
    localStorage.setItem(`alert-rating-${id}`, rating);
    setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, _rating: rating } : a)));
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;

  return (
    <div style={{ display: "flex", height: "100vh", gap: 20, background: "#f4f4f4" }}>
      {/* FEED */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#fff" }}>
        <h2 style={{ textAlign: "center", color: "#e74c3c", marginBottom: 10 }}>Live Alerts Nearby</h2>
        
        {/* RECALCULATE BUTTON */}
        <button 
          onClick={handleManualRefresh}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <span style={{ 
            display: "inline-block", 
            animation: isRefreshing ? "spin 1s linear infinite" : "none" 
          }}>🔄</span>
          Recalculate Proximity
        </button>

        <style>{`
          @keyframes spin { 100% { transform: rotate(-360deg); } }
        `}</style>

        {alerts.map((a) => (
          <div
            key={a._id}
            onClick={() => a.location?.lat && centerOnAlert(a.location.lat, a.location.lng)}
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 14,
              marginBottom: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              cursor: "pointer",
              border: "1px solid #eee"
            }}
          >
            {a.imageUrl && (
              <img src={a.imageUrl} alt={a.type} style={{ width: "100%", borderRadius: 8, marginBottom: 10 }} />
            )}
            <h3>{a.type}</h3>
            <p>{a.additionalInfo}</p>
            {userLocation && a._distance != null && (
              <p style={{ fontSize: 14, color: "#555" }}>
                🧭 <strong>{a._distance.toFixed(2)} km</strong> {a._bearing}
              </p>
            )}
            <Stars
              value={a._rating || Number(localStorage.getItem(`alert-rating-${a._id}`)) || 0}
              onRate={(n) => rateAlert(a._id, n)}
            />
            <p style={{ fontSize: 12, marginTop: 6 }}>{new Date(a.createdAt).toLocaleString()}</p>
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
          {alerts.map((a) => a.location?.lat && (
            <Marker key={a._id} position={[a.location.lat, a.location.lng]}>
              <Popup>
                <strong>{a.type}</strong><br />{a.additionalInfo}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}