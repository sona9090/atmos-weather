import { mkdir, writeFile } from 'node:fs/promises';

const workerSource = `const ORIGIN_PLACEHOLDER = '__SITE_ORIGIN__';

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    let response = await env.ASSETS.fetch(request);

    if (
      response.status === 404 &&
      request.method === 'GET' &&
      request.headers.get('accept')?.includes('text/html')
    ) {
      const indexRequest = new Request(new URL('/index.html', requestUrl), request);
      response = await env.ASSETS.fetch(indexRequest);
    }

    if (response.headers.get('content-type')?.includes('text/html')) {
      const html = (await response.text()).replaceAll(ORIGIN_PLACEHOLDER, requestUrl.origin);
      const headers = new Headers(response.headers);
      headers.delete('content-length');
      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};
`;

await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/server/index.js', import.meta.url), workerSource);
