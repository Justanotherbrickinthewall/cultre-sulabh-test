"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onBack: () => void;
}

export function CameraCapture({ onCapture, onBack }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isCaptureProcessing, setIsCaptureProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      stopCamera();
      
      setError(null);
      setIsInitializing(true);
      setIsVideoReady(false);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise<void>((resolve) => {
          if (!videoRef.current) return;
          
          const handleCanPlay = () => {
            if (videoRef.current) {
              videoRef.current.removeEventListener('canplay', handleCanPlay);
              resolve();
            }
          };
          
          videoRef.current.addEventListener('canplay', handleCanPlay);
        });

        await videoRef.current.play();
        setIsVideoReady(true);
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError('Could not access camera. Please check permissions and try again.');
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady || isCaptureProcessing) return;

    try {
      setIsCaptureProcessing(true);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      setIsCaptureProcessing(false);
      onCapture(imageDataUrl);

    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture image. Please try again.');
      setIsCaptureProcessing(false);
    }
  }, [isVideoReady, isCaptureProcessing, onCapture]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Camera Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={startCamera} className="flex-1">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera View */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Loading State */}
        {isInitializing && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-semibold">Starting camera...</p>
              <p className="text-sm opacity-75 mt-2">Please allow camera access when prompted</p>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isCaptureProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-semibold">Processing...</p>
            </div>
          </div>
        )}

        {/* Camera UI */}
        {isVideoReady && !isCaptureProcessing && (
          <>
            {/* Camera Frame Guide */}
            <div className="absolute inset-6 border-2 border-white/30 border-dashed rounded-3xl pointer-events-none">
              <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-white rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-white rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-white rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-white rounded-br-3xl"></div>
            </div>

            {/* Back Button */}
            <button
              onClick={onBack}
              className="absolute top-8 left-8 text-white bg-black/30 hover:bg-black/50 rounded-full p-4 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Capture Button */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center">
              <button
                onClick={handleCapture}
                disabled={!isVideoReady || isCaptureProcessing}
                className="w-20 h-20 rounded-full bg-white border-4 border-white/80 shadow-lg 
                         transform transition-transform active:scale-95 hover:scale-105
                         disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Capture photo"
              >
                <span className="block w-16 h-16 rounded-full bg-white m-auto" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}