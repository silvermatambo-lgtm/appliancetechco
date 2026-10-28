/* Ultra Max 7 Pro Premium — change CACHE_VERSION when deploying a new client version.
   Same-origin static assets are cached; enquiries and external sites are NOT cached. */
const CACHE_VERSION = 'ultramax7pro-appliancetech-v1';
const APP_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const ASSETS = [
  './', './index.html', './about.html', './services.html', './gallery.html',
  './faq.html', './testimonials.html', './contact.html', './offline.html',
  './styles.css', './premium.css', './brand.css', './site-config.js', './script.js',
  './premium.js', './chatbot.js', './pwa.js', './manifest.webmanifest',
  './assets/icon-192.png', './assets/icon-512.png', './assets/icon-maskable.png',
  './assets/icon-180.png', './assets/appliancetech-logo.webp',
  './assets/aircon-install-commercial.webp',
  './assets/aircon-gas-servicing.webp',
  './assets/refrigeration-gas-work.webp',
  './assets/pressure-switch-service.webp',
  './assets/commercial-compressor.webp',
  './assets/display-freezer.webp',
  './assets/residential-aircon.webp',
  './assets/cooling-unit-repairs.webp',
  './assets/appliance-transport.webp',
  './assets/compressor-pipework.webp',
  './assets/outdoor-unit-work.webp'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(APP_CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('ultramax7pro-') && ![APP_CACHE,PAGE_CACHE].includes(k)).map(k=>caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate') {
    event.respondWith(fetch(request).then(response => {
      if(response.ok && response.type==='basic') {
        const copy=response.clone();event.waitUntil(caches.open(PAGE_CACHE).then(cache=>cache.put(request,copy)));
      }
      return response;
    }).catch(async()=> (await caches.match(request)) || (await caches.match('./offline.html'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response=>{
    if(response.ok && response.type==='basic' && !url.pathname.endsWith('sw.js')) {
      const copy=response.clone();event.waitUntil(caches.open(APP_CACHE).then(cache=>cache.put(request,copy)));
    }
    return response;
  })));
});
