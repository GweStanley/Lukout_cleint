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
    title: "Are You a First Respondent?",
    text: "Access Basic First Aid Tips Here. Your little actions can save lives.",
    primaryBtn: { label: "First Aid Tips", href: "/main/support" },
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 15000);
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
      paddingLeft: "10px",   
      paddingRight: "10px",  
      boxSizing: "border-box", 
      }}
    >
      {/* Image */}
      <img
        src={slide.image}
        alt={slide.title}
        style={{
          width: "100%",
          height: "clamp(220px, 45vh, 485px)", // responsive height
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
          padding: "clamp(15px, 5vw, 30px)",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            marginBottom: "0.75rem",
          }}
        >
          {slide.title}
        </h1>

        <p
          style={{
            fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
            maxWidth: "100%",
            marginBottom: "1rem",
          }}
        >
          {slide.text}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "clamp(6px,2vw,12px)", flexWrap: "wrap" }}>
          {slide.primaryBtn && (
            <a
              href={slide.primaryBtn.href}
              style={{
                background: "#1cce9f",
                color: "#fff",
                padding: "clamp(8px,2vw,12px) clamp(16px,4vw,22px)",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "clamp(0.75rem,2vw,0.95rem)",
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
                padding: "clamp(8px,2vw,12px) clamp(16px,4vw,22px)",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "clamp(0.75rem,2vw,0.95rem)",
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
          bottom: "clamp(8px,2vh,15px)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
        }}
      >
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: i === index ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Mobile-specific adjustments */}
      <style jsx>{`
        @media screen and (max-width: 400px) {
          img {
            height: clamp(180px, 40vh, 320px);
          }
          h1 {
            font-size: 1.4rem !important;
          }
          p {
            font-size: 0.75rem !important;
          }
          a {
            padding: 6px 12px !important;
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </div>
  );
}
