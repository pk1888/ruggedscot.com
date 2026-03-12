import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { usePosts, cn } from '../components/Layout';

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const { posts, isLoading, getPostsByTag } = usePosts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-loch border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-serif font-bold mb-4">No Tag Specified</h1>
        <Link to="/blog" className="text-loch font-bold uppercase tracking-widest hover:underline">
          Back to Chronicles
        </Link>
      </div>
    );
  }

  const taggedPosts = getPostsByTag(tag);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1160px] mx-auto"
    >
      <Helmet>
        <title>Tag: {tag} | RuggedScot</title>
        <meta name="description" content={`Browse chronicles tagged with ${tag}.`} />
      </Helmet>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Tag size={24} className="text-loch" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold italic">{tag}</h1>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">
          {taggedPosts.length} {taggedPosts.length === 1 ? 'chronicle' : 'chronicles'} tagged with <span className="text-loch font-medium">#{tag}</span>
        </p>
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 mt-4" />
      </div>

      {/* Posts Grid */}
      {taggedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {taggedPosts.map((post, idx) => (
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
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-zinc-500 font-light italic text-lg">No chronicles found with this tag.</p>
          <Link
            to="/blog"
            className="mt-4 inline-block text-loch text-sm font-bold uppercase tracking-widest hover:underline"
          >
            Browse All Chronicles
          </Link>
        </div>
      )}
    </motion.div>
  );
}
