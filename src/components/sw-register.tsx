"use client";

import { useEffect } from "react";

export default function SwRegister() {
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined") return;
      try {
        const webpush = await import("@/lib/webpush");
        // registerServiceWorker will handle waiting worker and controllerchange
        await webpush.registerServiceWorker();
      } catch (e) {
        // ignore; registration is best-effort
        // eslint-disable-next-line no-console
        console.warn('SW register failed (sw-register component)', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return null;
}
