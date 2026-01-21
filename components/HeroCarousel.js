"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/lookout.Logo.gif",
    title: "Stay Alert. Stay Alive.",
    text: "Real-time security and emergency alerts around you. LukOut helps communities respond faster and smarter.",
    primaryBtn: { label: "Get Started", href: "/auth" },
    secondaryBtn: { label: "Send Alert", href: "/main/alerts" },
  },
  {
    image: "/images/meerkat.jpg",
    title: "Real-Time Emergency Alerts",
    text: "Just like the Meerkat Sentry, Lets Lookout for each other, Send and Receive verified alerts based on your location and stay informed 24/7 wherever you are.",
    primaryBtn: { label: "View Alerts", href: "/main/feed" },
  },
  {
    image: "/images/crimeScene.jpg",
    title: "Community-Driven Safety",
    text: "See something? Say something. LukOut empowers citizens to protect each other.",
    primaryBtn: { label: "Join Community", href: "/auth" },
  },
  {
    image: "/images/emergency.jpg",
    title: "Have An Emergency?",
    text: "Get to a rescue team in one click. ",
    primaryBtn: { label: "Call Help", href: "/main/support" },
  },
    {
    image: "/images/firstAidkit.jpg",
    title: "Are Your a First Respondent? ",
    text: "Access Basic First Aid Tips Here. Your little actions can save lives ",
    primaryBtn: { label: "First Aid Tips", href: "/main/support" },
  },


];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
      }}
    >
      {/* Image */}
      <img
        src={slide.image}
        alt={slide.title}
        style={{
          width: "100%",
          height: "485px",
          objectFit: "cover",
          filter: "brightness(0.55)",
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "30px",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "2.2rem", marginBottom: 12 }}>
          {slide.title}
        </h1>

        <p style={{ fontSize: "1.1rem", maxWidth: 420, marginBottom: 20 }}>
          {slide.text}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {slide.primaryBtn && (
            <a
              href={slide.primaryBtn.href}
              style={{
                background: "#1cce9f",
                color: "#fff",
                padding: "12px 22px",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {slide.primaryBtn.label}
            </a>
          )}

          {slide.secondaryBtn && (
            <a
              href={slide.secondaryBtn.href}
              style={{
                background: "#e74c3c",
                color: "#fff",
                padding: "12px 22px",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {slide.secondaryBtn.label}
            </a>
          )}
        </div>
      </div>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: 15,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
        }}
      >
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: i === index ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
