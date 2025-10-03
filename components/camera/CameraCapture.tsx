"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RotateCcw, ArrowLeft, AlertCircle } from 'lucide-react';

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
      // Stop any existing stream first
      stopCamera();
      
      setError(null);
      setIsInitializing(true);
      setIsVideoReady(false);

      // Request camera access with specified constraints
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
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

  // Initialize camera on mount and cleanup on unmount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Handle camera switch
  const handleSwitchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  // Handle capture
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

      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current frame to canvas
      context.drawImage(video, 0, 0);

      // Get the image data
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      // Clear processing state and notify parent
      setIsCaptureProcessing(false);
      onCapture(imageDataUrl);

    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture image. Please try again.');
      setIsCaptureProcessing(false);
    }
  }, [isVideoReady, isCaptureProcessing, onCapture]);

  // Render error state
  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center py-8">
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-0">
        <div className="relative bg-black rounded-lg overflow-hidden">
          {/* Camera Viewfinder */}
          <video
            ref={videoRef}
            className="w-full h-auto"
            playsInline
            muted
            style={{ maxHeight: '70vh' }}
          />

          {/* Loading State */}
          {isInitializing && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-white text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-semibold">Starting camera...</p>
                <p className="text-sm opacity-75 mt-2">Please allow camera access when prompted</p>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isCaptureProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-lg font-semibold">Processing...</p>
              </div>
            </div>
          )}

          {/* Camera Guide */}
          {isVideoReady && !isCaptureProcessing && (
            <>
              <div className="absolute inset-4 border-2 border-white border-dashed opacity-50 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white"></div>
              </div>

              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm">
                  Position your drawing within the guides and ensure good lighting
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  disabled={isCaptureProcessing}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={handleCapture}
                  disabled={!isVideoReady || isCaptureProcessing}
                  className="bg-white text-black hover:bg-gray-100 px-8 py-3"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {isCaptureProcessing ? 'Processing...' : 'Capture'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwitchCamera}
                  disabled={isCaptureProcessing}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}