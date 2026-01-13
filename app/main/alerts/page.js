"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AlertsPage() {
  const router = useRouter();

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPrivacyRules, setShowPrivacyRules] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  /* ================= ALERT TYPES ================= */
  const alertTypes = [
    { label: "Fire", icon: "🔥" },
    { label: "Crime", icon: "🚨" },
    { label: "Medical Emergency", icon: "🚑" },
    { label: "Flood", icon: "🌊" },
    { label: "Accident", icon: "🚗" },
    { label: "Kidnapping", icon: "🧍‍♂️➡️🚐" },
    { label: "Explosion", icon: "💥" },
    { label: "Building Collapse", icon: "🏚️" },
    { label: "Road Block", icon: "⛔" },
    { label: "Violence", icon: "⚔️" },
    { label: "Gas Leak", icon: "🟡" },
    { label: "Storm", icon: "🌩️" },
    { label: "Terror Attack", icon: "💣" },
    { label: "Armed Robbery", icon: "🔫" },
    { label: "Missing Person", icon: "🧒❓" },
    { label: "Animal Attack", icon: "🐍" },
    { label: "Earthquake", icon: "🌍" },
    { label: "Landslide", icon: "⛰️" },
    { label: "Civil Unrest", icon: "🪧" },
    { label: "Other", icon: "❓" },
  ];

  /* ================= HELPERS ================= */
  const capitalizeWords = (text) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  const convertImageToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

const getLocation = () => {
    setStatus("Detecting Pinpoint Location...");
    
    if (!navigator.geolocation) {
      setStatus("Geolocation Not Supported");
      alert("Your browser does not support location services.");
      return;
    }

    const options = {
      enableHighAccuracy: true, 
      timeout: 15000,           // Increased to 15s to give GPS time to warm up
      maximumAge: 0             
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        
        setLocation({
          lat: latitude,
          lng: longitude,
        });

        // accuracy is in meters; lower is better
        setStatus(`Captured (±${Math.round(accuracy)}m) ✓`);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("Permission Denied");
          alert("Please ENABLE location services in your browser/device settings to send an accurate alert.");
        } else if (err.code === err.TIMEOUT) {
          setStatus("Location Timeout");
          alert("GPS took too long. Please ensure you are not in a 'dead zone' and try again.");
        } else {
          setStatus("Signal Lost");
          alert("Unable to find your location. Please check if your GPS/Location is turned ON.");
        }
      },
      options
    );
  };
  /* ================= IMAGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setPrivacyAccepted(false); // reset confirmation
  };

  /* ================= SEND ALERT ================= */
  const sendAlert = async () => {
    if (!selectedAlert) return setStatus("Select An Alert Type");
    if (!location.lat || !location.lng)
      return setStatus("Get Your Location First");

    if (imageFile && !privacyAccepted) {
      return setStatus("Please confirm the privacy notice before sending");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    let imageUrl = "";
    if (imageFile) {
      imageUrl = await convertImageToBase64(imageFile);
    }

    const payload = {
      type: selectedAlert,
      additionalInfo: message,
      location,
      imageUrl,
    };

    try {
      const res = await fetch(`${API_BASE}/api/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        setStatus("Server error: invalid response");
        return;
      }

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        router.push("/auth");
        return;
      }

      if (!res.ok) {
        setStatus(data.message || "Failed To Create Alert");
        return;
      }

      setStatus("✅ Alert Sent Successfully");
      setMessage("");
      setLocation({ lat: "", lng: "" });
      setSelectedAlert(null);
      setImageFile(null);
      setImagePreview("");
      setPrivacyAccepted(false);
    } catch {
      setStatus("Network or server error");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: 20 }}>
<div style={{ textAlign: "center", marginBottom: 15 }}>
  <h2 style={{ marginBottom: 8 }}>Report An Emergency</h2>

  <p
    style={{
      fontSize: 14,
      color: "#555",
      lineHeight: 1.6,
      maxWidth: 520,
      margin: "0 auto",
    }}
  >
    ⚠️ Only report <strong>real emergencies</strong>.  
    When uploading images, avoid faces, private homes, license plates, or any
    identifiable personal information. Misuse may lead to account restriction.
  </p>

  <p style={{ marginTop: 6, fontSize: 13 }}>
    Need help or unsure what to report?{" "}
    <a
      href="/main/support"
      style={{
        color: "#e74c3c",
        textDecoration: "underline",
        fontWeight: 600,
      }}
    >
      View Safety & Support Guidelines
    </a>
  </p>
</div>

      {!selectedAlert && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 12,
            marginTop: 25,
          }}
        >
          {alertTypes.map((t) => (
            <button
              key={t.label}
              onClick={() => setSelectedAlert(t.label)}
              style={{
                padding: 18,
                background: "#111",
                color: "white",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              <span style={{ fontSize: 26 }}>{t.icon}</span>
              <br />
              {t.label}
            </button>
          ))}
        </div>
      )}

      {selectedAlert && (
        <div style={{ marginTop: 30 }}>
          <h3>
            Selected Emergency:{" "}
            <span style={{ color: "crimson" }}>{selectedAlert}</span>
          </h3>

          <textarea
            rows={4}
            placeholder="Optional Details…"
            value={message}
            onChange={(e) => setMessage(capitalizeWords(e.target.value))}
            style={{ width: "100%", marginTop: 15, padding: 12, borderRadius: 8 }}
          />

          {/* IMAGE UPLOAD */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: 15 }}
          />

          {/* PRIVACY NOTICE */}
          {imageFile && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: "#fff3cd",
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              ⚠️ <strong>Privacy Notice</strong><br />
              Upload images only if necessary for safety.
              Do <strong>not</strong> expose faces, children, ID cards,
              license plates, or private homes unless critical.
              <div
                style={{ marginTop: 6, color: "#007bff", cursor: "pointer" }}
                onClick={() => setShowPrivacyRules(!showPrivacyRules)}
              >
                {showPrivacyRules ? "Hide guidelines ▲" : "View image guidelines ▼"}
              </div>

              {showPrivacyRules && (
                <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                  <li>✅ Public places, hazards, wide scenes</li>
                  <li>❌ Clear faces, children, documents, private interiors</li>
                </ul>
              )}

              <label style={{ display: "block", marginTop: 10 }}>
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                />{" "}
                Violating another's privacy is a punishable offense.
                Do You confirm this image does not intentionally violate anyone’s privacy?
              </label>
            </div>
          )}

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                marginTop: 10,
                width: "100%",
                maxHeight: 220,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}

          <button
            onClick={getLocation}
            style={{ marginTop: 15, padding: 12, width: "100%" }}
          >
            Get My Location
          </button>

          <p>
            Lat: {location.lat} <br />
            Lng: {location.lng}
          </p>

          <button
            onClick={sendAlert}
            style={{
              background: "crimson",
              color: "white",
              padding: 14,
              width: "100%",
              fontSize: 18,
              border: "none",
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            SEND ALERT NOW
          </button>

          <p style={{ marginTop: 12, fontWeight: "bold" }}>{status}</p>

          <button
            onClick={() => setSelectedAlert(null)}
            style={{ marginTop: 10, width: "100%", padding: 10 }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
