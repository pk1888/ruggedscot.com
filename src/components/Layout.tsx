import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Search,
  Menu, 
  X,
  ChevronDown,
  Rss,
  Calendar,
  Clock,
  Archive,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Post, Page, Theme } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

interface PostContextType {
  posts: Post[];
  pages: Page[];
  isLoading: boolean;
  isPagesLoading: boolean;
  getPostBySlug: (slug: string) => Post | undefined;
  getPostsByTag: (tag: string) => Post[];
  getPostsByCategory: (category: string) => Post[];
  getRelatedPosts: (post: Post, count?: number) => Post[];
  getAllTags: () => string[];
  getArchiveByYear: () => Record<string, Post[]>;
  getPageBySlug: (slug: string) => Page | undefined;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within PostProvider');
  return context;
}

export default function Layout() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [posts, setPosts] = useState<Post[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPagesLoading, setIsPagesLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch posts from static JSON
    const fetchPosts = async () => {
      try {
        const response = await fetch('/posts.json');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    // Fetch pages from static JSON
    const fetchPages = async () => {
      try {
        const response = await fetch('/pages.json');
        const data = await response.json();
        console.log('Pages fetched:', data);
        setPages(data);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setIsPagesLoading(false);
      }
    };
    fetchPosts();
    fetchPages();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug || p.id === slug);
  const getPostsByTag = (tag: string) => posts.filter(p => p.keywords?.includes(tag));
  const getPostsByCategory = (category: string) => posts.filter(p => p.category === category);
  
  const getRelatedPosts = (post: Post, count = 3) => {
    return posts
      .filter(p => p.id !== post.id && (
        p.category === post.category ||
        p.keywords?.some(k => post.keywords?.includes(k))
      ))
      .slice(0, count);
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    posts.forEach(p => p.keywords?.forEach(k => tags.add(k)));
    return Array.from(tags).sort();
  };

  const getArchiveByYear = () => {
    const archive: Record<string, Post[]> = {};
    posts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString();
      if (!archive[year]) archive[year] = [];
      archive[year].push(post);
    });
    return archive;
  };

  const getPageBySlug = (slug: string) => pages.find(p => p.slug === slug || p.id === slug);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navStructure = [
    {
      label: 'Chronicles',
      children: [
        { label: 'All Chronicles', path: '/blog' },
        { label: 'Travel', path: '/blog?category=Travel' },
        { label: 'Hill Climbing', path: '/blog?category=Hill%20Climbing' },
        { label: 'Thoughts', path: '/blog?category=Thoughts' },
      ]
    },
    {
      label: 'The Basics',
      children: [
        { label: 'Recipes', path: '/blog?category=Recipe' },
        { label: 'Hobbies', path: '/blog?category=Hobbies' },
        { label: 'The Lingo', path: '/lingo' },
      ]
    },
    { label: 'Archive', path: '/archive' },
    {
      label: 'More',
      children: [
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Subscribe', path: '/subscribe' },
      ]
    }
  ];

  return (
    <PostContext.Provider value={{ 
      posts, pages, isLoading, isPagesLoading, getPostBySlug, getPostsByTag, 
      getPostsByCategory, getRelatedPosts, getAllTags, getArchiveByYear, getPageBySlug
    }}>
      <ScrollToTop />
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
        {/* Tartan Overlay */}
        <div className="fixed inset-0 pointer-events-none tartan-pattern opacity-20 dark:opacity-5 z-0" />

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
            <div className="flex justify-between h-24 items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/images/logo.png"
                  alt="RuggedScot"
                  className="h-20 w-auto object-contain"
                />
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-6">
                {navStructure.map(item => (
                  <div 
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.children ? (
                      <div className="flex items-center gap-1 cursor-default py-4">
                        <span className={cn(
                          "text-sm font-medium transition-colors hover:text-loch",
                          item.children.some(child => {
                            const childPath = child.path.split('?')[0];
                            return location.pathname.startsWith(childPath) || location.pathname === childPath;
                          }) ? "text-loch" : "text-zinc-500 dark:text-zinc-400"
                        )}>
                          {item.label}
                        </span>
                        <ChevronDown size={14} className={cn(
                          "transition-transform duration-200 text-zinc-400",
                          activeDropdown === item.label ? "rotate-180" : ""
                        )} />
                        
                        <AnimatePresence>
                          {activeDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-0 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-2 z-50"
                            >
                              {item.children.map(child => (
                                <Link
                                  key={child.path}
                                  to={child.path}
                                  className={cn(
                                    "block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800",
                                    location.search.includes(child.path.split('?')[1] || '') || location.pathname === child.path.split('?')[0]
                                      ? "text-loch font-semibold" : "text-zinc-600 dark:text-zinc-400"
                                  )}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-loch py-4",
                          isActive(item.path) ? "text-loch underline underline-offset-8" : "text-zinc-500 dark:text-zinc-400"
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                
                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
                
                <a 
                  href="/rss.xml" 
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                  title="RSS Feed"
                >
                  <Rss size={18} />
                </a>
                
                {/* Search */}
                <div className="relative flex items-center">
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.form
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 200, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        onSubmit={handleSearch}
                        className="mr-2"
                      >
                        <input
                          type="text"
                          placeholder="Search chronicles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-full px-4 py-1.5 text-xs focus:ring-1 focus:ring-loch outline-none"
                          autoFocus
                        />
                      </motion.form>
                    )}
                  </AnimatePresence>
                  <button 
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                  >
                    {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                  </button>
                </div>

                <button 
                  onClick={handleToggleTheme}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>

              {/* Mobile Toggle */}
              <div className="md:hidden flex items-center gap-4">
                <button onClick={handleToggleTheme}>
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
              >
                <div className="px-4 py-6 space-y-6">
                  {navStructure.map(item => (
                    <div key={item.label} className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                        {item.label}
                      </h4>
                      <div className="space-y-2 pl-2">
                        {item.children ? (
                          item.children.map(child => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={cn(
                                "block w-full text-left text-lg font-medium transition-colors",
                                location.pathname === child.path.split('?')[0] ? "text-loch" : "text-zinc-600 dark:text-zinc-300"
                              )}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))
                        ) : (
                          <Link
                            to={item.path}
                            className={cn(
                              "block w-full text-left text-lg font-medium transition-colors",
                              isActive(item.path) ? "text-loch" : "text-zinc-600 dark:text-zinc-300"
                            )}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <main className="relative z-10 max-w-[1160px] mx-auto px-4 sm:px-6 py-8 min-h-[60vh]">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12">
          <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-6">
                  <img
                    src="/images/logo.png"
                    alt="RuggedScot"
                    className="h-24 w-auto object-contain"
                  />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm font-light leading-relaxed">
                  Documenting the rugged life in the west. From Munro peaks to the kitchen oven, I share my journey of returning to basics and staying vigilant in an increasingly controlled world.
                </p>
              </div>
              <div>
                <h5 className="font-serif font-bold mb-4">Explore</h5>
                <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400 font-light">
                  <li><Link to="/blog" className="hover:text-loch transition-colors">All Chronicles</Link></li>
                  <li><Link to="/archive" className="hover:text-loch transition-colors">Archive</Link></li>
                  <li><Link to="/about" className="hover:text-loch transition-colors">About</Link></li>
                  <li><Link to="/contact" className="hover:text-loch transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-serif font-bold mb-4">Connect</h5>
                <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400 font-light">
                  <li><a href="/rss.xml" className="hover:text-loch transition-colors flex items-center gap-2"><Rss size={14} /> RSS Feed</a></li>
                  <li><a href="#" className="hover:text-loch transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-loch transition-colors">Twitter</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-xs text-zinc-400 flex flex-col md:flex-row gap-4 md:gap-6">
                <span>© {new Date().getFullYear()} RuggedScot.com. Stay rugged, stay vigilant. 🏴󠁧󠁢󠁳󠁣󠁴󠁿</span>
                <span className="flex items-center gap-2">
                  Built with 
                  <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="hover:text-loch transition-colors">React</a>
                  <span className="text-zinc-500">+</span>
                  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="hover:text-loch transition-colors">Vite</a>
                  <span className="text-zinc-500">•</span>
                  Written in 
                  <a href="https://www.markdownguide.org" target="_blank" rel="noopener noreferrer" className="hover:text-loch transition-colors">Markdown</a>
                </span>
              </div>
              <div className="flex gap-6 text-xs text-zinc-400">
                <Link to="/" className="hover:text-loch transition-colors">Home</Link>
                <Link to="/blog" className="hover:text-loch transition-colors">Blog</Link>
                <Link to="/archive" className="hover:text-loch transition-colors">Archive</Link>
              </div>
            </div>
          </div>
        </footer>
        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 z-50 p-3 bg-loch text-white rounded-full shadow-lg shadow-loch/30 hover:bg-loch/90 transition-all hover:scale-110",
            showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      </div>
    </PostContext.Provider>
  );
}
