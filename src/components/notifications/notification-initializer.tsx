"use client";

// Notification system is disabled. Export a no-op initializer to avoid
// breaking imports while we remove the implementation.
export function NotificationInitializer() {
  return null;
}
