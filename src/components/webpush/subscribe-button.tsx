"use client";

import { useState } from 'react';
import {
  isWebPushSupported,
  registerServiceWorker,
  subscribeForPush,
  unsubscribeFromPush,
} from '@/lib/webpush';

export default function WebPushSubscribeButton() {
  const [status, setStatus] = useState<string>('idle');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleRegister = async () => {
    setStatus('registering');
    const reg = await registerServiceWorker();
    setStatus(reg ? 'registered' : 'register-failed');
  };

  const handleSubscribe = async () => {
    setStatus('subscribing');
    const sub = await subscribeForPush();
    if (sub) {
      setSubscribed(true);
      setStatus('subscribed');
    } else {
      setStatus('subscribe-failed');
    }
  };

  const handleUnsubscribe = async () => {
    setStatus('unsubscribing');
    const ok = await unsubscribeFromPush();
    if (ok) {
      setSubscribed(false);
      setStatus('unsubscribed');
    } else {
      setStatus('unsubscribe-failed');
    }
  };

  const handleSendTest = async () => {
    const secret = prompt('Enter WEBPUSH_SEND_SECRET to send a test push (stored in server env):');
    if (!secret) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/webpush/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webpush-secret': secret,
        },
        body: JSON.stringify({ payload: { title: 'Test', body: 'Hello from web-push!' } }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus('sent');
        console.log('send result', json);
      } else {
        setStatus('send-failed');
        console.error('send failed', json);
      }
    } catch (err) {
      setStatus('send-failed');
      console.error(err);
    }
  };

  if (!isWebPushSupported()) {
    return <div className="p-4 text-sm text-yellow-300">Web Push not supported in this browser</div>;
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex gap-3">
        <button onClick={handleRegister} className="rounded bg-sky-600 px-4 py-2 text-white">Register SW</button>
        <button onClick={handleSubscribe} className="rounded bg-emerald-600 px-4 py-2 text-black">Subscribe</button>
        <button onClick={handleUnsubscribe} className="rounded bg-gray-700 px-4 py-2 text-white">Unsubscribe</button>
        <button onClick={handleSendTest} className="rounded bg-violet-600 px-4 py-2 text-white">Send Test</button>
      </div>
      <div className="text-sm text-white/80">Status: <span className="font-mono">{status}</span></div>
      <div className="text-sm text-white/80">Subscribed: <span className="font-mono">{subscribed ? 'yes' : 'no'}</span></div>
    </div>
  );
}
