import { getDb } from "@/lib/firebase/admin";

/**
 * One-time script to set up credentials for approved members
 * Run this via: npm run setup-credentials
 */
async function setupMemberCredentials() {
  try {
    console.log("🔐 Setting up member credentials...");
    
    const db = getDb();
    
    // Get Sahitya's member document
    const sahityaId = "user-1762834506814-7ej1ufwp6";
    const memberRef = db.collection("members").doc(sahityaId);
    const memberDoc = await memberRef.get();
    
    if (!memberDoc.exists) {
      console.error("❌ Member not found:", sahityaId);
      return;
    }
    
    const memberData = memberDoc.data();
    console.log("📋 Found member:", memberData?.name);
    
    // Set username and password
    await memberRef.update({
      username: "sahitya",
      password: "sahitya123",
      credentialsSet: new Date().toISOString(),
    });
    
    console.log("✅ Credentials set successfully!");
    console.log("   Username: sahitya");
    console.log("   Password: sahitya123");
    
  } catch (error) {
    console.error("❌ Error setting up credentials:", error);
  }
}

// Run if called directly
if (require.main === module) {
  setupMemberCredentials()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default setupMemberCredentials;
