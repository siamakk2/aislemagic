/* AisleBird Service Worker — self-destruct + always-fresh.
   Clears all caches, unregisters, and reloads so no device is ever stuck on old code. */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){
      return self.registration.unregister();
    }).then(function(){
      return self.clients.matchAll();
    }).then(function(clients){
      clients.forEach(function(c){ try{ c.navigate(c.url); }catch(e){} });
    })
  );
});
/* No fetch handler — every request goes straight to the network, always fresh. */
