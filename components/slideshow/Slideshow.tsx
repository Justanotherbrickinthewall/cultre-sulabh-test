"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image } from '@/types';
import { formatDate } from '@/lib/utils';
import { Pause, Play, SkipForward, SkipBack } from 'lucide-react';

interface SlideshowProps {
  images: Image[];
  category: 'men' | 'women';
}

export function Slideshow({ images, category }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Auto-advance slides every 8 seconds
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

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

  const currentImage = images[currentIndex];

  // Using direct class names instead of dynamic construction
  const getColorClasses = (category: 'men' | 'women') => ({
    primary: category === 'men' ? 'from-blue-600 to-indigo-700' : 'from-purple-600 to-pink-700',
    secondary: category === 'men' ? 'from-blue-900 via-indigo-900 to-purple-900' : 'from-purple-900 via-pink-900 to-rose-900',
    accent: category === 'men' ? 'bg-blue-400' : 'bg-pink-400'
  });

  const colors = getColorClasses(category);

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${colors.secondary} relative overflow-hidden`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {category === 'men' ? "Men&apos;s Gallery" : "Women&apos;s Gallery"}
          </h1>
          <p className="text-xl text-gray-200">
            Creative Expressions from Museum Visitors
          </p>
        </div>
      </div>

      {/* Main Slideshow */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={currentImage.image_url}
                  alt={`Design by ${currentImage.creator_name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Info */}
              <div className={`bg-gradient-to-r ${colors.primary} p-8 text-white`}>
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">
                    Created by {currentImage.creator_name}
                  </h2>
                  <p className="text-lg opacity-90 mb-4">
                    {formatDate(currentImage.created_at)}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm opacity-80">
                    <span>Design {currentIndex + 1} of {images.length}</span>
                    <span>•</span>
                    <span className="capitalize">{category}&apos;s Collection</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? `${colors.accent} scale-125`
                    : 'bg-white bg-opacity-40 hover:bg-opacity-60'
                }`}
              />
            ))}
          </div>
          
          {/* Auto-progress bar */}
          {isPlaying && (
            <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
              <motion.div
                key={currentIndex}
                className={`h-full ${colors.accent} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 8, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-20"
          >
            <div className="flex items-center justify-between px-8">
              <button
                onClick={prevSlide}
                className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button
                onClick={nextSlide}
                className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcut Hint */}
      <div className="absolute top-4 right-4 z-20 text-white text-sm opacity-60">
        <p>Use ← → arrows to navigate • Space to pause</p>
      </div>
    </div>
  );
}
