import { useCallback, useEffect, useRef, type RefObject } from 'react';

const CLICK_SUPPRESSION_MS = 400;

interface SwipeGestureOptions {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  minSwipeDistance?: number;
  maxStartDistance?: number; // Max distance from edge to start swipe
  allowSwipeFromAnywhere?: boolean;
  targetRef?: RefObject<HTMLElement | null>;
}

interface SwipeGestureResult {
  shouldSuppressClick: () => boolean;
}

export const useSwipeGesture = (
  options: SwipeGestureOptions,
): SwipeGestureResult => {
  const {
    onSwipeRight,
    onSwipeLeft,
    minSwipeDistance = 100,
    maxStartDistance = 50,
    allowSwipeFromAnywhere = false,
    targetRef,
  } = options;

  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const isValidSwipe = useRef<boolean>(false);
  const swipeEndedAt = useRef<number>(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (targetRef && !targetRef.current?.contains(e.target as Node)) {
        isValidSwipe.current = false;
        return;
      }

      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;

      isValidSwipe.current =
        allowSwipeFromAnywhere || touch.clientX <= maxStartDistance;
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
        swipeEndedAt.current = Date.now();
        onSwipeRight();
      } else if (deltaX < -minSwipeDistance && onSwipeLeft) {
        swipeEndedAt.current = Date.now();
        onSwipeLeft();
      }
    };

    const handleTouchCancel = () => {
      isValidSwipe.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchCancel, {
      passive: true,
    });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [
    allowSwipeFromAnywhere,
    maxStartDistance,
    minSwipeDistance,
    onSwipeLeft,
    onSwipeRight,
    targetRef,
  ]);

  const shouldSuppressClick = useCallback(
    () => Date.now() - swipeEndedAt.current < CLICK_SUPPRESSION_MS,
    [],
  );

  return { shouldSuppressClick };
};
