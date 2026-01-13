"use client";

/**
 * Initialize push notifications (subscribe if not already subscribed)
 */
export async function initNotifications(token) {
  try {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return;
    }

    // Do NOT re-prompt if user already decided
    if (Notification.permission !== "default") {
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.register("/sw.js");

    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) return;

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    await fetch("/api/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(subscription),
    });
  } catch (err) {
    console.error("Push init failed:", err);
  }
}

/**
 * Disable push notifications (unsubscribe + backend cleanup)
 */
export async function disableNotifications() {
  try {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) return;

    await subscription.unsubscribe();

    await fetch("/api/push", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
  } catch (err) {
    console.error("Disable notifications failed:", err);
  }
}

/* ---------------- HELPERS ---------------- */

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
