var CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

const CACHE_FILES = [
"/", 
  "/index.html", 
  "index.js", 
  "db.js",
  "styles.css",
  "manifest.webmanifest", 
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        console.log("Caching Files");
        return cache.addAll(CACHE_FILES);
      })
      .then(() => self.skipWaiting())
    );
  });

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                if (key !== CACHE_NAME) {
                    console.log("Removing old cache data", key);
                    return caches.delete(key);
                }
            })
        );
        })
    );
}); 

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request).then(function(response) {
                if (response) {
                    return response;
                    } else if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/index.html');
                    }
                });
        })
    );
});
