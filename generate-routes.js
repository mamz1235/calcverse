import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const registryPath = path.join(rootDir, 'utils', 'calculatorRegistry.ts');
const bundlePath = path.join(rootDir, 'utils', 'bundleRegistry.ts');

const LANGUAGES = ['en', 'es', 'fr', 'ru', 'hi', 'ar'];

// Ensure the build directory exists
if (!fs.existsSync(distDir)) {
  console.log('Dist directory not found. Skipping route generation (run this after "vite build").');
  process.exit(0);
}

try {
  const templateHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  let count = 0;

  // Helper to write file
  const writeRoute = (lang, relativePath, title, desc) => {
    const targetDir = path.join(distDir, lang, relativePath);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    
    let pageHtml = templateHtml;
    // Simple title replacement - in a real app we'd translate these too
    pageHtml = pageHtml.replace(/<title>.*<\/title>/, `<title>${title} - CalcVerse</title>`);
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="description" content="${desc}" />`
    );
    // Adjust base path if necessary, or ensure assets are absolute (Vite handles absolute usually)
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    count++;
  };

  // Helper to write a static redirect file for non-language paths
  const writeRedirect = (relativePath) => {
    if (!relativePath) return; // Don't overwrite root index.html

    const targetDir = path.join(distDir, relativePath);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    
    // Create a lightweight redirect file that preserves query params
    const redirectHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirecting...</title>
    <script>
      // Preserve query parameters and hash
      var p = window.location.pathname;
      var q = window.location.search;
      var h = window.location.hash;
      
      // Ensure we treat the path correctly
      var pathStr = p.startsWith('/') ? p : '/' + p;
      
      // Redirect to English version by default
      window.location.href = '/en' + pathStr + q + h;
    </script>
    <meta http-equiv="refresh" content="0;url=/en/${relativePath}" />
  </head>
  <body>
    <p>Redirecting to <a href="/en/${relativePath}">/en/${relativePath}</a>...</p>
  </body>
</html>`;
    
    fs.writeFileSync(path.join(targetDir, 'index.html'), redirectHtml);
  };

  // --- 1. STATIC PAGES ---
  const STATIC_PAGES = [
    { path: 'explore', title: 'Explore Calculators', desc: 'Discover over 250 tools for every need.' },
    { path: 'bundles', title: 'Calculator Bundles', desc: 'Curated collections of tools designed to help you solve complex problems.' },
    { path: 'builder', title: 'Calculator Builder', desc: 'Combine two formulas to create your own custom workflow.' },
    { path: 'my-calculators', title: 'My Custom Calculators', desc: 'Manage your custom built calculator workflows.' },
    { path: 'project-folders', title: 'Project Folders', desc: 'Organize your calculations into projects.' },
    { path: 'visual-discovery', title: 'Visual Discovery', desc: 'Explore calculators in interactive 3D environments.' },
    { path: 'workspace', title: 'Workspace', desc: 'Multi-tab calculator workspace for productivity.' },
    { path: 'salary-map', title: 'Salary Heatmap', desc: 'Global and US purchasing power parity map.' },
    { path: 'slope', title: 'Slope Calculator', desc: 'Calculate gradient and slope percentage between two points.' },
    { path: 'load-balancer', title: 'Electrical Load Balancer', desc: 'Plan electrical circuits and avoid overloads.' },
    { path: 'randomness-engine', title: 'Randomness Engine', desc: 'Dice rollers and loot generators for TTRPGs.' },
    { path: 'time-travel', title: 'Inflation Time Machine', desc: 'Calculate historical purchasing power.' },
    { path: 'compare', title: 'Comparison Matrix', desc: 'Compare different calculation scenarios side-by-side.' },
    { path: 'terms', title: 'Terms of Service', desc: 'Terms and conditions.' },
    { path: 'privacy', title: 'Privacy Policy', desc: 'Privacy policy and data handling.' }
  ];

  console.log('Generating routes for Main Pages...');
  for (const lang of LANGUAGES) {
    // Generate Root for language (e.g. /ar/index.html)
    writeRoute(lang, '', 'CalcVerse', 'The Ultimate Calculator Suite');

    for (const page of STATIC_PAGES) {
       writeRoute(lang, page.path, page.title, page.desc);
       // Generate redirect only once (when processing english)
       if (lang === 'en') writeRedirect(page.path);
    }
  }

  // --- 2. CATEGORIES ---
  const CATEGORIES = [
    'Finance & Money',
    'Personal Finance & Taxes',
    'Health & Fitness',
    'Nutrition & Food',
    'Education & Study Tools',
    'Careers & HR',
    'Business & Finance Tools',
    'Marketing & Social Media',
    'Tech, Dev & Data',
    'Conversions & Utilities',
    'Home, DIY & Real Estate',
    'Construction, Engineering & Trades',
    'Automotive & Transportation',
    'Travel & Transport',
    'Energy & Utilities',
    'Environment & Agriculture',
    'Science & Math',
    'Law, Dates & Legal Tools',
    'Parenting & Family',
    'Beauty, Fashion & Lifestyle',
    'Sports & Recreation',
    'Gaming & Gamification',
    'Music & Audio',
    'Photography & Media',
    'Language & Writing Tools',
    'Shopping & E-commerce',
    'Events & Planning',
    'Misc & Fun / Niche Ideas',
    'Utility / Admin'
  ];

  console.log('Generating routes for Categories...');
  for (const lang of LANGUAGES) {
    for (const cat of CATEGORIES) {
        writeRoute(lang, `category/${cat}`, `${cat} Calculators`, `Browse our collection of free ${cat} calculators.`);
        if (lang === 'en') writeRedirect(`category/${cat}`);
    }
  }

  // --- 3. CALCULATORS ---
  console.log('Generating routes for Calculators...');
  const registrySrc = fs.readFileSync(registryPath, 'utf-8');
  const calcRegex = /mkCalc\(\s*['"]([\w-]+)['"]\s*,\s*['"]([^'"]+)['"]/g;
  let match;
  
  // Collect all calculators first
  const calculators = [];
  while ((match = calcRegex.exec(registrySrc)) !== null) {
    calculators.push({ id: match[1], name: match[2] });
  }

  for (const lang of LANGUAGES) {
    for (const calc of calculators) {
        writeRoute(lang, `calculator/${calc.id}`, calc.name, `Use our free online ${calc.name} to calculate results instantly.`);
        if (lang === 'en') writeRedirect(`calculator/${calc.id}`);
    }
  }

  // --- 4. BUNDLES ---
  console.log('Generating routes for Bundles...');
  if (fs.existsSync(bundlePath)) {
      const bundleSrc = fs.readFileSync(bundlePath, 'utf-8');
      const bundleRegex = /id:\s*['"]([\w-]+)['"],\s*title:\s*['"]([^'"]+)['"]/g;
      
      const bundles = [];
      while ((match = bundleRegex.exec(bundleSrc)) !== null) {
         bundles.push({ id: match[1], name: match[2] });
      }

      for (const lang of LANGUAGES) {
        for (const bundle of bundles) {
             writeRoute(lang, `bundle/${bundle.id}`, `${bundle.name} Bundle`, `Access the ${bundle.name} calculator bundle.`);
             if (lang === 'en') writeRedirect(`bundle/${bundle.id}`);
        }
      }
  }

  console.log(`Successfully generated static entry points for ${count} routes across ${LANGUAGES.length} languages.`);
} catch (err) {
  console.error('Failed to generate static routes:', err);
  process.exit(1);
}