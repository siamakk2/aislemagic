/* AisleBird Service Worker — network-first so updates ship instantly */
var CACHE = 'aislebird-v4';
var SHELL = ['/app', '/app/'];

self.addEventListener('install', function(e){
  // Activate the new service worker immediately, don't wait
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(SHELL).catch(function(){}); }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      // Delete every old cache version
      return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var url = new URL(e.request.url);

  // Never intercept Supabase, analytics, or CDN calls — always go to network
  if(url.hostname.indexOf('supabase.co')!==-1 ||
     url.hostname.indexOf('googleapis.com')!==-1 ||
     url.hostname.indexOf('jsdelivr.net')!==-1 ||
     url.hostname.indexOf('vercel-analytics.com')!==-1 ||
     url.hostname.indexOf('googletagmanager.com')!==-1){
    return;
  }

  // App shell — NETWORK-FIRST: always try to get the latest app, fall back to cache only when offline
  if(url.pathname === '/app' || url.pathname === '/app/'){
    e.respondWith(
      fetch(e.request).then(function(resp){
        if(resp && resp.status===200){
          var clone = resp.clone();
          caches.open(CACHE).then(function(c){ c.put('/app', clone); });
        }
        return resp;
      }).catch(function(){
        return caches.open(CACHE).then(function(c){ return c.match('/app'); });
      })
    );
    return;
  }

  // Everything else — network with cache fallback
  e.respondWith(
    fetch(e.request).then(function(resp){
      if(resp && resp.status===200 && e.request.method==='GET'){
        var clone = resp.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
      }
      return resp;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
