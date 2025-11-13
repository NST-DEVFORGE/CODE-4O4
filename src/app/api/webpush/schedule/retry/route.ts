import { NextResponse } from 'next/server';
import { getDb } from '../../../../../lib/firebase/admin';

function isAdminOrSecret(req: Request) {
  const secret = req.headers.get('x-webpush-secret') || '';
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    try {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const userCookie = cookies.find(c => c.startsWith('code404-user='));
      if (userCookie) {
        const raw = userCookie.split('=')[1];
        if (raw) {
          const user = JSON.parse(decodeURIComponent(raw));
          if (user && (user.role === 'admin' || user.role === 'mentor')) return true;
        }
      }
    } catch (e) {
      // ignore
    }
  }
  if (process.env.WEBPUSH_SEND_SECRET && secret === process.env.WEBPUSH_SEND_SECRET) return true;
  return false;
}

export async function POST(req: Request) {
  if (!isAdminOrSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = body.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const db = getDb();
    const docRef = db.collection('webpush_schedules').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Reset status to pending and clear error fields so it can be reprocessed
    await docRef.update({ status: 'pending', error: null, triedAt: null, results: null });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('schedule retry error', err);
    return NextResponse.json({ error: 'Failed to retry schedule' }, { status: 500 });
  }
}
