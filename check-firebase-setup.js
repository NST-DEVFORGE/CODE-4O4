// Quick Firebase Storage check
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

console.log('Firebase Storage Bucket:', storageBucket || 'NOT SET');
console.log('Firebase API Key:', apiKey ? 'SET ✅' : 'NOT SET ❌');

if (storageBucket) {
  console.log('\n✅ Storage bucket is configured!');
  console.log('Make sure Firebase Storage is enabled in Firebase Console.');
} else {
  console.log('\n❌ Storage bucket is NOT configured in .env.local');
}
