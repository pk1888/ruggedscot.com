import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to find all markdown files
function findMarkdownFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to update image links in a file
function updateImageLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Find all image references (both markdown and front matter)
  // Pattern matches: /images/.../filename.jpg, /images/.../filename.jpeg, /images/.../filename.png
  const imagePattern = /(\/images\/[^"\'\s\)]+)\.(jpg|jpeg|png)/gi;
  
  content = content.replace(imagePattern, (match, basePath, ext) => {
    // Check if WebP version exists
    const webpPath = basePath + '.webp';
    const publicPath = path.join(process.cwd(), 'public', webpPath);
    
    if (fs.existsSync(publicPath)) {
      console.log(`  🔄 ${match} -> ${webpPath}`);
      modified = true;
      return webpPath;
    }
    
    // If WebP doesn't exist, keep original
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔍 Scanning for markdown files...\n');

// Find all markdown files in content directory
const contentDir = path.join(process.cwd(), 'content');
const mdFiles = findMarkdownFiles(contentDir);

console.log(`Found ${mdFiles.length} markdown files\n`);

let updatedCount = 0;

for (const file of mdFiles) {
  const updated = updateImageLinks(file);
  if (updated) updatedCount++;
}

console.log(`\n✨ Complete! Updated ${updatedCount} files.`);
console.log('📝 Now you can build and deploy your site');
