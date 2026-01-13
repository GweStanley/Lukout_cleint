"use client";

import React, { useState } from "react";

/* -------------------- DATA -------------------- */

const emergencyNumbers = {
  Global: [
    {
      country: "Global (Standard Emergency)",
      police: "112",
      ambulance: "112",
      fire: "112",
      notes: "Works in most countries worldwide"
    },
    {
      country: "United States",
      police: "911",
      ambulance: "911",
      fire: "911",
      notes: "Nationwide emergency number"
    },
    {
      country: "United Kingdom",
      police: "999 / 112",
      ambulance: "999 / 112",
      fire: "999 / 112",
      notes: "112 works across Europe"
    },
    {
      country: "Canada",
      police: "911",
      ambulance: "911",
      fire: "911",
      notes: "Nationwide"
    },
    {
      country: "Australia",
      police: "000",
      ambulance: "000",
      fire: "000",
      notes: "Emergency Services Number"
    },
    {
      country: "Germany",
      police: "110",
      ambulance: "112",
      fire: "112",
      notes: "Police has a separate number"
    },
    {
      country: "France",
      police: "17",
      ambulance: "15",
      fire: "18",
      notes: "112 also works nationwide"
    },
    {
      country: "Italy",
      police: "113",
      ambulance: "118",
      fire: "115",
      notes: "112 available nationwide"
    },
    {
      country: "Spain",
      police: "112",
      ambulance: "112",
      fire: "112",
      notes: "Unified emergency number"
    },
    {
      country: "Netherlands",
      police: "112",
      ambulance: "112",
      fire: "112",
      notes: "Unified emergency number"
    },
    {
      country: "South Africa",
      police: "10111",
      ambulance: "10177",
      fire: "112",
      notes: "112 works from mobile phones"
    },
    {
      country: "Nigeria",
      police: "112",
      ambulance: "112",
      fire: "112",
      notes: "National Emergency Number"
    },
    {
      country: "Cameroon",
      police: "117",
      ambulance: "119",
      fire: "118",
      notes: "112 also available in some regions"
    },
    {
      country: "Ghana",
      police: "191",
      ambulance: "193",
      fire: "192",
      notes: "Toll-free nationwide"
    },
    {
      country: "Kenya",
      police: "999 / 112",
      ambulance: "999 / 112",
      fire: "999 / 112",
      notes: "Unified emergency services"
    },
    {
      country: "India",
      police: "100",
      ambulance: "108",
      fire: "101",
      notes: "112 works nationwide"
    },
    {
      country: "Pakistan",
      police: "15",
      ambulance: "115",
      fire: "16",
      notes: "Regional availability may vary"
    },
    {
      country: "Japan",
      police: "110",
      ambulance: "119",
      fire: "119",
      notes: "Separate police & medical lines"
    },
    {
      country: "China",
      police: "110",
      ambulance: "120",
      fire: "119",
      notes: "Major cities covered"
    },
    {
      country: "Brazil",
      police: "190",
      ambulance: "192",
      fire: "193",
      notes: "Nationwide toll-free"
    },
    {
      country: "Mexico",
      police: "911",
      ambulance: "911",
      fire: "911",
      notes: "Unified emergency number"
    },
    {
      country: "Egypt",
      police: "122",
      ambulance: "123",
      fire: "180",
      notes: "Separate emergency services"
    }
  ],
};

const firstAidTips = [
  {
    type: "Fire",
    tips: [
      "Move away from flames immediately",
      "Stop, drop, and roll if clothing catches fire",
      "Cover nose and mouth with cloth to avoid smoke",
    ],
  },
  {
    type: "Medical Emergency",
    tips: [
      "Call emergency services immediately",
      "Do not give food or drink",
      "Keep the person calm and still",
    ],
  },
  {
    type: "Accident",
    tips: [
      "Ensure the area is safe",
      "Do not move injured persons unless necessary",
      "Apply pressure to bleeding wounds",
    ],
  },
  {
    type: "Flood",
    tips: [
      "Move to higher ground immediately",
      "Avoid walking or driving through water",
      "Turn off electricity if safe to do so",
    ],
  },
  {
    type: "Violence",
    tips: [
      "Move to a safe location",
      "Avoid confrontation",
      "Call emergency services discreetly if possible",
    ],
  },
  {
    type: "Gas Leak",
    tips: [
      "Do not use electrical switches",
      "Open windows and doors",
      "Evacuate the area immediately",
    ],
  },
  {
    type: "Explosion",
    tips: [
      "Move away from debris",
      "Check for injuries",
      "Avoid damaged structures",
    ],
  },
  {
    type: "Animal Attack",
    tips: [
      "Move to safety",
      "Clean wounds immediately if possible",
      "Seek medical attention urgently",
    ],
  },
  {
    type: "Earthquake",
    tips: [
      "Drop, cover, and hold on",
      "Stay away from windows",
      "Move outside after shaking stops",
    ],
  },
];

/* -------------------- PAGE -------------------- */

export default function HelpPage() {
  const [openSection, setOpenSection] = useState(null);
  const [openAid, setOpenAid] = useState(null);

  const toggle = (key) =>
    setOpenSection(openSection === key ? null : key);

  const btn = {
    width: "100%",
    padding: 14,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
    marginBottom: 10,
    textAlign: "left",
  };

  const box = {
    padding: 16,
    background: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: 10,
    marginBottom: 25,
  };

  return (
    <div style={{ maxWidth: 820, margin: "2rem auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", color: "#e74c3c" }}>
        Help & Support
      </h1>

      {/* DISCLAIMER */}
      <div style={{
        background: "#fff3f3",
        border: "1px solid crimson",
        padding: 15,
        borderRadius: 8,
        marginBottom: 25,
      }}>
        <strong>⚠️ Important:</strong>
        <p>
          This platform does <strong>not replace emergency services</strong>.
          If you are in immediate danger, contact emergency authorities first.
        </p>
      </div>

      {/* EMERGENCY NUMBERS */}
      <button style={btn} onClick={() => toggle("numbers")}>
        📞 Emergency Toll-Free Numbers
      </button>
      {openSection === "numbers" && (
        <div style={box}>
          {emergencyNumbers.Global.map((item, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <h4>🌍 {item.country}</h4>
              <ul>
                <li>🚓 Police: {item.police}</li>
                <li>🚑 Ambulance: {item.ambulance}</li>
                <li>🚒 Fire: {item.fire}</li>
              </ul>
              <small style={{ color: "#666" }}>ℹ️ {item.notes}</small>
            </div>
          ))}
        </div>
      )}

      {/* FIRST AID */}
      <button style={btn} onClick={() => toggle("aid")}>
        🩺 Quick First Aid Tips
      </button>
      {openSection === "aid" && (
        <div style={box}>
          <p>Use these tips only if it is safe to do so.</p>
          {firstAidTips.map((aid) => (
            <div key={aid.type} style={{ marginBottom: 10 }}>
              <button
                onClick={() =>
                  setOpenAid(openAid === aid.type ? null : aid.type)
                }
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#eee",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                🚨 {aid.type}
              </button>

              {openAid === aid.type && (
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  {aid.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* HOW APP WORKS */}
      <button style={btn} onClick={() => toggle("how")}>
        ℹ️ How This App Works
      </button>
      {openSection === "how" && (
        <div style={box}>
          <ul style={{ lineHeight: 1.8 }}>
            <li>Alerts are sorted by distance from your location</li>
            <li>Distances use your device GPS</li>
            <li>Alerts expire automatically after 48 hours</li>
            <li>Images are optional but improve reliability</li>
            <li>No live tracking or background location storage</li>
            <li>Only authenticated users can post alerts</li>
            <li>Community reporting helps keep alerts accurate</li>
          </ul>
        </div>
      )}

      {/* PRIVACY POLICY */}
      <button style={btn} onClick={() => toggle("privacy")}>
        📜 Privacy Policy
      </button>
      {openSection === "privacy" && (
        <div style={box}>
          {<div style={{ marginTop: 40 }}> <h2>📜 Privacy Policy</h2> <p style={{ marginTop: 10, color: "#444", lineHeight: 1.7 }}> LukOut is designed to help communities stay informed and safe during emergencies. Your privacy and personal safety are taken seriously. This policy explains how data is handled when you use the platform. </p> 
          <h3 style={{ marginTop: 20 }}>📍 Location Data</h3> <p style={{ lineHeight: 1.7 }}> LukOut uses your device location <strong>only</strong> to calculate the distance between you and nearby alerts. Your location is processed temporarily and is <strong>not stored</strong>, tracked, or shared for advertising or profiling purposes. </p>
           <h3 style={{ marginTop: 20 }}>🖼️ Images & Media Uploads</h3> <p style={{ lineHeight: 1.7 }}> Images attached to alerts must respect the privacy of others. Users should avoid uploading: </p> <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}> <li>Faces of individuals without consent</li> <li>Private homes, license plates, or personal documents</li> <li>Content intended to shame, harass, or expose others</li> </ul> <p style={{ lineHeight: 1.7 }}> Uploaded images are visible only within the LukOut platform and are automatically removed when alerts expire. </p> 
           <h3 style={{ marginTop: 20 }}>🚨 Alerts & Community Safety</h3> <p style={{ lineHeight: 1.7 }}> Alerts are shared to improve public safety. Misuse of the platform — including false alerts, malicious reporting, or privacy violations — may result in account restriction or removal. </p> <h3 style={{ marginTop: 20 }}>🔐 Data Protection</h3> <p style={{ lineHeight: 1.7 }}> LukOut does not sell personal data. Access to alerts and media is restricted to authenticated users. Security measures are in place to prevent unauthorized access. </p> 
           <h3 style={{ marginTop: 20 }}>⚖️ Legal & Emergency Disclaimer</h3> <p style={{ lineHeight: 1.7 }}> LukOut is <strong>not a replacement</strong> for emergency services. Always contact official authorities first during critical situations. Data may be shared with law enforcement only when legally required. </p> <p style={{ marginTop: 15, fontSize: 13, color: "#666" }}> By using LukOut, you agree to act responsibly and respect the safety, dignity, and privacy of others. </p> </div>}
        </div>
      )}

      {/* SUPPORT */}
      <button style={btn} onClick={() => toggle("support")}>
        💬 Support
      </button>
      {openSection === "support" && (
        <div style={box}>
          <p>Email: <strong>pathfinderslabs1@gmail.com</strong></p>
        </div>
      )}
    </div>
  );
}
