/* Uzair Traders service worker.
   Design/code files (index.html, style.css, app.js) hamesha pehle internet se naye lete hain, is liye unka update foran nazar aata hai.
   Bari files (products.js, images) cache se aati hain taake app tez khule. products.js badlein to neeche v7 ko v8 kar dein. */
const CACHE = "uzair-traders-v7";
const FILES = ["./", "index.html", "style.css", "app.js", "products.js", "manifest.json", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
const FRESH = /(\/|index\.html|style\.css|app\.js|sw\.js)$/;
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => fetch(new Request(f, { cache: "reload" })).then(r => r.ok ? c.put(f, r) : null)))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; /* WhatsApp, tel: aur dusre links ko na chhedein */
  const save = r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; };
  if (e.request.mode === "navigate" || FRESH.test(u.pathname)) {
    e.respondWith(fetch(new Request(e.request, { cache: "reload" })).then(save).catch(() => caches.match(e.request, { ignoreSearch: true }).then(h => h || caches.match("index.html"))));
  } else {
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(save).catch(() => caches.match("index.html"))));
  }
});
