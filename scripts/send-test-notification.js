#!/usr/bin/env node

/**
 * Send a test notification to a specific user
 * Usage: node send-test-notification.js <userId>
 */

const admin = require("firebase-admin");

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function sendTestNotification(userId) {
  try {
    console.log(`🔔 Sending test notification to user: ${userId}`);

    // Get user's FCM tokens
    const tokensSnapshot = await db
      .collection("fcmTokens")
      .where("userId", "==", userId)
      .get();

    if (tokensSnapshot.empty) {
      console.log("❌ No FCM tokens found for this user");
      console.log("💡 Make sure the user has enabled notifications in the app");
      return;
    }

    const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);
    console.log(`📱 Found ${tokens.length} device(s)`);

    // Send notification
    const message = {
      notification: {
        title: "🎉 Test Notification",
        body: "This is a test notification from CODE 404 Dev Club! Everything is working perfectly.",
      },
      data: {
        type: "test",
        url: "/dashboard",
        timestamp: new Date().toISOString(),
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendMulticast(message);

    console.log(`✅ Notification sent successfully!`);
    console.log(`   Success: ${response.successCount}`);
    console.log(`   Failure: ${response.failureCount}`);

    if (response.failureCount > 0) {
      console.log("\n⚠️  Some notifications failed:");
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.log(`   Device ${idx + 1}: ${resp.error?.message}`);
        }
      });
    }

    // Also store in Firestore
    await db.collection("notifications").add({
      userId,
      title: "🎉 Test Notification",
      body: "This is a test notification from CODE 404 Dev Club! Everything is working perfectly.",
      type: "test",
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("💾 Notification also saved to Firestore");
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    process.exit(1);
  }
}

// Get userId from command line argument
const userId = process.argv[2];

if (!userId) {
  console.log("Usage: node send-test-notification.js <userId>");
  console.log("Example: node send-test-notification.js geetansh-1");
  process.exit(1);
}

// Check environment variables
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT environment variable not set");
  console.log("💡 Make sure your .env.local file is properly configured");
  process.exit(1);
}

sendTestNotification(userId)
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
