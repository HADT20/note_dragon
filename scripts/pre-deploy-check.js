const fs = require('fs');
const path = require('path');

console.log('\n🔍 Pre-Deployment Check for Dragon Note\n');
console.log('━'.repeat(80));

let hasErrors = false;
let hasWarnings = false;

// Check 1: package.json
console.log('\n📦 Checking package.json...');
try {
  const packageJson = require('../package.json');
  
  if (!packageJson.scripts.build) {
    console.log('❌ Missing "build" script in package.json');
    hasErrors = true;
  } else {
    console.log('✅ Build script found');
  }
  
  if (!packageJson.scripts.start) {
    console.log('❌ Missing "start" script in package.json');
    hasErrors = true;
  } else {
    console.log('✅ Start script found');
  }
  
  // Check dependencies
  const requiredDeps = ['next', 'react', 'react-dom', 'mysql2', 'bcryptjs', 'jsonwebtoken'];
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep]) {
      console.log(`❌ Missing dependency: ${dep}`);
      hasErrors = true;
    }
  });
  console.log('✅ All required dependencies found');
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
  hasErrors = true;
}

// Check 2: .gitignore
console.log('\n📝 Checking .gitignore...');
try {
  const gitignorePath = path.join(__dirname, '..', '.gitignore');
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  
  const requiredEntries = ['.env*', 'node_modules', '.next', '.vercel'];
  let allFound = true;
  
  requiredEntries.forEach(entry => {
    if (!gitignore.includes(entry)) {
      console.log(`⚠️  Missing in .gitignore: ${entry}`);
      hasWarnings = true;
      allFound = false;
    }
  });
  
  if (allFound) {
    console.log('✅ .gitignore properly configured');
  }
} catch (error) {
  console.log('⚠️  .gitignore not found or error reading it');
  hasWarnings = true;
}

// Check 3: .env.local should NOT be committed
console.log('\n🔒 Checking environment files...');
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local exists (good for local dev)');
  console.log('⚠️  Make sure .env.local is in .gitignore!');
  hasWarnings = true;
} else {
  console.log('ℹ️  .env.local not found (will use Vercel env vars)');
}

// Check 4: Required directories
console.log('\n📁 Checking project structure...');
const requiredDirs = [
  'src/app',
  'src/components',
  'src/lib',
  'public'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir} exists`);
  } else {
    console.log(`❌ ${dir} not found`);
    hasErrors = true;
  }
});

// Check 5: API routes
console.log('\n🔌 Checking API routes...');
const apiRoutes = [
  'src/app/api/auth/login/route.ts',
  'src/app/api/auth/register/route.ts',
  'src/app/api/notes/route.ts',
  'src/app/api/admin/stats/route.ts'
];

apiRoutes.forEach(route => {
  const routePath = path.join(__dirname, '..', route);
  if (fs.existsSync(routePath)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ ${route} not found`);
    hasErrors = true;
  }
});

// Check 6: Database config
console.log('\n🗄️  Checking database configuration...');
const dbConfigPath = path.join(__dirname, '..', 'src/lib/db.ts');
if (fs.existsSync(dbConfigPath)) {
  console.log('✅ Database config found');
  const dbConfig = fs.readFileSync(dbConfigPath, 'utf8');
  
  if (dbConfig.includes('process.env.DB_HOST')) {
    console.log('✅ Using environment variables for DB config');
  } else {
    console.log('⚠️  Database config might have hardcoded values');
    hasWarnings = true;
  }
} else {
  console.log('❌ Database config not found');
  hasErrors = true;
}

// Check 7: vercel.json
console.log('\n🌐 Checking vercel.json...');
const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  console.log('✅ vercel.json found');
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    if (vercelConfig.framework === 'nextjs') {
      console.log('✅ Framework set to Next.js');
    }
  } catch (error) {
    console.log('⚠️  Error parsing vercel.json');
    hasWarnings = true;
  }
} else {
  console.log('ℹ️  vercel.json not found (optional, Vercel will auto-detect)');
}

// Check 8: TypeScript config
console.log('\n📘 Checking TypeScript configuration...');
const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  console.log('✅ tsconfig.json found');
} else {
  console.log('❌ tsconfig.json not found');
  hasErrors = true;
}

// Check 9: Next.js config
console.log('\n⚙️  Checking Next.js configuration...');
const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ next.config.ts found');
} else {
  console.log('⚠️  next.config.ts not found');
  hasWarnings = true;
}

// Summary
console.log('\n' + '━'.repeat(80));
console.log('\n📊 Summary:\n');

if (hasErrors) {
  console.log('❌ ERRORS FOUND - Please fix before deploying!');
} else if (hasWarnings) {
  console.log('⚠️  WARNINGS FOUND - Review before deploying');
} else {
  console.log('✅ ALL CHECKS PASSED - Ready to deploy!');
}

console.log('\n📋 Next Steps:\n');
console.log('1. Generate JWT Secret:');
console.log('   node scripts/generate-jwt-secret.js\n');
console.log('2. Test build locally:');
console.log('   npm run build\n');
console.log('3. Push to GitHub:');
console.log('   git add .');
console.log('   git commit -m "Ready for deployment"');
console.log('   git push\n');
console.log('4. Deploy to Vercel:');
console.log('   - Go to https://vercel.com');
console.log('   - Import your GitHub repository');
console.log('   - Add environment variables');
console.log('   - Deploy!\n');

console.log('━'.repeat(80) + '\n');

// Exit with error code if there are errors
if (hasErrors) {
  process.exit(1);
}

