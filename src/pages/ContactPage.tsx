import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { Map, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { usePosts } from '../components/Layout';

export default function ContactPage() {
  const { getPageBySlug, isPagesLoading } = usePosts();
  const page = getPageBySlug('contact');

  if (isPagesLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-loch border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-serif font-bold mb-4">Page Not Found</h1>
        <p className="text-zinc-500 mb-6">The contact page content is missing.</p>
        <Link to="/" className="text-loch font-bold uppercase tracking-widest hover:underline">
          Back Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Helmet>
        <title>{page.title} | RuggedScot</title>
        <meta name="description" content={page.description} />
      </Helmet>

      {page.hero_image && (
        <div className="relative h-[360px] rounded-xl overflow-hidden mb-12 group">
          <img
            src={page.hero_image}
            alt={page.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {page.subtitle && (
                <span className="inline-block px-2.5 py-0.5 bg-loch text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
                  {page.subtitle}
                </span>
              )}
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 max-w-2xl leading-tight">
                {page.title}
              </h2>
              {page.quote && (
                <p className="text-zinc-200 text-base max-w-xl font-light">
                  {page.quote}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="markdown-body text-lg">
          <Markdown>{page.content}</Markdown>
        </div>

        {page.has_form && (
          <form
            onSubmit={(e) => { e.preventDefault(); alert('Message sent into the ether. Paul will find it.'); }}
            className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <h3 className="font-serif font-bold text-xl mb-6">Send a Message</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Your Name</label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-loch outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-loch outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Subject</label>
              <input
                required
                type="text"
                placeholder="Munro Climbing / Recipe Question"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-loch outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Your Message</label>
              <textarea
                required
                rows={6}
                placeholder="What's on your mind?"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-loch outline-none transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-loch text-white font-bold py-4 rounded-xl hover:bg-loch/90 transition-all shadow-lg shadow-loch/20"
            >
              Send Message
            </button>
          </form>
        )}
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
