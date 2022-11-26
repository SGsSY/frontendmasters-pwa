// cache 的是 path，不是 fileName
const assets = [
    '/',
    'styles.css', 
    'app.js', 
    'sw-register.js', 
    'https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2', 
];

self.addEventListener('install', event => {
    // event.waitUntil(
        caches.open('assets').then( cache => {
            cache.addAll(assets);
        })
    // );
})

// Cache First
self.addEventListener('fetch', event => {
    if (event.request.url === 'http://localhost:3000/fake') {
        const response = new Response(`hello ${event.request.url}`);
        event.respondWith(response);
    } 
    else {
        // We want to try and see if the request is cached

        // 可以開啟 caches 後取出 cache match
        // event.respondWith((async () => {
        //     const cache = await caches.open('assets');
        //     const cachedResponse = await cache.match(event.request);
        //     if (cachedResponse) return cachedResponse;
        //     return fetch(event.request);
        // })());

        // 也可以直接從 caches match
        event.respondWith(
            caches.match(event.request).then(response => {
                if (response) return response;
                return fetch(event.request);
            })
        );
    }
})

// State while revalidate strategy
// self.addEventListener('fetch', event => {
//     event.respondWith(
//         caches.match(event.request)
//             .then( response => {
//                 // Even if the response is in the cache, we fetch it
//                 // and update the cache for future usage
//                 const fetchPromise = fetch(event.request).then(
//                      networkResponse => {
//                         caches.open("assets").then( cache => {
//                             cache.put(event.request, networkResponse.clone());
//                             return networkResponse;
//                         });
//                     });
//                 // We use the currently cached version if it's there
//                 return response || fetchPromise; // cached or a network fetch
//             })
//         );
//     }
// ); 