import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Rss, Globe, User, AlertCircle } from 'lucide-react';
import { usePosts } from '../components/Layout';

// Mock data for link partners - will be populated as bloggers reach out
const linkPartners: Array<{
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  dateAdded: string;
  rss?: string;
}> = [
  // Example structure for when you get submissions:
  // {
  //   id: 1,
  //   name: "Blog Name",
  //   url: "https://example.com",
  //   description: "Brief description of what they write about",
  //   category: "Personal",
  //   tags: ["scotland", "hiking", "ranting"],
  //   dateAdded: "2026-03-13",
  //   rss?: "https://example.com/rss.xml"
  // }
];

const categories = ["All", "Personal", "Tech", "Scotland", "Retro", "Rants", "Photography", "Cooking", "Random"];

export default function LinkExchangePage() {
  const { getPageBySlug, isPagesLoading } = usePosts();
  const page = getPageBySlug('link-exchange');
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  if (isPagesLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-loch border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-6xl mx-auto text-center py-20">
        <h1 className="text-2xl font-serif font-bold mb-4">Page Not Found</h1>
        <p className="text-zinc-500 mb-6">The link exchange page content is missing.</p>
        <Link to="/" className="text-loch font-bold uppercase tracking-widest hover:underline">
          Back Home
        </Link>
      </div>
    );
  }

  const filteredPartners = selectedCategory === "All" 
    ? linkPartners 
    : linkPartners.filter(p => p.category === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <Helmet>
        <title>{page.title} | RuggedScot</title>
        <meta name="description" content={page.description} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:image" content={page.hero_image} />
        <link rel="canonical" href="https://ruggedscot.com/link-exchange" />
      </Helmet>

      {/* Hero Header */}
      <div className="relative h-[280px] rounded-xl overflow-hidden mb-8 group">
        <img
          src={page.hero_image}
          alt={page.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">
              Link Exchange
            </h1>
            <p className="text-lg text-zinc-200 max-w-2xl">
              Real Pish Wanted • No AI Slop Allowed
            </p>
          </motion.div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-loch flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold mb-2">Looking for Real Bloggers</h2>
            <p className="text-zinc-400 mb-4">
              I'm sick of AI-generated content. Looking for real humans writing actual nonsense 
              instead of algorithm-optimized slop. If you run a blog with personality, 
              <Link to="/contact" className="text-loch hover:underline ml-1">get in touch</Link>.
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-zinc-800 rounded-full text-zinc-300">✓ Real humans only</span>
              <span className="px-3 py-1 bg-zinc-800 rounded-full text-zinc-300">✓ Personality required</span>
              <span className="px-3 py-1 bg-zinc-800 rounded-full text-zinc-300">✓ Reciprocal links</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-loch text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between text-sm text-zinc-500 mb-6 pb-4 border-b border-zinc-800">
        <span>Showing {filteredPartners.length} link partners</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>

      {/* Link Database Grid */}
      {filteredPartners.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
          <Globe className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zinc-300 mb-2">No Links Yet</h3>
          <p className="text-zinc-500 max-w-md mx-auto mb-4">
            This database is empty because I'm still searching for real bloggers 
            who haven't sold their soul to the AI content machine.
          </p>
          <p className="text-zinc-600 text-sm">
            Think your blog qualifies? Send me your details.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map(partner => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-loch/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg group-hover:text-loch transition-colors">
                  {partner.name}
                </h3>
                <div className="flex gap-2">
                  {partner.rss && (
                    <a 
                      href={partner.rss} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-loch transition-colors"
                      title="RSS Feed"
                    >
                      <Rss size={16} />
                    </a>
                  )}
                  <a 
                    href={partner.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-loch transition-colors"
                    title="Visit Site"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
              
              <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                {partner.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {partner.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-500">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-zinc-600">
                  {new Date(partner.dateAdded).toLocaleDateString('en-GB', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
