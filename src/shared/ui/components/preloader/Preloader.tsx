'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import Lottie from 'lottie-react';

export const Preloader: React.FC = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Load Lottie animation data immediately
    fetch('/preloader.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load preloader animation:', err));
  }, []);

  useEffect(() => {
    // Reset preloader state on pathname change (async to avoid cascading renders)
    const resetTimer = setTimeout(() => {
      setIsLoading(true);
      setIsVisible(true);
    }, 0);

    // Hide preloader when page is loaded
    const hidePreloader = () => {
      setIsLoading(false);
      setTimeout(() => setIsVisible(false), 200);
    };

    // Check if page is already loaded
    if (typeof window !== 'undefined' && document.readyState === 'complete') {
      // Page already loaded, hide preloader after minimum display time
      const timer = setTimeout(hidePreloader, 3000);
      return () => {
        clearTimeout(resetTimer);
        clearTimeout(timer);
      };
    }

    // Wait for page load event
    const handleLoad = () => {
      setTimeout(hidePreloader, 1000);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(resetTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', handleLoad);
      }
    };
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        color: '#ffffff',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.5s ease',
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {animationData && (
        <Lottie
          animationData={animationData}
          style={{ width: 400, height: 'auto', maxWidth: '50%' }}
          loop={true}
          autoplay={true}
        />
      )}
    </div>
  );
};
