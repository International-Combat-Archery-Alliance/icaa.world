// Unknown environments (SSR/tests or missing matchMedia) keep the share path available.
export function hasCoarsePointer(): boolean {
  return (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function' ||
    window.matchMedia('(pointer: coarse)').matches
  );
}
