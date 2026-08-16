const base = process.env.PREVIEW_URL || 'http://localhost:3000';
const paths = ['/', '/meetings', '/areas', '/about', '/recovery', '/literature', '/news', '/contact', '/admin', '/blog/meetings/benmore-tuesday-1930-3/'];
const results = [];
for (const path of paths) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual' });
  results.push({ path, status: response.status, contentType: response.headers.get('content-type') });
  if (response.status >= 500) throw new Error(`${path} returned ${response.status}`);
}
const errorResponse = await fetch(`${base}/api/runtime-errors`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'acceptance smoke test', path: '/', timestamp: new Date().toISOString() }) });
if (errorResponse.status !== 204) throw new Error(`runtime error endpoint returned ${errorResponse.status}`);
const report = { base, checkedAt: new Date().toISOString(), routes: results, runtimeErrorEndpoint: errorResponse.status };
console.log(JSON.stringify(report, null, 2));
