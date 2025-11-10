#!/usr/bin/env node

/**
 * Quick test script to verify API endpoints are working
 * Run: node test-api.js
 */

const BASE_URL = "http://localhost:3000";

async function testProjectInterest() {
  console.log("\n🧪 Testing Project Interest API...");
  try {
    const response = await fetch(`${BASE_URL}/api/project-interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: "test-project-" + Date.now(),
        userId: "test-user-" + Date.now(),
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ SUCCESS: Data should be saved to Firestore!");
    } else {
      console.log("❌ FAILED:", data.message);
      if (data.error) {
        console.log("Error details:", data.error);
      }
    }
  } catch (error) {
    console.error("❌ Network error:", error.message);
  }
}

// Check if server is running first
fetch(BASE_URL)
  .then(() => {
    console.log("✅ Server is running at", BASE_URL);
    testProjectInterest();
  })
  .catch(() => {
    console.error("❌ Server is not running at", BASE_URL);
    console.error("Please start: npm run dev");
    process.exit(1);
  });
