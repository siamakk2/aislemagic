/* AisleBird Service Worker — offline-first app shell */
var CACHE = 'aislebird-v1';
var SHELL = ['/app', '/app/'];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
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
     url.hostname.indexOf('vercel-analytics.com')!==-1){
    return;
  }

  // App shell — cache-first, refresh in background
  if(url.pathname === '/app' || url.pathname === '/app/'){
    e.respondWith(
      caches.open(CACHE).then(function(c){
        return c.match('/app').then(function(cached){
          var fresh = fetch(e.request).then(function(resp){
            if(resp && resp.status===200) c.put('/app', resp.clone());
            return resp;
          }).catch(function(){ return null; });
          return cached || fresh;
        });
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
