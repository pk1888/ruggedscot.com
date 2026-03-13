import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, Clock, Archive as ArchiveIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { usePosts, cn } from '../components/Layout';

export default function ArchivePage() {
  const { posts, isLoading, getArchiveByYear, getAllTags } = usePosts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-loch border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const archive = getArchiveByYear();
  const years = Object.keys(archive).sort((a, b) => parseInt(b) - parseInt(a));
  const allTags = getAllTags();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1160px] mx-auto"
    >
      <Helmet>
        <title>Archive | RuggedScot</title>
        <meta name="description" content="Browse all chronicles by year and explore the complete archive of RuggedScot.com." />
      </Helmet>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <ArchiveIcon size={28} className="text-loch" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold italic">Chronicle Archive</h1>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Explore the complete collection of chronicles, organized by year. From the first steps on Munros to the latest recipes from the kitchen.
        </p>
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Archive */}
        <div className="lg:col-span-2 space-y-12">
          {years.map(year => (
            <div key={year} className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                <span className="text-loch">{year}</span>
                <span className="text-sm font-normal text-zinc-400">
                  {archive[year].length} {archive[year].length === 1 ? 'chronicle' : 'chronicles'}
                </span>
              </h2>
              
              <div className="space-y-4">
                {archive[year].map(post => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug || post.id}`}
                    className="group block p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-loch dark:hover:border-loch transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <Calendar size={14} />
                        <span>{new Date(post.date).toLocaleDateString('en-GB', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-serif font-bold group-hover:text-loch transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-1 mt-1">
                          {post.excerpt}
                        </p>
                      </div>
                      
                      <ChevronRight size={18} className="text-zinc-300 group-hover:text-loch transition-colors flex-shrink-0" />
                    </div>
                    
                    {post.keywords && post.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        {post.keywords.map(kw => (
                          <span
                            key={kw}
                            className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Stats */}
          <div className="p-6 bg-loch text-white rounded-2xl shadow-xl shadow-loch/20">
            <h3 className="font-serif font-bold mb-4">Archive Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Total Chronicles</span>
                <span className="font-bold">{posts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Years Active</span>
                <span className="font-bold">{years.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Categories</span>
                <span className="font-bold">
                  {new Set(posts.map(p => p.category)).size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Tags</span>
                <span className="font-bold">{allTags.length}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-serif font-bold mb-4">Categories</h3>
            <div className="space-y-2">
              {Array.from(new Set(posts.map(p => p.category))).sort().map(cat => {
                const count = posts.filter(p => p.category === cat).length;
                return count > 0 ? (
                  <Link
                    key={cat}
                    to={`/blog?category=${encodeURIComponent(cat)}`}
                    className="flex justify-between items-center py-2 hover:text-loch transition-colors"
                  >
                    <span>{cat}</span>
                    <span className="text-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-serif font-bold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 15).map(tag => (
                <Link
                  key={tag}
                  to={`/tag/${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs hover:bg-loch hover:text-white transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Motto */}
      <div className="mt-12 text-center">
        <p className="text-2xl md:text-3xl font-serif font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed pb-4">
          "Stay rugged, stay vigilant."
        </p>
      </div>
    </motion.div>
  );
}
