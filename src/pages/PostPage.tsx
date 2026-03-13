import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import Markdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import { usePosts, cn } from '../components/Layout';
import Gallery from '../components/Gallery';

export default function PostPage() {
  const { posts, isLoading, getPostBySlug, getRelatedPosts } = usePosts();
  const slug = window.location.pathname.split('/').pop();
  const post = getPostBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-loch border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-serif font-bold mb-4">Chronicle Not Found</h1>
        <p className="text-zinc-500 mb-6">The chronicle you're looking for doesn't exist.</p>
        <Link to="/blog" className="text-loch font-bold uppercase tracking-widest hover:underline">
          Back to Chronicles
        </Link>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <Helmet>
        <title>{post.title} | RuggedScot</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="article:published_time" content={post.date} />
        {post.keywords?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-loch mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Back to Chronicles
      </Link>

      {/* Featured Image */}
      <div className="relative h-[360px] rounded-xl overflow-hidden mb-12 group">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/75 flex flex-col justify-end p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to={`/blog?category=${encodeURIComponent(post.category)}`}
              className="inline-block px-3 py-1 bg-loch text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 hover:bg-loch/80 transition-colors"
            >
              {post.category}
            </Link>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 max-w-2xl leading-tight drop-shadow-lg">
              {post.title}
            </h1>
            {post.keywords && post.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.keywords.map(kw => (
                  <Link
                    key={kw}
                    to={`/tag/${encodeURIComponent(kw)}`}
                    className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest hover:text-white transition-colors drop-shadow"
                  >
                    #{kw}
                  </Link>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 text-zinc-200 text-sm drop-shadow">
              <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
              <span className="flex items-center gap-2"><Clock size={16} /> {post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Post Content */}
      <div className="markdown-body prose dark:prose-invert max-w-none">
        <Markdown>{post.content}</Markdown>
      </div>

      {/* Photo Gallery */}
      {post.gallery && post.gallery.length > 0 && (
        <Gallery photos={post.gallery} title="Photo Gallery" />
      )}

      {/* Author Box */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-loch rounded-full flex items-center justify-center text-white font-serif font-bold text-xl">
            R
          </div>
          <div>
            <p className="font-bold text-sm">Written by Rugged Scot</p>
            <p className="text-xs text-zinc-500">Explorer, Baker, and Hill Climber</p>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-2xl font-serif font-bold mb-8">Related Chronicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(related => (
              <Link
                key={related.id}
                to={`/blog/${related.slug || related.id}`}
                className="group block"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="font-serif font-bold text-sm group-hover:text-loch transition-colors line-clamp-2">
                  {related.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-1">{related.date}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
