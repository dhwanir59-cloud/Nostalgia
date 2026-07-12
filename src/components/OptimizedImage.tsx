/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, RotateCcw } from "lucide-react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackText?: string;
  className?: string;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackText = "Memory Image Unavailable",
  className = "",
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
    setLoading(true);
    setRetryCount(0);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setCurrentSrc(`${src}?retry=${retryCount + 1}`);
      }, 1000); // Wait 1s before auto-retrying
    } else {
      setLoading(false);
      setError(true);
    }
  };

  const handleRetryManual = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    setError(false);
    setRetryCount(0);
    setCurrentSrc(`${src}?manual_retry=${Date.now()}`);
  };

  return (
    <div className={`relative overflow-hidden bg-[#FEE4CC]/40 rounded-2xl ${className}`}>
      {/* Skeleton / Pixel Loading Placeholder */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-orange-50 to-orange-100/60 animate-pulse">
          <div className="w-10 h-10 border-4 border-dashed border-[#FF6B35] rounded-full animate-spin mb-2"></div>
          <p className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-widest font-mono">Loading Memory...</p>
        </div>
      )}

      {/* Error / Fallback Card */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-orange-50 text-center border-2 border-dashed border-[#FF6B35]/40 rounded-2xl">
          <ImageIcon className="w-8 h-8 text-[#FF6B35]/60 mb-2" />
          <p className="text-xs font-black text-[#2D2D2D] leading-tight mb-1">{fallbackText}</p>
          <p className="text-[9px] text-[#FF6B35] uppercase font-mono font-bold mb-3">Connection Interrupted</p>
          <button
            onClick={handleRetryManual}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#FF6B35] text-white rounded-lg font-bold text-[10px] hover:bg-[#ff6b35]/90 transition-all shadow-sm"
          >
            <RotateCcw className="w-3 h-3" />
            RELOAD MEMORY
          </button>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-all duration-500 ease-out object-cover w-full h-full ${
            loading ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
          }`}
          {...props}
        />
      )}
    </div>
  );
}
