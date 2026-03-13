import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, ChevronRight, ChevronLeft, Map, Cloud, Sun, CloudRain, Wind, Snowflake } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { usePosts, cn } from '../components/Layout';

const POSTS_PER_PAGE = 6;

export default function HomePage() {
  const { posts, isLoading } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number; phrase: string; icon: React.ReactNode } | null>(null);

  // Weather code to Scottish phrase mapping
  const getScottishWeather = (code: number, temp: number) => {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return { phrase: temp > 15 ? "Taps aff weather" : "Braw day oot", icon: <Sun size={16} className="text-yellow-400" /> };
    if (code >= 1 && code <= 3) return { phrase: "Bit grey but no bad", icon: <Cloud size={16} className="text-zinc-400" /> };
    if (code >= 45 && code <= 48) return { phrase: "Can’t see hee haw", icon: <Cloud size={16} className="text-zinc-500" /> };
    if (code >= 51 && code <= 55) return { phrase: "Bit dreich the day", icon: <CloudRain size={16} className="text-blue-400" /> };
    if (code >= 61 && code <= 65) return { phrase: "Pure pishing doon", icon: <CloudRain size={16} className="text-blue-500" /> };
    if (code >= 71 && code <= 77) return { phrase: "Pure baltic oot there", icon: <Snowflake size={16} className="text-white" /> };
    if (code >= 80 && code <= 82) return { phrase: "Pure pishing doon", icon: <CloudRain size={16} className="text-blue-500" /> };
    if (code >= 85 && code <= 86) return { phrase: "Snowing like buggery", icon: <Snowflake size={16} className="text-white" /> };
    if (code >= 95 && code <= 99) return { phrase: "Blawin a hoolie", icon: <Wind size={16} className="text-zinc-300" /> };
    return { phrase: "Bit unpredictable", icon: <Cloud size={16} className="text-zinc-400" /> };
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather from Open-Meteo
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Glasgow coordinates
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=55.8642&longitude=-4.2518&current_weather=true'
        );
        const data = await response.json();
        const current = data.current_weather;
        const scottish = getScottishWeather(current.weathercode, current.temperature);
        
        setWeather({
          temp: Math.round(current.temperature),
          phrase: scottish.phrase,
          icon: scottish.icon
        });
      } catch (error) {
        console.error('Weather fetch failed:', error);
        setWeather({ temp: 0, phrase: "Couldnae get the weather", icon: <Cloud size={16} /> });
      }
    };

    fetchWeather();
    // Update weather every 10 minutes
    const weatherTimer = setInterval(fetchWeather, 600000);
    return () => clearInterval(weatherTimer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-loch border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const allKeywords = Array.from(new Set(posts.slice(0, 5).flatMap(p => p.keywords || []))).slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>RuggedScot | Chronicles of the West</title>
        <meta name="description" content="A digital journal documenting life in the rugged west. From the peaks of the Munros to the warmth of a kitchen oven." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="RuggedScot | Chronicles of the West" />
        <meta property="og:description" content="A digital journal documenting life in the rugged west. Chronicles, recipes, and adventures from Scotland." />
        <meta property="og:image" content="https://ruggedscot.com/images/home-hero.png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        <meta property="og:url" content="https://ruggedscot.com" />
        <meta property="og:site_name" content="RuggedScot" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RuggedScot | Chronicles of the West" />
        <meta name="twitter:description" content="A digital journal documenting life in the rugged west. Chronicles, recipes, and adventures from Scotland." />
        <meta name="twitter:image" content="https://ruggedscot.com/images/home-hero.png" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[360px] rounded-xl overflow-hidden mb-12 group">
        <img
          src="/images/home-hero.png"
          alt="Scottish Highlands"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
        {/* Top Right Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-block px-2 py-0.5 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
            Easily offended? Maybe this isn't the place for you.
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <span className="inline-block px-2.5 py-0.5 bg-loch text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
              Welcome
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 max-w-2xl leading-tight">
              Welcome to The Rugged Scot
            </h2>
            <p className="text-zinc-200 text-base max-w-xl mb-6 font-light flex flex-col gap-2">
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-loch" />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} — 
                {weather ? (
                  <span className="flex items-center gap-1">
                    {weather.icon}
                    {weather.temp}°C — {weather.phrase}
                  </span>
                ) : (
                  "Loading weather..."
                )}
              </span>
              <span className="flex items-center gap-2 text-sm text-zinc-400">
                <Map size={14} className="text-loch" />
                {posts.length} Chronicles documented so far.
              </span>
            </p>

            {/* Latest Keywords */}
            <div className="flex flex-wrap gap-2 mt-4">
              {allKeywords.map(keyword => (
                <Link
                  key={keyword}
                  to={`/tag/${encodeURIComponent(keyword)}`}
                  className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded text-[10px] text-white/80 uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  #{keyword}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-serif font-bold italic">Latest Chronicles</h3>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 mx-6 hidden sm:block" />
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {paginatedPosts.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
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
                <h4 className="text-xl font-serif font-bold group-hover:text-loch transition-colors leading-snug">
                  {post.title}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 font-light leading-relaxed">
                  {post.excerpt}
                </p>
                {post.keywords && post.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.keywords.slice(0, 3).map(kw => (
                      <span
                        key={kw}
                        className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter"
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

      {/* Browse All CTA */}
      <div className="mt-16 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-loch text-white rounded-full font-medium hover:bg-loch/90 transition-colors shadow-lg shadow-loch/20"
        >
          Browse All Chronicles
          <ChevronRight size={18} />
        </Link>
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
