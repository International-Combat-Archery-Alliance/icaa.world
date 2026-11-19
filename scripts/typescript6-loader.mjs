// @hey-api/openapi-ts still uses the TypeScript compiler's classic JS API,
// which TypeScript 7 no longer ships. Redirect its `typescript` imports to the
// official TypeScript 6 compatibility package so codegen can run alongside the
// app's TypeScript 7 toolchain.
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'typescript') {
    return nextResolve('@typescript/typescript6', context);
  }

  return nextResolve(specifier, context);
}
