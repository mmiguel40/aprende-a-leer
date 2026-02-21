// =====================================================================
// Service Worker — Aventura de Letras
// Estrategia: Cache First para /audio/, Network First para el resto.
// Los paquetes de audio se almacenan en cachés nombrados por dificultad.
// =====================================================================

const CACHE_VERSION = 'v1';
const AUDIO_CACHE_PREFIX = `audio-pack-${CACHE_VERSION}-`;

// ── Instalación ───────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Activar inmediatamente sin esperar cierre de pestañas
});

// ── Activación ────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key.startsWith('audio-pack-') && !key.startsWith(AUDIO_CACHE_PREFIX))
                    .map((key) => caches.delete(key)) // Limpiar cachés de versiones antiguas
            );
        }).then(() => self.clients.claim())
    );
});

// ── Interceptar Fetch (Cache First para /audio/) ───────────────────────
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith('/audio/')) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).catch(() => {
                    // Offline y no cacheado: devolver respuesta vacía sin tirar error
                    return new Response('', { status: 503, statusText: 'Audio no disponible offline' });
                });
            })
        );
    }
});

// ── Mensajes desde la App ─────────────────────────────────────────────
self.addEventListener('message', (event) => {
    const { type, packName, urls } = event.data || {};

    if (type === 'CACHE_PACK') {
        cachePack(packName, urls, event.source);
    }

    if (type === 'GET_CACHED_PACKS') {
        getCachedPacks(event.source);
    }
});

// ── Función: Cachear un paquete de audios ─────────────────────────────
async function cachePack(packName, urls, client) {
    const cacheName = `${AUDIO_CACHE_PREFIX}${packName}`;
    const total = urls.length;
    let loaded = 0;

    try {
        const cache = await caches.open(cacheName);

        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                }
            } catch {
                // No interrumpir el resto si un archivo falla
            }
            loaded++;
            client.postMessage({
                type: 'PACK_PROGRESS',
                packName,
                loaded,
                total,
                done: loaded === total,
            });
        }

        client.postMessage({ type: 'PACK_DONE', packName });
    } catch (error) {
        client.postMessage({ type: 'PACK_ERROR', packName, error: String(error) });
    }
}

// ── Función: Obtener qué paquetes están cacheados ─────────────────────
async function getCachedPacks(client) {
    const keys = await caches.keys();
    const cachedPacks = keys
        .filter((key) => key.startsWith(AUDIO_CACHE_PREFIX))
        .map((key) => key.replace(AUDIO_CACHE_PREFIX, ''));

    client.postMessage({ type: 'CACHED_PACKS', packs: cachedPacks });
}
