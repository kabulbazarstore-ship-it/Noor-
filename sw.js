// ============================================================
// NOOR | نور
// Service Worker - Offline First
// Version: 3
// ============================================================

const CACHE_NAME = 'noor-v3';

const APP_FILES = [
  // =========================
  // صفحات اصلی
  // =========================
  './',
  './index.html',
  './view.html',
  './list.html',
  './doa.html',
  './quran.html',
  './ziyarat.html',
  './hadith.html',
  './imam.html',
  './sahifeh.html',
  './taqibat.html',
  './monajat.html',
  './zekr.html',
  './amal.html',
  './favorite.html',

  // =========================
  // آرامش و دعاها
  // =========================
  './aramesh.html',
  './sobh.html',
  './shab.html',
  './faraj.html',
  './farag.html',
  './hajat.html',
  './hajat-short.html',
  './hajat-tawakkul.html',
  './tavakol.html',
  './tavassol.html',
  './tavassol-zaman.html',
  './estegatheh-zaman.html',
  './dafe-bala.html',
  './goshayesh.html',
  './rizgh.html',
  './shokr.html',
  './aman.html',
  './adil.html',
  './sokan.html',
  './moghatel.html',
  './yastashir.html',
  './arrafni.html',
  './salamati-zaman.html',

  // =========================
  // دعاهای معروف
  // =========================
  './ahd.html',
  './kumayl.html',
  './nudbah.html',
  './iftitah.html',
  './abu-hamza.html',
  './mujir.html',
  './Joushan-kabir.html',
  './joushan-saghir.html',
  './makarim.html',
  './samat.html',
  './samaat.html',

  // =========================
  // رجب
  // =========================
  './aamal-rajab.html',
  './omreh-rajab.html',
  './istighfar-rajab.html',
  './rajab-dua.html',

  // =========================
  // شعبان
  // =========================
  './aamal-shaban.html',
  './shaban-dua.html',
  './shabaniyeh.html',
  './munajat-shabaniyeh.html',
  './nimah-shaban.html',

  // =========================
  // رمضان
  // =========================
  './ramadan.html',

  // =========================
  // ایام هفته
  // =========================
  './yekshanbeh.html',
  './doshanbeh.html',
  './seshanbeh.html',
  './chaharshanbeh.html',
  './panjshanbeh.html',
  './jomeh.html',
  './shanbeh.html',

  // =========================
  // تقویم
  // =========================
  './calendar.html',
  './calendaar.html',
  './tahvil.html',

  // =========================
  // سایر صفحات
  // =========================
  './Joushan-kabir.html',
  './iftitah.html',
  './joushan-saghir.html',
  './mujir.html',
  './samaat.html',
  './samat.html',
  './sajjadieh7.html',

  // =========================
  // فایل‌های اصلی
  // =========================
  './manifest.json',
  './style.css',
  './icon.svg',

  // =========================
  // هسته نور
  // =========================
  './core/noor-unified.js',

  // =========================
  // بانک‌های اطلاعاتی
  // هیچ فایل data حذف نشده
  // =========================
  './data/azkar.js',
  './data/calendar.js',
  './data/duas.js',
  './data/events.js',
  './data/hadith.js',
  './data/imam-zaman.js',
  './data/munajat.js',
  './data/quran.js',
  './data/sahife.js',
  './data/speeches.js',
  './data/taqibat.js',
  './data/verses.js',
  './data/ziyarat.js',

  // =========================
  // قرآن محلی
  // =========================
  './quran.json',

  // =========================
  // فایل‌های صوتی موجود
  // =========================
  './sobhdel.mp3',
  './moazzenzadeh.mp3',

  // =========================
  // آیکن‌های PWA
  // =========================
  './assets/icon-72.png',
  './assets/icon-192.png',
  './assets/icon-512.png'
];


// ============================================================
// INSTALL
// ============================================================

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {

        console.log(
          'NOOR: شروع ذخیره فایل‌های آفلاین...'
        );

        /*
         * فایل‌ها یکی‌یکی ذخیره می‌شوند.
         * اگر یک فایل مشکل داشته باشد،
         * نصب کل Service Worker خراب نمی‌شود.
         */

        for (const file of APP_FILES) {
          try {
            const response = await fetch(
              new Request(file, {
                cache: 'no-store'
              })
            );

            if (response.ok) {
              await cache.put(file, response.clone());
              console.log('✓ Cache:', file);
            } else {
              console.warn(
                '✗ فایل پیدا نشد:',
                file,
                response.status
              );
            }

          } catch (error) {
            console.warn(
              '✗ ذخیره نشد:',
              file
            );
          }
        }

        console.log(
          'NOOR: ذخیره آفلاین پایان یافت.'
        );
      })
      .then(() => self.skipWaiting())
  );
});


// ============================================================
// ACTIVATE
// ============================================================

self.addEventListener('activate', event => {

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {

        return Promise.all(
          cacheNames.map(cacheName => {

            if (cacheName !== CACHE_NAME) {

              console.log(
                'NOOR: حذف Cache قدیمی:',
                cacheName
              );

              return caches.delete(cacheName);
            }

            return null;
          })
        );
      })
      .then(() => self.clients.claim())
  );
});


// ============================================================
// FETCH
// ============================================================

self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') {
    return;
  }

  const request = event.request;
  const url = new URL(request.url);

  // ==========================================================
  // منابع خارجی
  // ==========================================================

  if (url.origin !== self.location.origin) {

    /*
     * منابع خارجی مثل Google Fonts:
     * اگر قبلاً Cache شده باشند → از Cache
     * اگر Cache نباشند → اینترنت
     * اگر اینترنت نباشد → همان Cache قبلی
     */

    event.respondWith(
      caches.match(request)
        .then(cached => {

          if (cached) {
            return cached;
          }

          return fetch(request)
            .then(response => {

              if (
                response &&
                (
                  response.status === 200 ||
                  response.type === 'opaque'
                )
              ) {

                const copy = response.clone();

                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(request, copy);
                  });
              }

              return response;
            })
            .catch(() => {

              return new Response(
                '',
                {
                  status: 503,
                  statusText: 'Offline'
                }
              );
            });
        })
    );

    return;
  }


  // ==========================================================
  // فایل‌های خود برنامه
  // Cache First
  // ==========================================================

  event.respondWith(

    caches.match(request)
      .then(cachedResponse => {

        if (cachedResponse) {

          /*
           * اول نسخه آفلاین را تحویل می‌دهیم.
           * بنابراین برنامه حتی بدون اینترنت باز می‌شود.
           */

          return cachedResponse;
        }


        // اگر Cache نبود، از شبکه بگیر
        return fetch(request)
          .then(networkResponse => {

            if (
              networkResponse &&
              networkResponse.ok
            ) {

              const copy =
                networkResponse.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, copy);
                });
            }

            return networkResponse;
          })
          .catch(() => {

            /*
             * اگر صفحه HTML بود و اینترنت هم نبود،
             * صفحه اصلی نور نمایش داده می‌شود.
             */

            if (
              request.destination === 'document'
            ) {

              return caches.match(
                './index.html'
              );
            }

            return new Response(
              '',
              {
                status: 503,
                statusText: 'Offline'
              }
            );
          });
      })
  );
});


// ============================================================
// MESSAGE
// ============================================================

self.addEventListener('message', event => {

  if (
    event.data &&
    event.data.type === 'SKIP_WAITING'
  ) {

    self.skipWaiting();
  }
});


// ============================================================
// READY
// ============================================================

console.log(
  'NOOR Service Worker v3 فعال شد.'
);