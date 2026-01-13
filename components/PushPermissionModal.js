"use client";

import { useEffect, useState } from "react";
import { initNotifications } from "../app/utils/pushClient";

export default function PushPermissionModal() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/push/status`,
          { credentials: "include" } // JWT via cookie
        );

        const data = await res.json();

        if (!data.subscribed && Notification.permission === "default") {
          setShow(true);
        }
      } catch (err) {
        console.error("Push status check failed", err);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, []);

  if (loading || !show) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>🔔 Stay Alert</h3>
        <p>
          Enable notifications to receive nearby emergency alerts instantly.
        </p>

        <button
          onClick={async () => {
            await initNotifications();
            setShow(false);
          }}
          style={allowBtn}
        >
          Enable Notifications
        </button>

        <button onClick={() => setShow(false)} style={denyBtn}>
          Not now
        </button>
      </div>
    </div>
  );
}

/* styles */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal = {
  background: "#fff",
  padding: 25,
  borderRadius: 10,
  width: 320,
  textAlign: "center",
};

const allowBtn = {
  width: "100%",
  padding: 10,
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  marginTop: 15,
  cursor: "pointer",
};

const denyBtn = {
  marginTop: 10,
  background: "transparent",
  border: "none",
  color: "#555",
  cursor: "pointer",
};
