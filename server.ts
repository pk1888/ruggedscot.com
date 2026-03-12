import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API to get all posts from markdown files
  app.get("/api/posts", (req, res) => {
    const postsDirectory = path.join(__dirname, "content", "posts");
    
    if (!fs.existsSync(postsDirectory)) {
      return res.json([]);
    }

    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames
      .filter(filename => filename.endsWith(".md"))
      .map(filename => {
        const filePath = path.join(postsDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContent);
        
        return {
          id: filename.replace(".md", ""),
          ...data,
          content
        };
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(posts);
  });

  // API to get a single post by slug
  app.get("/api/posts/:slug", (req, res) => {
    const { slug } = req.params;
    const postsDirectory = path.join(__dirname, "content", "posts");
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Post not found" });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    
    res.json({
      id: slug,
      ...data,
      content
    });
  });

  // RSS Feed endpoint
  app.get("/rss.xml", (req, res) => {
    const postsDirectory = path.join(__dirname, "content", "posts");
    
    if (!fs.existsSync(postsDirectory)) {
      return res.status(404).send("No posts found");
    }

    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames
      .filter(filename => filename.endsWith(".md"))
      .map(filename => {
        const filePath = path.join(postsDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContent);
        
        return {
          id: filename.replace(".md", ""),
          ...data,
          content
        };
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);

    const siteUrl = req.headers.host ? `https://${req.headers.host}` : 'https://ruggedscot.com';
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>RuggedScot | Chronicles of the West</title>
    <link>${siteUrl}</link>
    <description>A digital journal documenting life in the rugged west. From the peaks of the Munros to the warmth of a kitchen oven.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map((post: any) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.id}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.id}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      ${post.keywords?.map((kw: string) => `<category>${escapeXml(kw)}</category>`).join('') || ''}
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[
        <img src="${post.image}" alt="${post.title}" />
        ${post.content}
      ]]></content:encoded>
    </item>`).join('')}
  </channel>
</rss>`;

    res.set('Content-Type', 'application/rss+xml');
    res.send(rss);
  });

  function escapeXml(unsafe: string): string {
    return unsafe?.replace(/[<>&'"]/g, (c) => {
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

  // API to get all pages from markdown files
  app.get("/api/pages", (req, res) => {
    const pagesDirectory = path.join(__dirname, "content", "pages");
    
    if (!fs.existsSync(pagesDirectory)) {
      return res.json([]);
    }

    const filenames = fs.readdirSync(pagesDirectory);
    const pages = filenames
      .filter(filename => filename.endsWith(".md"))
      .map(filename => {
        const filePath = path.join(pagesDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContent);
        
        return {
          id: filename.replace(".md", ""),
          ...data,
          content
        };
      });

    res.json(pages);
  });

  // API to get a single page by slug
  app.get("/api/pages/:slug", (req, res) => {
    const { slug } = req.params;
    const pagesDirectory = path.join(__dirname, "content", "pages");
    const filePath = path.join(pagesDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Page not found" });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    
    res.json({
      id: slug,
      ...data,
      content
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
