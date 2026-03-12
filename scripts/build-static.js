import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.join(__dirname, '..', 'content', 'posts');
const pagesDir = path.join(__dirname, '..', 'content', 'pages');
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const outputDir = path.join(__dirname, '..', 'dist');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy images to dist
function copyImages() {
  if (!fs.existsSync(imagesDir)) {
    console.log('No images directory found');
    return;
  }
  
  const outputImagesDir = path.join(outputDir, 'images');
  if (!fs.existsSync(outputImagesDir)) {
    fs.mkdirSync(outputImagesDir, { recursive: true });
  }
  
  function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const files = fs.readdirSync(src);
      for (const file of files) {
        copyRecursive(path.join(src, file), path.join(dest, file));
      }
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  
  copyRecursive(imagesDir, outputImagesDir);
  console.log('Copied images to dist/images');
}

// Generate posts.json
function generatePosts() {
  if (!fs.existsSync(postsDir)) {
    console.log('No posts directory found');
    return [];
  }

  const filenames = fs.readdirSync(postsDir);
  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(postsDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      return {
        id: filename.replace('.md', ''),
        ...data,
        content
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.writeFileSync(path.join(outputDir, 'posts.json'), JSON.stringify(posts, null, 2));
  console.log(`Generated posts.json with ${posts.length} posts`);
  return posts;
}

// Generate pages.json
function generatePages() {
  if (!fs.existsSync(pagesDir)) {
    console.log('No pages directory found');
    return [];
  }

  const filenames = fs.readdirSync(pagesDir);
  const pages = filenames
    .filter(filename => filename.endsWith('.md') && !filename.startsWith('_'))
    .map(filename => {
      const filePath = path.join(pagesDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      return {
        id: filename.replace('.md', ''),
        ...data,
        content
      };
    });

  fs.writeFileSync(path.join(outputDir, 'pages.json'), JSON.stringify(pages, null, 2));
  console.log(`Generated pages.json with ${pages.length} pages`);
  return pages;
}

// Generate RSS feed
function generateRSS(posts) {
  const siteUrl = 'https://ruggedscot.com';
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>RuggedScot | Chronicles of the West</title>
    <link>${siteUrl}</link>
    <description>A digital journal documenting life in the rugged west. From the peaks of the Munros to the warmth of a kitchen oven.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.slice(0, 20).map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug || post.id}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug || post.id}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      ${post.keywords?.map(kw => `<category>${escapeXml(kw)}</category>`).join('') || ''}
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[
        <img src="${post.image}" alt="${post.title}" />
        ${post.content}
      ]]></content:encoded>
    </item>`).join('')}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(outputDir, 'rss.xml'), rss);
  console.log('Generated rss.xml');
}

function escapeXml(unsafe) {
  return unsafe?.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  }) || '';
}

// Main
console.log('Building static site data...');
const posts = generatePosts();
generatePages();
generateRSS(posts);
copyImages();
console.log('Static site data generated successfully!');
