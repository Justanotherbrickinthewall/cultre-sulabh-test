"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { CollectionSlider } from './CollectionSlider';
import { Collection } from '@/types';
import { Heart } from 'lucide-react';

interface CollectionSlideshowProps {
  collections: Collection[];
}

export function CollectionSlideshow({ collections }: CollectionSlideshowProps) {
  // Randomly distribute collections
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const CYCLE_DURATION_MS = 5000;
  const [cycleStartMs, setCycleStartMs] = useState<number>(Date.now());
  const rotationTimeoutRef = useRef<number | null>(null);

  // Compute block width per collection dynamically to fit 3 tiles (including borders and inner gaps)
  // Tile sizes after 1.2x: base 192px, md 230px; border 8px; inner gap 16px; 3 tiles per block
  const TILE_SM = 192; // w-48
  const TILE_MD = 230; // md:w-[230px]
  const BORDER_PX = 8; // border-8
  const INNER_GAP = 16; // gap-4 inside a block
  const TILES_PER_BLOCK = 3;

  const calcBlockWidth = (tile: number) =>
    TILES_PER_BLOCK * (tile + 2 * BORDER_PX) + (TILES_PER_BLOCK - 1) * INNER_GAP; // includes borders + inner gaps

  const getViewportBlockWidth = () => {
    if (typeof window === 'undefined') return calcBlockWidth(TILE_MD);
    const isMd = window.matchMedia('(min-width: 768px)').matches;
    return calcBlockWidth(isMd ? TILE_MD : TILE_SM);
  };

  const [blockWidth, setBlockWidth] = useState<number>(getViewportBlockWidth());

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setBlockWidth(getViewportBlockWidth());
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Helper to rotate selection
  const rotateSelection = () => {
    if (collections.length === 0) return;
    const pool = selectedCollectionId
      ? collections.filter((c) => c.id !== selectedCollectionId)
      : collections;
    const source = pool.length > 0 ? pool : collections;
    const random = source[Math.floor(Math.random() * source.length)];
    setSelectedCollectionId(random.id);
    setCycleStartMs(Date.now());
  };

  // Initialize selected collection once data is ready
  useEffect(() => {
    if (collections.length > 0 && !selectedCollectionId) {
      rotateSelection();
    }
  }, [collections, selectedCollectionId]);

  // Schedule next rotation aligned to the cycle start
  useEffect(() => {
    if (rotationTimeoutRef.current) {
      clearTimeout(rotationTimeoutRef.current);
    }
    if (!selectedCollectionId || collections.length === 0) return;
    rotationTimeoutRef.current = window.setTimeout(() => {
      rotateSelection();
    }, CYCLE_DURATION_MS);
    return () => {
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
    };
  }, [selectedCollectionId, collections]);

  // Progress ring isolated to avoid re-rendering the whole slideshow
  function ProgressRing({ durationMs, startMs }: { durationMs: number; startMs: number }) {
    const [progress, setProgress] = useState(0);
    const startRef = useRef<number>(startMs);

    useEffect(() => {
      startRef.current = startMs;
      setProgress(0);
    }, [startMs]);

    useEffect(() => {
      const tick = setInterval(() => {
        const elapsed = Date.now() - startRef.current;
        const pct = Math.max(0, Math.min(1, elapsed / durationMs));
        setProgress(pct);
      }, 50);
      return () => clearInterval(tick);
    }, [durationMs]);

    return (
      <div className="fixed top-4 right-4 z-30">
        <div className="relative w-10 h-10">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#d79828 ${progress * 360}deg, rgba(0,0,0,0.2) 0deg)`,
            }}
          />
          <div className="absolute inset-2 rounded-full" />
        </div>
      </div>
    );
  }

  // Split into two columns dynamically: 0..half and half..end
  const {topCollections, bottomCollections} = useMemo(() => {
    const half = Math.floor(collections.length / 2);
    const top = collections.slice(0, half);
    const bottom = collections.slice(half);
    return { topCollections: top, bottomCollections: bottom };
  }, [collections]);


  if (collections.length === 0) {
    return null;
  }

  return (
    <div className="h-screen bg-amber overflow-hidden relative">
      {/* 3 vertical sections: 15% / 70% / 15% */}
      <div className="relative z-10 h-full flex flex-col overflow-hidden">

        {/* Slot Section (70%) */}
        <div className="h-[100vh] px-6 flex flex-col gap-6 items-center pt-[20vh] pb-[20vh]">
          {/* Top row - moves left */}
          <CollectionSlider
            collections={topCollections}
            selectedCollectionId={selectedCollectionId}
            blockWidth={blockWidth}
            metaPlacement="top"
          />

          {/* Bottom row - moves right */}
          <CollectionSlider
            collections={bottomCollections}
            selectedCollectionId={selectedCollectionId}
            blockWidth={blockWidth}
            metaPlacement="bottom"
          />
        </div>
      </div>



      {/* Footer - Crafted by Cultre */}
      <div className="fixed bottom-4 right-4 z-30">
        <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm text-white font-medium flex items-center gap-2">
            Crafted with <Heart className="fill-red-400 text-red-400" size={14} /> by Cultre
          </p>
        </div>
      </div>

      {/* Progress Marker (top-right) */}
      <ProgressRing durationMs={CYCLE_DURATION_MS} startMs={cycleStartMs} />
    </div>
  );
}

