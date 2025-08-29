import { useEffect, useRef } from 'react';

interface SwipeGestureOptions {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  minSwipeDistance?: number;
  maxStartDistance?: number; // Max distance from edge to start swipe
}

export const useSwipeGesture = (options: SwipeGestureOptions) => {
  const {
    onSwipeRight,
    onSwipeLeft,
    minSwipeDistance = 100,
    maxStartDistance = 50,
  } = options;

  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const isValidSwipe = useRef<boolean>(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;

      // Only allow swipes starting from the left edge
      isValidSwipe.current = touch.clientX <= maxStartDistance;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isValidSwipe.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;

      // Ensure horizontal swipe (not vertical scroll)
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      // Check swipe direction and distance
      if (deltaX > minSwipeDistance && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < -minSwipeDistance && onSwipeLeft) {
        onSwipeLeft();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeRight, onSwipeLeft, minSwipeDistance, maxStartDistance]);
};
