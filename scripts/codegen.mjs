import { register } from 'node:module';

register('./typescript6-loader.mjs', import.meta.url);

const { createClient } = await import('@hey-api/openapi-ts');

const apis = [
  'events',
  'login',
  'assets',
  'donations',
  'articles',
  'mailing-list',
  'voting',
];

for (const api of apis) {
  await createClient({
    input: `https://api.icaa.world/${api}/openapi.json`,
    output: {
      path: `./src/api/${api}`,
      clean: true,
    },
    // Splitting schemas into read/write variants drops free-form object
    // properties (for example an article's Editor.js `content`).
    parser: { transforms: { readWrite: false } },
    plugins: [
      '@hey-api/client-fetch',
      '@hey-api/typescript',
      '@hey-api/sdk',
      '@tanstack/react-query',
    ],
  });
}
