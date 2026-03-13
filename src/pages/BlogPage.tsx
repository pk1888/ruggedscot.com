import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Markdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import { usePosts, cn } from '../components/Layout';

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const { posts, isLoading, getPostsByCategory } = usePosts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const categoryFilter = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-loch border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredPosts = posts.filter(p => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const pageTitle = searchQuery 
    ? `Search: ${searchQuery}` 
    : categoryFilter !== 'All' 
      ? categoryFilter 
      : 'All Chronicles';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1160px] mx-auto"
    >
      <Helmet>
        <title>{pageTitle} | RuggedScot</title>
        <meta name="description" content={`Browse ${pageTitle.toLowerCase()} from the rugged west chronicles.`} />
      </Helmet>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold italic">
            {pageTitle}
          </h1>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'chronicle' : 'chronicles'}
          </span>
        </div>
        <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['All', 'Travel', 'Hill Climbing', 'Recipe', 'Hobbies'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              if (cat === 'All') {
                searchParams.delete('category');
              } else {
                searchParams.set('category', cat);
              }
              setSearchParams(searchParams);
            }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              categoryFilter === cat
                ? "bg-loch text-white shadow-lg shadow-loch/20"
                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-loch dark:hover:border-loch"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Link to={`/blog/${post.slug || post.id}`} className="block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold group-hover:text-loch transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                  {post.keywords && post.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.keywords.slice(0, 3).map(kw => (
                        <span 
                          key={kw} 
                          className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter hover:text-loch transition-colors"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-zinc-500 font-light italic text-lg">No chronicles found matching your criteria.</p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-4 text-loch text-sm font-bold uppercase tracking-widest hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-10 h-10 rounded-full text-sm font-medium transition-all",
                  currentPage === page
                    ? "bg-loch text-white shadow-lg shadow-loch/20"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                )}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Motto */}
      <div className="mt-12 text-center">
        <p className="text-2xl md:text-3xl font-serif font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed pb-4">
          "Stay rugged, stay vigilant."
        </p>
      </div>
    </motion.div>
  );
}
