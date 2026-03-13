import React from 'react';
import { motion } from 'motion/react';

interface GalleryProps {
  photos: string[];
  title?: string;
}

export default function Gallery({ photos, title }: GalleryProps) {
  if (!photos || photos.length === 0) return null;

  const openInNewTab = (photo: string) => {
    window.open(photo, '_blank');
  };

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openInNewTab(photo)}
          >
            <img
              src={photo}
              alt={`Gallery photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
