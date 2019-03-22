importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

let cacheName = 'v11';

if (workbox) {
    let strategiesConfig = workbox.strategies.cacheFirst({
        cacheName
    });

    workbox.routing.registerRoute(
        new RegExp('.*\.css'),
        strategiesConfig
    );

    workbox.routing.registerRoute(
        new RegExp('.*\.js'),
        strategiesConfig
    );

    workbox.routing.registerRoute(
        // Cache image files
        /.*\.(?:png|jpg|jpeg|svg|gif)/,
        strategiesConfig
    );
} else {
    self.addEventListener('install', e => {
        console.log('sw installed');
        e.waitUntil(
            caches.open(cacheName)
                .then(cache => cache.addAll([
                    './js/blog.min.js',
                    './js/bootstrap.min.js',
                    './js/jquery.min.js',
                    'https://retcode.alicdn.com/retcode/bl.js',
                    'https://cdn.bootcss.com/fastclick/1.0.6/fastclick.min.js',
                    './css/bootstrap.min.css',
                    './css/blog.min.css',
                    './css/syntax.css',
                    'https://cdn.staticfile.org/font-awesome/4.2.0/css/font-awesome.min.css',
                    "./img/avatar-jeff.jpeg",
                    "./img/icon_wechat.png",
                    ".//img/home-bg.jpg"
                ]))
        );
    })

    self.addEventListener('fetch', event => {
        event.respondWith(
            caches.match(event.request)
                .then(cachedRes => {
                    if (cachedRes) {
                        console.log('use cached resource:', event.request.url)
                        return cachedRes
                    };
                    var fetchRequest = event.request.clone();
                    return fetch(fetchRequest).then(res => {
                        return res
                    })
                })
        );
    });
}

self.addEventListener('activate', e => {
    console.log('sw activate');
    e.waitUntil(clients.claim());
})

