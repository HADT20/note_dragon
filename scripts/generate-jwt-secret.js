const crypto = require('crypto');

// Generate a secure random JWT secret
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 JWT Secret Generated!\n');
console.log('Copy this secret and add to Vercel Environment Variables:\n');
console.log('━'.repeat(80));
console.log(`JWT_SECRET=${secret}`);
console.log('━'.repeat(80));
console.log('\n📝 Steps to add to Vercel:\n');
console.log('1. Go to your Vercel project dashboard');
console.log('2. Click "Settings" → "Environment Variables"');
console.log('3. Add new variable:');
console.log('   - Name: JWT_SECRET');
console.log('   - Value: (paste the secret above)');
console.log('   - Environment: Production, Preview, Development');
console.log('4. Click "Save"');
console.log('5. Redeploy your application\n');
console.log('⚠️  IMPORTANT: Keep this secret safe and never commit to Git!\n');

