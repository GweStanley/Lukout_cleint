"use client";

import React from "react";
import Navbar from "../components/Navbar";
import PushPermissionModal from "../components/PushPermissionModal";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>LukOut</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          margin: 0,
          backgroundColor: "#f2f6fc",
        }}
      >
        {/* Push notification modal */}
        <PushPermissionModal />

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main style={{ padding: "2rem", minHeight: "calc(100vh - 120px)" }}>
          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            backgroundColor: "#111",
            color: "#fff",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          &copy; {new Date().getFullYear()} LukOut
        </footer>
      </body>
    </html>
  );
}
