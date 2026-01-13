export async function registerPush(token) {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.register("/sw.js");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/push/subscribe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    }
  );
}
