import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface ScottishWord {
  word: string;
  meaning: string;
  example?: string;
  category: string;
}

const scottishWords: ScottishWord[] = [
  // Common Words
  { word: "Wee", meaning: "Small", example: "I'll just have a wee look.", category: "Common" },
  { word: "Braw", meaning: "Brilliant / great", example: "That's a braw view from up here.", category: "Common" },
  { word: "Blether", meaning: "A long chat", example: "We stood having a blether for ages.", category: "Common" },
  { word: "Messages", meaning: "Groceries or shopping", example: "I'm away for the messages.", category: "Common" },
  { word: "Scran", meaning: "Food", example: "That was some good scran.", category: "Common" },
  { word: "Gallus", meaning: "Bold, cheeky, confident", example: "He's a gallus wee lad.", category: "Common" },
  { word: "Dreich", meaning: "Miserable, dull weather", example: "It's a dreich day the day.", category: "Common" },
  { word: "Numpty", meaning: "Fool / idiot", example: "You absolute numpty.", category: "Common" },
  { word: "Bampot", meaning: "Crazy person", example: "That guy's a total bampot.", category: "Common" },
  { word: "Outwith", meaning: "Outside of", example: "That's outwith my control.", category: "Common" },
  
  // Everyday Words
  { word: "Aye", meaning: "Yes", category: "Everyday" },
  { word: "Naw", meaning: "No", category: "Everyday" },
  { word: "Ken", meaning: "Know", example: "D'ye ken what I mean?", category: "Everyday" },
  { word: "Bairn", meaning: "Child", category: "Everyday" },
  { word: "Wean", meaning: "Child (wee one)", category: "Everyday" },
  { word: "Lass", meaning: "Girl", category: "Everyday" },
  { word: "Lad", meaning: "Boy", category: "Everyday" },
  { word: "Pure", meaning: "Very / extremely", example: "That's pure brilliant.", category: "Everyday" },
  { word: "Dead", meaning: "Very", example: "That's dead funny.", category: "Everyday" },
  { word: "Awrite", meaning: "Alright / hello", example: "Awrite, ya wee dick?", category: "Everyday" },
  
  // Food Words
  { word: "Piece", meaning: "Sandwich", example: "I'm going to make a piece for lunch.", category: "Food" },
  { word: "Tattie", meaning: "Potato", category: "Food" },
  { word: "Neeps", meaning: "Turnips", category: "Food" },
  { word: "Stovies", meaning: "Traditional potato dish", category: "Food" },
  { word: "Roll and sausage", meaning: "A breakfast classic in Scotland", category: "Food" },
  { word: "Grub", meaning: "Food", category: "Food" },
  
  // Insults
  { word: "Eejit", meaning: "Idiot", category: "Insults" },
  { word: "Tube", meaning: "Idiot", category: "Insults" },
  { word: "Rocket", meaning: "Mad person", category: "Insults" },
  { word: "Fanny", meaning: "Idiot (Scottish meaning)", example: "Uch, he's just a fanny.", category: "Insults" },
  { word: "Dobber", meaning: "Annoying idiot", category: "Insults" },
  { word: "Walloper", meaning: "Someone acting like a fool", category: "Insults" },
  { word: "Tit", meaning: "Idiot", example: "He's a pure tit.", category: "Insults" },
  { word: "Dick", meaning: "Idiot (casual)", example: "He's a right dick.", category: "Insults" },
  { word: "Bawbag", meaning: "Idiot / scrotum (playful insult)", category: "Insults" },
  
  // Random Words
  { word: "Skint", meaning: "Broke / no money", category: "Random" },
  { word: "Chancer", meaning: "Someone pushing their luck", category: "Random" },
  { word: "Minging", meaning: "Disgusting", category: "Random" },
  { word: "Stoater", meaning: "Something impressive", example: "That goal was a stoater.", category: "Random" },
  { word: "Glaikit", meaning: "Stupid looking", category: "Random" },
  { word: "Scunnered", meaning: "Fed up / disgusted", category: "Random" },
  { word: "Greet", meaning: "Cry", category: "Random" },
  { word: "Haver", meaning: "Talk nonsense", category: "Random" },
  { word: "Fanny baws", meaning: "Playful insult among friends", category: "Random" },
  
  // Weather Words
  { word: "Dreich", meaning: "Cold, grey miserable weather", category: "Weather" },
  { word: "Baltic", meaning: "Freezing cold", example: "It's fucking baltic out the day.", category: "Weather" },
  { word: "Blawin a hoolie", meaning: "Very windy", category: "Weather" },
  
  // Slang Expressions
  { word: "Aff his tits", meaning: "High on drugs", example: "He's aff his tits.", category: "Slang" },
  { word: "A pure tit", meaning: "Being a complete idiot", example: "He's a pure tit.", category: "Slang" },
  { word: "Ya wee dick", meaning: "Casual greeting among friends", example: "Awrite, ya wee dick?", category: "Slang" },
  { word: "Och / Uch", meaning: "Expression of frustration or dismissal", example: "Uch, away ye go.", category: "Slang" },
];

const categories = ["All", "Common", "Everyday", "Food", "Insults", "Random", "Weather", "Slang"];

export default function TheLingoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredWords = scottishWords.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <Helmet>
        <title>The Lingo | Scottish Words & Phrases | RuggedScot</title>
        <meta name="description" content="Awrite ya wee fannies! Learn Scottish slang and phrases. From 'Pure pishing doon' to 'Taps aff weather', master the Scottish lingo with our comprehensive guide." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Lingo | Scottish Words & Phrases | RuggedScot" />
        <meta property="og:description" content="Awrite ya wee fannies! Learn Scottish slang and phrases. From 'Pure pishing doon' to 'Taps aff weather', master the Scottish lingo with our comprehensive guide." />
        <meta property="og:image" content="https://ruggedscot.com/images/home-hero.png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        <meta property="og:url" content="https://ruggedscot.com/lingo" />
        <meta property="og:site_name" content="RuggedScot" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Lingo | Scottish Words & Phrases | RuggedScot" />
        <meta name="twitter:description" content="Awrite ya wee fannies! Learn Scottish slang and phrases. From 'Pure pishing doon' to 'Taps aff weather', master the Scottish lingo." />
        <meta name="twitter:image" content="https://ruggedscot.com/images/home-hero.png" />
        <meta name="keywords" content="scottish words, scottish slang, scots language, scottish phrases, scotland culture, scottish expressions, scottish lingo, glasgow slang, edinburgh slang, scottish dictionary" />
        <link rel="canonical" href="https://ruggedscot.com/lingo" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "The Lingo - Scottish Words & Phrases",
            "description": "A comprehensive database of Scottish words, phrases, and slang. Learn authentic Scottish expressions and phrases.",
            "url": "https://ruggedscot.com/lingo",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Scottish Words and Phrases",
              "description": "Collection of Scottish slang words and phrases with meanings and examples",
              "numberOfItems": scottishWords.length
            },
            "about": {
              "@type": "Thing",
              "name": "Scottish Language",
              "description": "Scots language and Scottish slang expressions"
            }
          })}
        </script>
      </Helmet>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold italic mb-4">
          The Lingo
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
          Awrite ya wee fannies, so yae want tae learn the Scottish lingo?
          
          Av added some common wurds below fur you tae feast yer eye balls on!
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search words or meanings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-loch outline-none transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Filter size={16} className="text-zinc-400 mr-2 mt-2" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category
                  ? "bg-loch text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-zinc-500 mb-6">
        Showing {filteredWords.length} of {scottishWords.length} words
      </p>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.map((word, index) => (
          <motion.div
            key={word.word}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.02, duration: 0.3 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-serif font-bold text-loch">
                {word.word}
              </h3>
              <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500">
                {word.category}
              </span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 mb-2">
              {word.meaning}
            </p>
            {word.example && (
              <p className="text-sm text-zinc-500 italic">
                Example: "{word.example}"
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No words found matching your search.</p>
        </div>
      )}

      </motion.div>
  );
}
