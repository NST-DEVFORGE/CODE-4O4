import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getDb } from '../src/lib/firebase/admin';

async function main() {
  try {
    // Build sendAt for today at 16:00 local
    const now = new Date();
    const sendAt = new Date(now);
    sendAt.setHours(16, 0, 0, 0);
    // If it's already past 16:00 today, schedule for tomorrow 16:00
    if (sendAt.getTime() <= now.getTime()) {
      sendAt.setDate(sendAt.getDate() + 1);
    }

    const payload = {
      title: 'Starting with Javascript Variables',
      body: 'Join the live session starting at 4:00 PM. Click to view details.',
      data: { url: '/sessions' },
      icon: '/app-icon-192.png',
    };

    const db = getDb();
    const col = db.collection('webpush_schedules');
    const docRef = await col.add({
      sendAt,
      payload,
      audience: 'all',
      meta: { createdBy: 'script' },
      status: 'pending',
      createdAt: new Date(),
    });

    console.log('Scheduled webpush created with ID:', docRef.id);
    console.log('sendAt (ISO):', sendAt.toISOString());
    process.exit(0);
  } catch (err) {
    console.error('Failed to create schedule', err);
    process.exit(1);
  }
}

main();
