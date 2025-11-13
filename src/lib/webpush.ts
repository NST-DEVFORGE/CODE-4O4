/* Client helper: src/lib/webpush.ts
   Utilities to register the service worker, get VAPID public key, subscribe/unsubscribe
*/
export const isWebPushSupported = () => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if (!isWebPushSupported()) return null;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');

    // If a waiting worker is already present (update available), request it to skipWaiting
    if (registration.waiting) {
      try {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } catch (err) {
        console.warn('Failed to postMessage SKIP_WAITING to waiting SW', err);
      }
    }

    // Listen for controller change to reload the page when the new SW takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Small guard to avoid infinite reload loop
      if ((window as any).__webpush_sw_reloaded) return;
      (window as any).__webpush_sw_reloaded = true;
      window.location.reload();
    });

    // Also handle updatefound: when a new SW is installing, forward SKIP_WAITING once installed
    if (registration.installing) {
      const sw = registration.installing;
      sw.addEventListener('statechange', () => {
        if (sw.state === 'installed' && registration.waiting) {
          try {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          } catch (err) {
            console.warn('Failed to postMessage SKIP_WAITING after installing', err);
          }
        }
      });
    }

    return registration;
  } catch (err) {
    console.error('Failed to register service worker:', err);
    return null;
  }
}

export async function getVapidPublicKey(): Promise<string | null> {
  try {
    const res = await fetch('/api/webpush/vapid-public');
    if (!res.ok) return null;
    const json = await res.json();
    return json.publicKey || null;
  } catch (err) {
    console.error('Failed to fetch VAPID public key:', err);
    return null;
  }
}

export async function subscribeForPush(userId?: string): Promise<PushSubscription | null> {
  if (!isWebPushSupported()) return null;
  try {
    const publicKey = await getVapidPublicKey();
    if (!publicKey) return null;
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // send to server
    await fetch('/api/webpush/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub, userId }),
    });

    return sub;
  } catch (err) {
    console.error('Failed to subscribe for push:', err);
    return null;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isWebPushSupported()) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    if (!sub) return true;
    // inform server
    await fetch('/api/webpush/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub }),
    });
    const ok = await sub.unsubscribe();
    return ok;
  } catch (err) {
    console.error('Failed to unsubscribe:', err);
    return false;
  }
}
