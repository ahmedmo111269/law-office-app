const CACHE_NAME = "law-office-v1";
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./manifest.json",
    "./js/namespace.js",
    "./js/constants.js",
    "./js/db/schema.js",
    "./js/db/db.js",
    "./js/db/repositories/client-repository.js",
    "./js/db/repositories/case-repository.js",
    "./js/db/repositories/case-client-repository.js",
    "./js/core/error-handler.js",
    "./js/core/validators.js",
    "./js/core/router.js",
    "./js/services/client-service.js",
    "./js/ui/toast.js",
    "./js/ui/modal.js",
    "./js/modules/dashboard/dashboard.js",
    "./js/app.js"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});