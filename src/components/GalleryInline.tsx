import React from 'react';
import { motion } from 'motion/react';
import Gallery from './Gallery';

interface GalleryInlineProps {
  photos: string[];
  title?: string;
}

export default function GalleryInline({ photos, title }: GalleryInlineProps) {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="my-8 overflow-hidden w-full">
      {title && (
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-4">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => window.open(photo, '_blank')}
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/20 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
