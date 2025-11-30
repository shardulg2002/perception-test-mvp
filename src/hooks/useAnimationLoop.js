import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to manage animation loop using requestAnimationFrame
 * @param {Function} callback - Function to call on each frame
 * @param {boolean} isRunning - Whether the animation should be running
 */
export function useAnimationLoop(callback, isRunning) {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    if (!isRunning) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }

    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        callback(time);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, isRunning]);
}

/**
 * Custom hook to generate a unique session ID
 * @returns {string} - Unique session ID
 */
export function useSessionId() {
  const [sessionId] = useState(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  return sessionId;
}

/**
 * Custom hook to get client information
 * @returns {Object} - Client information object
 */
export function useClientInfo() {
  const [clientInfo] = useState(() => {
    return {
      ua: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      platform: navigator.platform,
      language: navigator.language
    };
  });

  return clientInfo;
}
