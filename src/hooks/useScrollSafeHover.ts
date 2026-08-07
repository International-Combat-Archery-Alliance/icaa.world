import { useEffect, useRef } from 'react';

export function useScrollSafeHover(clear: () => void) {
  const isScrolling = useRef(false);
  const pendingClearRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      isScrolling.current = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        isScrolling.current = false;
      }, 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, []);

  const cancelPendingClear = () => {
    if (pendingClearRef.current) {
      window.removeEventListener('mousemove', pendingClearRef.current);
      pendingClearRef.current = null;
    }
  };

  const handleEnter = () => {
    cancelPendingClear();
  };

  const handleLeave = () => {
    if (isScrolling.current) {
      cancelPendingClear();
      const pendingClear = () => {
        window.removeEventListener('mousemove', pendingClear);
        pendingClearRef.current = null;
        clear();
      };
      pendingClearRef.current = pendingClear;
      window.addEventListener('mousemove', pendingClear, { once: true });
    } else {
      clear();
    }
  };

  return { handleEnter, handleLeave };
}
