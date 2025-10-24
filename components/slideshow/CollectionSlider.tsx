"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Collection } from '@/types';

interface CollectionSliderProps {
  collections: Collection[];
  selectedCollectionId: string | null;
  blockWidth?: number; // width of one collection block on the belt
  metaPlacement?: 'top' | 'bottom';
}

export function CollectionSlider({
  collections,
  selectedCollectionId,
  blockWidth = 672,
  metaPlacement = 'bottom',
}: CollectionSliderProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const prevXRef = useRef(0);
  const [animX, setAnimX] = useState<number | number[]>(0);
  const GAP_PX = 24; // Tailwind gap-6
  const SIDE_PAD = 20; // px-5
  const RIGHT_GAP = 20; // requested right edge gap

  // Compute center x translation for the given index
  const getCenterX = (index: number, containerWidth: number) => {
    const centerOffset = containerWidth / 2 - blockWidth / 2;
    return -(index * blockWidth) + centerOffset;
  };

  useEffect(() => {
    if (!selectedCollectionId || collections.length === 0) return;

    const containerW = windowRef.current?.clientWidth || window.innerWidth;
    const contentW = collections.length * blockWidth + Math.max(0, collections.length - 1) * GAP_PX;
    const leftLimit = 0; // x=0 aligns to left padding already
    const rightLimit = Math.min(0, containerW - SIDE_PAD - RIGHT_GAP - contentW); // respect right padding and 20px gap

    const indexInRow = collections.findIndex(c => c.id === selectedCollectionId);
    if (indexInRow === -1) return; // do nothing if not present

    // Preferred center position for the selected collection
    const blockStart = indexInRow * (blockWidth + GAP_PX);
    const blockCenter = blockStart + blockWidth / 2;
    let targetX = containerW / 2 - blockCenter;

    // Clamp to edges: left align and right align with 20px padding
    targetX = Math.min(leftLimit, Math.max(rightLimit, targetX));

    setAnimX(targetX);
    prevXRef.current = targetX;
  }, [selectedCollectionId, collections, blockWidth]);

  return (
    <div ref={windowRef} className="flex-1 h-full w-full px-5">
      <motion.div
        className="flex items-center gap-6 h-full"
        animate={{ x: animX }}
        transition={{ type: 'tween', duration: 0.8, ease: 'easeInOut' }}
      >
        {collections.map((collection) => {
          const isSelected = selectedCollectionId === collection.id;
          return (
            <div key={collection.id} className="relative flex items-center gap-4" style={{ width: blockWidth }}>
              {collection.images.map((img) => (
                <div key={img.id} className={`w-48 h-48 md:w-[230px] md:h-[230px] rounded-2xl border-8 border-navyblue bg-amber-300 ${
                      isSelected ? 'opacity-100' : 'opacity-40'
                    }`}>
                  <img
                    src={img.image_url}
                    alt={collection.collection_name}
                    className="w-full h-full object-cover transition-opacity duration-300 rounded-lg"
                  />
                </div>
              ))}
              {isSelected && (
                <div
                  className="absolute left-0 pointer-events-none select-none"
                  style={ metaPlacement === 'top' ? { bottom: 'calc(100% + 12px)' } : { top: 'calc(100% + 12px)' } }
                >
                  <div className="text-navyblue">
                    <div className="text-[44px] leading-none italic font-black" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>{collection.collection_name}</div>
                    <div className="mt-2 flex items-center gap-4 text-2xl font-semibold">
                      <span>by {collection.creator_name}</span>
                      {collection.location ? (
                        <span className="flex items-center gap-2">
                          <MapPin size={24} className="text-navyblue" />
                          {collection.location}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}


