# Web Push (VAPID) Setup

This project uses native Web Push via the `web-push` package and stores subscriptions in Firestore.

Quick steps to get started:

1. Generate VAPID keys locally (do NOT commit the private key):

```bash
npx web-push generate-vapid-keys --json
```

2. Add environment variables (example, in Vercel or your environment):

- WEBPUSH_PUBLIC_KEY (the publicKey from the generated keys)
- WEBPUSH_PRIVATE_KEY (the privateKey from the generated keys)
- WEBPUSH_SUBJECT (e.g., `mailto:you@example.com`)
- WEBPUSH_SEND_SECRET (a secret value used to protect the send endpoint for immediate sends)

3. Endpoints

- GET /api/webpush/vapid-public — returns { publicKey }
- POST /api/webpush/subscribe — body: { subscription } — saves the subscription in Firestore
- DELETE /api/webpush/subscribe — body: { subscription } — removes subscription by endpoint
- POST /api/webpush/send — protected by header `x-webpush-secret: <WEBPUSH_SEND_SECRET>` — body: { payload }

4. Client

Use the helper at `src/lib/webpush.ts` to register the service worker (`/sw.js`), obtain the public key, and subscribe.

5. Testing

Set `WEBPUSH_SEND_SECRET` locally then POST to `/api/webpush/send` with header `x-webpush-secret` and a payload to trigger immediate sends. Scheduling support has been removed from this repository.
