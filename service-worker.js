const CACHE_NAME='awampanggangwe-cache-v1';
const ASSETS_TO_CACHE=['./','./awampanggangwe.html','./manifest.json'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS_TO_CACHE)));
 self.skipWaiting();
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>{if(k!==CACHE_NAME) return caches.delete(k);}))));
 self.clients.claim();
});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET') return;
 e.respondWith(
  caches.match(e.request).then(cached=>{
    if(cached) return cached;
    return fetch(e.request).then(r=>{
      if(r && r.status===200 && e.request.url.startsWith(self.location.origin)){
        const rc=r.clone();
        caches.open(CACHE_NAME).then(c=>c.put(e.request,rc));
      }
      return r;
    });
  })
 );
});
