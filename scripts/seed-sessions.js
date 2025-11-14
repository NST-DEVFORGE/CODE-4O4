/**
 * Script to add sample sessions to Firebase for testing
 * Run with: node scripts/seed-sessions.js
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin using environment variables with proper private key handling
if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable not found');
    }
    
    const parsed = JSON.parse(serviceAccountJson);
    
    // CRITICAL: Properly handle private key newlines
    let privateKey = parsed.private_key;
    if (typeof privateKey === 'string') {
      // Replace literal \n strings with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    const serviceAccount = {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: privateKey,
    };
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();

// Sample sessions based on the calendar image
const sampleSessions = [
  {
    title: "HTML Foundations Live",
    date: "2025-11-12",
    time: "6:00 PM",
    type: "Workshop",
    description: "What is HTML, hyper text, inline vs block elements, semantic tags, fun projects overview, box model.",
    location: "NST Lab 101",
    instructor: "Club Lead",
    status: "upcoming",
    topics: ["HTML", "Web Fundamentals", "Semantic Tags"]
  },
  {
    title: "CSS Core Concepts I",
    date: "2025-11-14",
    time: "6:00 PM",
    type: "Workshop",
    description: "Inline vs internal vs external CSS, structuring styles for club projects.",
    location: "NST Lab 101",
    instructor: "Club Lead",
    status: "upcoming",
    topics: ["CSS", "Styling", "Web Development"]
  },
  {
    title: "CSS Core Concepts II",
    date: "2025-11-19",
    time: "6:00 PM",
    type: "Workshop",
    description: "Classes, IDs, specificity + preference, creating shapes (circle demo).",
    location: "NST Lab 101",
    instructor: "Club Lead",
    status: "upcoming",
    topics: ["CSS", "Selectors", "Advanced Styling"]
  },
  {
    title: "JavaScript Fundamentals",
    date: "2025-11-21",
    time: "6:00 PM",
    type: "Workshop",
    description: "Variables, functions, DOM manipulation, and event listeners.",
    location: "NST Lab 102",
    instructor: "Club Lead",
    status: "upcoming",
    topics: ["JavaScript", "Programming", "DOM"]
  },
  {
    title: "React Introduction",
    date: "2025-11-26",
    time: "6:00 PM",
    type: "Workshop",
    description: "Components, props, state, and building your first React app.",
    location: "NST Lab 201",
    instructor: "Senior Member",
    status: "upcoming",
    topics: ["React", "Components", "Frontend"]
  },
  {
    title: "Git & GitHub Workshop",
    date: "2025-11-28",
    time: "6:00 PM",
    type: "Workshop",
    description: "Version control basics, collaboration workflows, and best practices.",
    location: "NST Lab 101",
    instructor: "Club Lead",
    status: "upcoming",
    topics: ["Git", "Version Control", "Collaboration"]
  }
];

async function seedSessions() {
  try {
    console.log('🔄 Starting to seed sessions...');
    
    for (const session of sampleSessions) {
      const docRef = await db.collection('sessions').add({
        ...session,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Added session: ${session.title} (ID: ${docRef.id})`);
    }
    
    console.log('✅ All sessions seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding sessions:', error);
    process.exit(1);
  }
}

seedSessions();
