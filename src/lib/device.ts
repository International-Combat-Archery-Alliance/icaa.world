export function hasCoarsePointer(): boolean {
  return (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function' ||
    window.matchMedia('(pointer: coarse)').matches
  );
}
