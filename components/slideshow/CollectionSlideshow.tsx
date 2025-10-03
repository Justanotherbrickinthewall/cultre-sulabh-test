"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collection } from '@/types';
import { Heart } from 'lucide-react';

interface CollectionSlideshowProps {
  collections: Collection[];
}

export function CollectionSlideshow({ collections }: CollectionSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance slides every 10 seconds
  useEffect(() => {
    if (!isPlaying || collections.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % collections.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlaying, collections.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % collections.length);
  }, [collections.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length);
  }, [collections.length]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide]);

  const currentCollection = collections[currentIndex];

  // Get category display name
  const getCategoryDisplay = (category: 'men' | 'women' | 'others', customName?: string) => {
    if (category === 'others' && customName) {
      return customName;
    }
    return category === 'men' ? 'Men' : category === 'women' ? 'Women' : 'Others';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 relative overflow-hidden">
      {/* Animated background pattern - quirky circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-yellow-400 opacity-20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-blue-400 opacity-20 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 1000 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -1000 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full max-w-7xl"
          >
            {/* Collection Header */}
            <div className="text-center mb-12">
              <motion.h1 
                className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl"
                style={{
                  textShadow: '4px 4px 0px rgba(0,0,0,0.3)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {currentCollection.collection_name}
              </motion.h1>
              <motion.h6 
                className="text-3xl md:text-4xl text-yellow-200 font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                by {currentCollection.creator_name}
              </motion.h6>
            </div>

            {/* Images Grid */}
            <div className="flex flex-row gap-8 justify-center items-start flex-wrap">
              {currentCollection.images.map((image, idx) => (
                <motion.div
                  key={image.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 50, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + idx * 0.2 }}
                >
                  {/* Image Container with quirky border */}
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative bg-white rounded-2xl p-3 shadow-2xl transform hover:scale-105 transition duration-300">
                      <div className="w-72 h-72 md:w-80 md:h-80 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={image.image_url}
                          alt={`Design ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Label - quirky bubble */}
                  <motion.div
                    className="mt-4 bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold text-xl shadow-lg"
                    style={{
                      textShadow: '1px 1px 0px rgba(255,255,255,0.5)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + idx * 0.2, type: "spring", stiffness: 200 }}
                  >
                    {getCategoryDisplay(image.category, image.custom_category_name)}
                  </motion.div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer - Always visible at bottom right */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-sm md:text-base text-white/70 font-medium flex items-center gap-2">
            Crafted with <Heart className="fill-red-400 text-red-400" size={16} /> by Cultre
          </p>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-3">
          {collections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-12 h-4 bg-yellow-400 shadow-lg'
                  : 'w-4 h-4 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Collection Counter */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
          <p className="text-xl text-white font-bold">
            {currentIndex + 1} / {collections.length}
          </p>
        </div>
      </div>
    </div>
  );
}

