const CACHE = 'emoji-world-v3';
const ALLOWED = [
  '/', '/index.html',
  '/styles/style.css',
  '/js/app.js', '/js/fontConverter.js',
  // 필요한 데이터 파일들 추가
  '/data/categories/smileys_emotion.js',
  '/data/categories/people_body.js',
  '/data/categories/professions.js',
  '/data/categories/animals_nature.js',
  '/data/categories/food_drink.js',
  '/data/categories/travel_places.js',
  '/data/categories/activities.js',
  '/data/categories/objects.js',
  '/data/categories/symbols.js',
  '/data/categories/festivals_events.js',
  '/data/categories/flags.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ALLOWED)).catch(() => { })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // http/https 이외, 확장/파일 스킴은 무시
  if (!/^https?:$/.test(url.protocol)) return;

  // 동일 출처만 캐시
  if (url.origin !== self.location.origin) return;

  // GET만 캐시
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(match => {
      if (match) return match;
      return fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => { });
        return res;
      });
    })
  );
});
