// 서비스 워커 - 오프라인 지원
const CACHE_NAME = 'emoji-world-v1.0.1'; // 캐시 버전 업데이트 권장
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/js/app.js',
  // 아래 경로를 수정합니다.
  '/src/data/emoji-data.js', // '/src/data/emojiDataExtended.js' 에서 변경
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: All files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// 페치 이벤트 - 네트워크 우선, 캐시 폴백 전략
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 네트워크에서 성공적으로 가져온 경우
        if (response.status === 200) {
          // 응답 복사본을 캐시에 저장
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 찾기
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // 캐시에도 없으면 오프라인 페이지 반환
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }

            // 기타 요청은 네트워크 오류 반환
            return new Response('오프라인 상태입니다', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});