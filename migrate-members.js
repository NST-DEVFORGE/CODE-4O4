/**
 * Firebase Members Collection Migration Script
 * 
 * This script adds profile and leaderboard fields to existing members.
 * Run this once to ensure all members have the necessary fields.
 * 
 * New fields added:
 * - Profile: phone, github, portfolio, bio, skills, interests, experience, availability
 * - Leaderboard: points, badges, projectsCompleted
 * - Timestamps: createdAt, updatedAt
 * 
 * To run:
 * node migrate-members.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./nst-swc1-firebase-adminsdk-fbsvc-79850ecef3.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function migrateMembers() {
  console.log('🚀 Starting members migration...\n');

  try {
    const membersSnapshot = await db.collection('members').get();
    
    if (membersSnapshot.empty) {
      console.log('ℹ️  No members found to migrate.');
      return;
    }

    console.log(`📊 Found ${membersSnapshot.size} members to migrate.\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const doc of membersSnapshot.docs) {
      const memberId = doc.id;
      const memberData = doc.data();

      try {
        const updates = {};
        let hasUpdates = false;

        // Add profile fields if missing
        if (memberData.phone === undefined) {
          updates.phone = '';
          hasUpdates = true;
        }
        if (memberData.github === undefined) {
          updates.github = '';
          hasUpdates = true;
        }
        if (memberData.portfolio === undefined) {
          updates.portfolio = '';
          hasUpdates = true;
        }
        if (memberData.bio === undefined) {
          updates.bio = '';
          hasUpdates = true;
        }
        if (memberData.skills === undefined) {
          updates.skills = [];
          hasUpdates = true;
        }
        if (memberData.interests === undefined) {
          updates.interests = [];
          hasUpdates = true;
        }
        if (memberData.experience === undefined) {
          updates.experience = 'beginner';
          hasUpdates = true;
        }
        if (memberData.availability === undefined) {
          updates.availability = '';
          hasUpdates = true;
        }

        // Add leaderboard fields if missing
        if (memberData.points === undefined) {
          updates.points = 0;
          hasUpdates = true;
        }
        if (memberData.badges === undefined) {
          updates.badges = 0;
          hasUpdates = true;
        }
        if (memberData.projectsCompleted === undefined) {
          updates.projectsCompleted = 0;
          hasUpdates = true;
        }

        // Add timestamps if missing
        if (memberData.createdAt === undefined) {
          updates.createdAt = admin.firestore.FieldValue.serverTimestamp();
          hasUpdates = true;
        }
        if (memberData.updatedAt === undefined) {
          updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
          hasUpdates = true;
        }

        // Only update if there are changes
        if (hasUpdates) {
          await doc.ref.update(updates);
          console.log(`✅ Migrated: ${memberData.name || memberId}`);
          console.log(`   Added ${Object.keys(updates).length} field(s): ${Object.keys(updates).join(', ')}`);
          successCount++;
        } else {
          console.log(`ℹ️  Skipped: ${memberData.name || memberId} (already up to date)`);
        }
      } catch (error) {
        console.error(`❌ Error migrating ${memberId}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   ℹ️  Already up to date: ${membersSnapshot.size - successCount - errorCount}`);
    console.log(`   Total: ${membersSnapshot.size}`);
    console.log('\n✨ Migration complete!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Members can now access /dashboard/profile');
    console.log('   2. Points will be automatically awarded for project joins');
    console.log('   3. Leaderboard will show rankings based on points');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration
migrateMembers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
