/* Uzair Traders service worker.
   Site ko update karne par neeche wala version number badal dein (v1 -> v2) taake purane users ko naya version mile. */
const CACHE = "uzair-traders-v5";
const FILES = ["./", "index.html", "style.css", "app.js", "products.js", "manifest.json", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; /* WhatsApp, tel: aur dusre links ko na chhedein */
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match("index.html"))));
});
