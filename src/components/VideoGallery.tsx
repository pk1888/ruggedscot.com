import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface VideoGalleryProps {
  videos: string[];
  photos: string[];
  title?: string;
}

export default function VideoGallery({ videos, photos, title }: VideoGalleryProps) {
  const allMedia = [...videos, ...photos];

  if (allMedia.length === 0) return null;

  const openInNewTab = (media: string) => {
    window.open(media, '_blank');
  };

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {allMedia.map((media, index) => {
          const mediaIsVideo = videos.includes(media);
          const mediaIndex = mediaIsVideo ? videos.indexOf(media) : photos.indexOf(media);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openInNewTab(media)}
            >
              {mediaIsVideo ? (
                <>
                  <video
                    src={media}
                    poster="/images/blogs/ben-nevis/ben-nevis-1.jpg"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play size={20} className="text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    VIDEO
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={media}
                    alt={`Gallery photo ${mediaIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
