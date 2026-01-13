"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initNotifications, disableNotifications } from "../../utils/pushClient";

export default function SettingsPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [activeTab, setActiveTab] = useState("account");

  const [user, setUser] = useState({
    name: "",
    phone: "",
    jurisdiction: "",
    password: "",
  });
  const [profileMsg, setProfileMsg] = useState("");

  const [alertPrefs, setAlertPrefs] = useState({
    defaultAlertType: "",
    notificationDistance: 10,
    enablePush: true,
    enableEmail: false,
    alertExpiration: 48,
  });

  const [privacyPrefs, setPrivacyPrefs] = useState({
    shareLocation: true,
    reportAnonymous: false,
  });

  const [feedbackPrefs, setFeedbackPrefs] = useState({
    enableReplies: true,
    notifyOnFeedback: true,
  });

  const [appPrefs, setAppPrefs] = useState({
    theme: "light",
    language: "en",
    refreshInterval: 10,
  });

  useEffect(() => {
    if (!token) return router.push("/auth");

    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();

        setUser({
          name: data.name || "",
          phone: data.phone || "",
          jurisdiction: data.jurisdiction || "",
          password: "",
        });

        if (data.alertPrefs) setAlertPrefs(data.alertPrefs);
        if (data.privacyPrefs) setPrivacyPrefs(data.privacyPrefs);
        if (data.feedbackPrefs) setFeedbackPrefs(data.feedbackPrefs);
        if (data.appPrefs) setAppPrefs(data.appPrefs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();

    // Initialize notifications
    if (appPrefs.enablePush) initNotifications();
  }, [token]);

  // ------------------ Handlers ------------------
  const handleUserChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleAlertPrefChange = (e) =>
    setAlertPrefs({
      ...alertPrefs,
      [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const handlePrivacyPrefChange = (e) =>
    setPrivacyPrefs({ ...privacyPrefs, [e.target.name]: e.target.checked });

  const handleFeedbackPrefChange = (e) =>
    setFeedbackPrefs({ ...feedbackPrefs, [e.target.name]: e.target.checked });

  const handleAppPrefChange = (e) => {
    setAppPrefs({ ...appPrefs, [e.target.name]: e.target.value });
    if (e.target.name === "theme") document.documentElement.setAttribute("data-theme", e.target.value);
  };

  const saveProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      setProfileMsg(res.ok ? "Profile updated successfully ✅" : data.message || "Failed to update profile");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setProfileMsg("Server error");
    }
  };

  const savePreferences = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          alertPrefs,
          privacyPrefs,
          feedbackPrefs,
          appPrefs,
        }),
      });
      const data = await res.json();
      if (!res.ok) alert(data.message || "Failed to save preferences");
      else alert("Preferences updated ✅");

      // Re-initialize notifications if changed
      if (!alertPrefs.enablePush) disableNotifications();
      else initNotifications();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action is irreversible!")) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete account");
      localStorage.removeItem("token");
      router.push("/auth");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ------------------ UI ------------------
  const tabs = ["account", "alerts", "privacy", "feedback", "app", "security"];
  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  };
  const labelStyle = { fontWeight: "bold", marginBottom: 6, display: "block" };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#e74c3c", marginBottom: "25px" }}>Settings</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: activeTab === t ? "2px solid #e74c3c" : "1px solid #ccc",
              background: activeTab === t ? "#fdecea" : "#fff",
              cursor: "pointer",
              fontWeight: activeTab === t ? "bold" : "normal",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ---------------- TABS CONTENT ---------------- */}
      {activeTab === "account" && (
        <div style={cardStyle}>
          <h3>Account & Profile</h3>
          <label style={labelStyle}>Name:</label>
          <input name="name" value={user.name} onChange={handleUserChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
          <label style={labelStyle}>Phone:</label>
          <input name="phone" value={user.phone} onChange={handleUserChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
          <label style={labelStyle}>Jurisdiction:</label>
          <input name="jurisdiction" value={user.jurisdiction} onChange={handleUserChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
          <label style={labelStyle}>Password:</label>
          <input type="password" name="password" value={user.password} onChange={handleUserChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />
          <button onClick={saveProfile} style={{ background: "#e74c3c", color: "#fff", padding: 12, border: "none", borderRadius: 8 }}>Save Profile</button>
          {profileMsg && <p style={{ color: "green", marginTop: 10 }}>{profileMsg}</p>}
        </div>
      )}

      {activeTab === "alerts" && (
        <div style={cardStyle}>
          <h3>Alert Preferences</h3>
          <label style={labelStyle}>Default Alert Type:</label>
          <input name="defaultAlertType" value={alertPrefs.defaultAlertType} onChange={handleAlertPrefChange} style={{ width: "100%", padding: 10, marginBottom: 10 }} />

          <label style={{ labelStyle }}>Notification Distance (km): {alertPrefs.notificationDistance}</label>
          <input type="range" min={1} max={50} name="notificationDistance" value={alertPrefs.notificationDistance} onChange={handleAlertPrefChange} style={{ width: "100%", marginBottom: 15 }} />

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="enablePush" checked={alertPrefs.enablePush} onChange={handleAlertPrefChange} /> Enable Push Notifications
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="enableEmail" checked={alertPrefs.enableEmail} onChange={handleAlertPrefChange} /> Enable Email Notifications
          </label>

          <label style={labelStyle}>Alert Expiration (hours): {alertPrefs.alertExpiration}</label>
          <input type="range" min={1} max={168} name="alertExpiration" value={alertPrefs.alertExpiration} onChange={handleAlertPrefChange} style={{ width: "100%", marginBottom: 15 }} />

          <button onClick={savePreferences} style={{ background: "#e74c3c", color: "#fff", padding: 12, border: "none", borderRadius: 8 }}>Save Preferences</button>
        </div>
      )}

      {activeTab === "privacy" && (
        <div style={cardStyle}>
          <h3>Privacy & Location</h3>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="shareLocation" checked={privacyPrefs.shareLocation} onChange={handlePrivacyPrefChange} /> Share My Location
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="reportAnonymous" checked={privacyPrefs.reportAnonymous} onChange={handlePrivacyPrefChange} /> Report Anonymously
          </label>
          <button onClick={savePreferences} style={{ background: "#e74c3c", color: "#fff", padding: 12, border: "none", borderRadius: 8, marginTop: 10 }}>Save Privacy</button>
        </div>
      )}

      {activeTab === "feedback" && (
        <div style={cardStyle}>
          <h3>Feedback Settings</h3>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="enableReplies" checked={feedbackPrefs.enableReplies} onChange={handleFeedbackPrefChange} /> Allow Replies to My Alerts
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="notifyOnFeedback" checked={feedbackPrefs.notifyOnFeedback} onChange={handleFeedbackPrefChange} /> Notify Me on Feedback
          </label>
          <button onClick={savePreferences} style={{ background: "#e74c3c", color: "#fff", padding: 12, border: "none", borderRadius: 8, marginTop: 10 }}>Save Feedback Settings</button>
        </div>
      )}

      {activeTab === "app" && (
        <div style={cardStyle}>
          <h3>App Preferences</h3>
          <label style={labelStyle}>Theme:</label>
          <select name="theme" value={appPrefs.theme} onChange={handleAppPrefChange} style={{ width: "100%", padding: 10, marginBottom: 10 }}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>

          <label style={labelStyle}>Language:</label>
          <select name="language" value={appPrefs.language} onChange={handleAppPrefChange} style={{ width: "100%", padding: 10, marginBottom: 10 }}>
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>

          <label style={labelStyle}>Alerts Refresh Interval (seconds): {appPrefs.refreshInterval}</label>
          <input type="range" min={5} max={60} name="refreshInterval" value={appPrefs.refreshInterval} onChange={handleAppPrefChange} style={{ width: "100%", marginBottom: 15 }} />

          <button onClick={savePreferences} style={{ background: "#e74c3c", color: "#fff", padding: 12, border: "none", borderRadius: 8 }}>Save App Preferences</button>
        </div>
      )}

      {activeTab === "security" && (
        <div style={cardStyle}>
          <h3>Security</h3>
          <button onClick={logout} style={{ background: "#e74c3c", color: "#fff", padding: 12, border: "none", borderRadius: 8, marginBottom: 10, marginRight: 30 }}>Logout</button> 
                    <button onClick={deleteAccount} style={{ background: "red", color: "#fff", padding: 12, border: "none", borderRadius: 8, marginBottom: 10, marginRight: 30 }}>Delete Account</button>
          <button onClick={deleteAccount} style={{ background: "red", color: "#fff", padding: 12, border: "none", borderRadius: 8 }}>Kill Switch</button>

        </div>
      )}
    </div>
  );
}
