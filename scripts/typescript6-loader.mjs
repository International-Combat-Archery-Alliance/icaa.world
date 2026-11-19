// @hey-api/openapi-ts uses the TypeScript classic JS API, which TypeScript 7
// no longer ships; redirect its imports to the TypeScript 6 compat package.
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'typescript') {
    return nextResolve('@typescript/typescript6', context);
  }

  return nextResolve(specifier, context);
}
