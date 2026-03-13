import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function MailingListPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    
    if (subscribers.some((sub: { email: string }) => sub.email === email)) {
      setStatus('error');
      setMessage('You are already subscribed to the mailing list!');
      return;
    }

    subscribers.push({
      email,
      name: name || 'Anonymous',
      subscribedAt: new Date().toISOString()
    });
    
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    
    setStatus('success');
    setMessage('Thank you for subscribing! You will receive updates from the rugged west.');
    setEmail('');
    setName('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Helmet>
        <title>Join the Mailing List | RuggedScot</title>
        <meta name="description" content="Subscribe fur updates from RuggedScot! Chronicles, recipes, and adventures delivered straight to yer inbox. Join ma mailing list fur the latest Scottish content." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Join the Mailing List | RuggedScot" />
        <meta property="og:description" content="Subscribe fur updates from RuggedScot! Chronicles, recipes, and adventures delivered straight to yer inbox." />
        <meta property="og:image" content="https://ruggedscot.com/images/home-hero.png" />
        <meta property="og:url" content="https://ruggedscot.com/subscribe" />
        <meta property="og:site_name" content="RuggedScot" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join the Mailing List | RuggedScot" />
        <meta name="twitter:description" content="Subscribe fur updates from RuggedScot! Chronicles, recipes, and adventures delivered straight to yer inbox." />
        <meta name="twitter:image" content="https://ruggedscot.com/images/home-hero.png" />
        <link rel="canonical" href="https://ruggedscot.com/subscribe" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Join the Mailing List",
            "description": "Subscribe fur updates from RuggedScot! Chronicles, recipes, and adventures delivered straight to yer inbox.",
            "url": "https://ruggedscot.com/subscribe"
          })}
        </script>
      </Helmet>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold italic mb-4">
          Join ma Mailing List!
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Subscribe fur updates from RuggedScot! Chronicles, recipes, and adventures delivered straight to yer inbox.
        </p>
      </div>

      {/* Form Section */}
      <div className="relative max-w-xl mx-auto">
        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-8 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600"
        >
          <h2 className="text-xl font-serif font-bold text-zinc-700 dark:text-zinc-300 mb-2">
            Coming Soon
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            The mailing list is naw active yet. Check back soon to subscribe fur updates from RuggedScot!
          </p>
        </motion.div>

        {/* Disabled Form */}
        <div className="relative z-10 bg-white dark:bg-zinc-900 rounded-2xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-xl opacity-60 pointer-events-none">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-serif font-bold mb-2">Subscribed!</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">{message}</p>
              <button
                onClick={() => setStatus('idle')}
                className="text-loch font-bold uppercase tracking-widest hover:underline text-sm"
              >
                Subscribe Another Email
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-loch outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-loch outline-none transition-all"
                />
              </div>

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm"
                >
                  <span>{message}</span>
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full bg-loch text-white font-bold py-4 rounded-xl hover:bg-loch/90 transition-all shadow-lg shadow-loch/20"
              >
                Subscribe
              </button>

              <p className="text-xs text-zinc-400 text-center">
                No spam, ever. Unsubscribe anytime. Your privacy is respected.
              </p>
            </form>
          )}
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
