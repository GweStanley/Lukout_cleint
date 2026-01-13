"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname(); // for active link highlight

  // Reactive login state
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setLoggedIn(!!token);
    };

    checkLogin();

    // Listen to storage changes in other tabs
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    window.location.href = "/auth";
  };

  const links = [
    { name: "Home", href: "/" },
    { name: " Alerts Feed", href: "/main/feed" },
    { name: "Send Alert", href: "/main/alerts" },
    { name: "Settings", href: "/main/settings" },
    { name: "Support", href: "/main/support" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#4a130dff",
        padding: "12px 20px",
        color: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        LukOut
      </div>

      {/* Logo + Links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* Logo */}
        <img
          src="/images/lookout.Logo.png"
          alt="LukOut Logo"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
          }}
        />

        {/* Nav Links */}
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: pathname === link.href ? "700" : "500",
              borderBottom:
                pathname === link.href ? "2px solid #fff" : "none",
              padding: "5px 0",
            }}
          >
            {link.name}
          </Link>
        ))}

        {/* Auth / Logout Button */}
        {loggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#fff",
              color: "#e74c3c",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            href="/auth"
            style={{
              backgroundColor: "#fff",
              color: "#e74c3c",
              padding: "6px 12px",
              borderRadius: "6px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
