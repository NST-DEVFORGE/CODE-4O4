require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

function getServiceAccountFromEnv() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      let privateKey = parsed.private_key;
      if (typeof privateKey === 'string') privateKey = privateKey.replace(/\\n/g, '\n');
      return {
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey,
      };
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT', e);
    }
  }
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, '').trim(),
    };
  }
  return null;
}

async function main() {
  const sa = getServiceAccountFromEnv();
  if (!sa) {
    console.error('No Firebase service account found in environment');
    process.exit(1);
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: sa.projectId,
        clientEmail: sa.clientEmail,
        privateKey: sa.privateKey,
      }),
    });
  } catch (e) {
    // ignore if already initialized
  }

  const db = admin.firestore();

  const now = new Date();
  const sendAt = new Date(now);
  sendAt.setHours(16,0,0,0);
  if (sendAt.getTime() <= now.getTime()) sendAt.setDate(sendAt.getDate()+1);

  const payload = {
    title: 'Starting with Javascript Variables',
    body: 'Join the live session starting at 4:00 PM. Click to view details.',
    data: { url: '/sessions' },
    icon: '/app-icon-192.png'
  };

  try {
    const docRef = await db.collection('webpush_schedules').add({
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
    console.error('Failed to write schedule:', err);
    process.exit(1);
  }
}

main();
