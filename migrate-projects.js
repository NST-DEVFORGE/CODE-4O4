/**
 * Firebase Project Collection Migration Script
 * 
 * This script helps migrate existing projects to the new schema with proper fields.
 * Run this script once to update all existing projects in your Firebase collection.
 * 
 * New fields added:
 * - githubUrl (optional)
 * - demoUrl (optional)
 * - docsUrl (optional)
 * - createdAt (timestamp)
 * - updatedAt (timestamp)
 * - status includes "completed" option
 * 
 * To run:
 * node migrate-projects.js
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

async function migrateProjects() {
  console.log('🚀 Starting project migration...\n');

  try {
    const projectsSnapshot = await db.collection('projects').get();
    
    if (projectsSnapshot.empty) {
      console.log('ℹ️  No projects found to migrate.');
      return;
    }

    console.log(`📊 Found ${projectsSnapshot.size} projects to migrate.\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const doc of projectsSnapshot.docs) {
      const projectId = doc.id;
      const projectData = doc.data();

      try {
        const updates = {};

        // Add missing fields with default values
        if (!projectData.githubUrl) {
          updates.githubUrl = '';
        }
        if (!projectData.demoUrl) {
          updates.demoUrl = '';
        }
        if (!projectData.docsUrl) {
          updates.docsUrl = '';
        }
        if (!projectData.createdAt) {
          updates.createdAt = admin.firestore.FieldValue.serverTimestamp();
        }
        if (!projectData.updatedAt) {
          updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        }

        // Only update if there are changes
        if (Object.keys(updates).length > 0) {
          await doc.ref.update(updates);
          console.log(`✅ Migrated: ${projectData.title || projectId}`);
          console.log(`   Added fields: ${Object.keys(updates).join(', ')}`);
          successCount++;
        } else {
          console.log(`ℹ️  Skipped: ${projectData.title || projectId} (already up to date)`);
        }
      } catch (error) {
        console.error(`❌ Error migrating ${projectId}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   Total: ${projectsSnapshot.size}`);
    console.log('\n✨ Migration complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration
migrateProjects()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
