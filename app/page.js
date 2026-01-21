"use client";

import React, { useEffect, useRef } from "react";
import Dashboard from "./main/dashboard/page.js";
import ImageCarousel from "../components/HeroCarousel.js";

export default function HomePage() {
  const scrollRef = useRef(null);

  // Continuous scrolling effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;
    let req;

    const scroll = () => {
      scrollAmount += 1;
      if (scrollAmount >= scrollContainer.scrollWidth / 2) scrollAmount = 0;
      scrollContainer.scrollLeft = scrollAmount;
      req = requestAnimationFrame(scroll);
    };

    req = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(req);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "#f9fbff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      {/* Continuous text carousel */}
      <section
        ref={scrollRef}
        style={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#e74c3c",
          color: "#fff",
          padding: "10px 0",
          margin: "30px 0",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ display: "inline-block", paddingRight: "100%" }}>
          {Array(20)
            .fill(
              "🚨 Real-time alerts • Quick emergency response • Stay safe with LukOut • Secure your community •"
            )
            .join(" ")}
        </div>
      </section>

      {/* Hero Section */}
      <section
        className="hero"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "1000px",
          width: "100%",
          padding: "10px",
          gap: "40px",
        }}
      >
        <div className="hero-media" style={{ flex: 1, minWidth: "250px" }}>
          <ImageCarousel
            images={[
              "/images/lookout.Logo.gif",
              "/images/alert1.jpg",
              "/images/alert2.jpg",
            ]}
          />
        </div>

        <div
          className="hero-text"
          style={{
            flex: 1,
            minWidth: "250px",
            opacity: 0,
            animation: "fadeInRight 1s forwards",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", color: "#2c3e50", marginBottom: "20px" }}>
            Welcome to LukOut
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#555",
              lineHeight: "1.6",
              marginBottom: "25px",
            }}
          >
            LukOut is your global security & emergency alert platform. Track real-time alerts,
            respond quickly, and keep your community safe. Get instant notifications for
            emergencies around you and stay informed 24/7. Inspired by Meerkat, LukOut
            emphasizes vigilance, community awareness, and fast response to potential threats.
          </p>

          <div className="hero-actions" style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <a
              href="/main/alerts"
              style={{
                padding: "12px 25px",
                backgroundColor: "#1cce9fff",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Act Now
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <div
        className="dashboard-wrap"
        style={{
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          background: "#ffffff",
          padding: "25px",
          maxWidth: "1000px",
          width: "100%",
          marginBottom: "50px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#e74c3c",
            marginBottom: "25px",
            fontSize: "1.9rem",
            fontWeight: "600",
          }}
        >
          Real-Time Dashboard
        </h2>
        <Dashboard />
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#7f8c8d",
          fontSize: "0.9rem",
        }}
      >
        &copy; {new Date().getFullYear()} LukOut. All rights reserved.
      </footer>

      {/* Animations + MEDIA QUERIES */}
      <style>
        {`
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
          }

          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }

          /* ================= MOBILE FIXES ================= */
          @media (max-width: 768px) {
            .hero {
              flex-direction: column;
              text-align: center;
              gap: 25px;
            }

            .hero-text h1 {
              font-size: 2rem;
            }

            .hero-text p {
              font-size: 1rem;
            }

            .hero-actions {
              justify-content: center;
            }

            .dashboard-wrap {
              padding: 15px;
              border-radius: 0;
            }
          }

          @media (max-width: 480px) {
            .hero-text h1 {
              font-size: 1.7rem;
            }

            .hero-text p {
              font-size: 0.95rem;
            }

            section {
              margin: 20px 0;
            }
          }
        `}
      </style>
    </div>
  );
}
