#!/usr/bin/env node

/**
 * Script to resend confirmation emails to all hackathon participants
 * This sends updated emails clarifying that registration is not final
 * and selection will be done by MLH
 */

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

async function resendConfirmationEmails() {
    console.log('📧 Hackathon Registration Email Resend Script\n');

    if (isDryRun) {
        console.log('🔍 DRY RUN MODE - No emails will be sent\n');
    } else {
        console.log('⚠️  LIVE MODE - Emails will be sent to all participants\n');
    }

    // Check environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('❌ Error: SMTP credentials not configured');
        console.error('Please ensure .env.local has SMTP_HOST, SMTP_USER, and SMTP_PASS');
        process.exit(1);
    }

    // Initialize Firebase Admin
    try {
        if (!admin.apps.length) {
            if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
                console.error('❌ Error: FIREBASE_SERVICE_ACCOUNT not configured');
                process.exit(1);
            }

            const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
            const parsed = JSON.parse(serviceAccountJson);

            // CRITICAL: Handle newline encodings in private key
            let privateKey = parsed.private_key;
            if (typeof privateKey === 'string') {
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
            console.log('✅ Firebase Admin initialized\n');
        }
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error.message);
        process.exit(1);
    }

    const db = admin.firestore();

    // Import email function
    const { sendHackathonRegistrationEmail } = require('../src/lib/email.ts');

    try {
        // Fetch all hackathon registrations
        console.log('📥 Fetching all hackathon registrations...');
        const registrationsSnapshot = await db.collection('hackathon_registrations').get();

        if (registrationsSnapshot.empty) {
            console.log('⚠️  No registrations found in database');
            return;
        }

        const participants = [];
        registrationsSnapshot.forEach(doc => {
            const data = doc.data();
            // The lead member (first in members array) receives the email
            const leadMember = data.members?.[0] || {};
            participants.push({
                id: doc.id,
                email: leadMember.email,
                name: leadMember.name,
                type: data.type,
                teamName: data.teamName,
                memberCount: data.members?.length || 1,
            });
        });

        console.log(`✅ Found ${participants.length} participants\n`);

        if (isDryRun) {
            console.log('📋 Participants who would receive emails:');
            participants.forEach((p, index) => {
                console.log(`   ${index + 1}. ${p.name} (${p.email}) - ${p.type === 'team' ? `Team: ${p.teamName}` : 'Individual'}`);
            });
            console.log('\n✅ Dry run complete. Run without --dry-run to send emails.');
            return;
        }

        // Send emails
        console.log('📤 Sending confirmation emails...\n');
        const results = {
            success: 0,
            failed: 0,
            errors: [],
        };

        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i];
            const progress = `[${i + 1}/${participants.length}]`;

            console.log(`${progress} Sending to ${participant.name} (${participant.email})...`);

            try {
                const result = await sendHackathonRegistrationEmail({
                    to: participant.email,
                    name: participant.name,
                    type: participant.type,
                    teamName: participant.teamName,
                    memberCount: participant.memberCount,
                });

                if (result.success) {
                    console.log(`   ✅ Sent successfully (Message ID: ${result.messageId})`);
                    results.success++;
                } else {
                    console.log(`   ❌ Failed: ${result.error}`);
                    results.failed++;
                    results.errors.push({
                        participant: participant.email,
                        error: result.error,
                    });
                }
            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
                results.failed++;
                results.errors.push({
                    participant: participant.email,
                    error: error.message,
                });
            }

            // Rate limiting: wait 1 second between emails
            if (i < participants.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total participants: ${participants.length}`);
        console.log(`✅ Successfully sent: ${results.success}`);
        console.log(`❌ Failed: ${results.failed}`);

        if (results.errors.length > 0) {
            console.log('\n❌ Errors:');
            results.errors.forEach(err => {
                console.log(`   - ${err.participant}: ${err.error}`);
            });
        }

        console.log('\n✅ Email resend process complete!');

    } catch (error) {
        console.error('❌ Error fetching registrations:', error);
        process.exit(1);
    }
}

// Run the script
resendConfirmationEmails().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
