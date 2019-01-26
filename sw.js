const version = "95fae7f";
const currentCacheName = `ELCWEB-${version}`;
const filesToCache = [
    "/link/memo-paralelo/?v=3c6ea4b",
    "/category/stories/?v=f877b2d",
    "/tag/terror/?v=de70f46",
    "/tag/muerte/?v=2177dc4",
    "/theme/js/scripts.js?v=9309cfa",
    "/link/CONAIISI2018/?v=200f9d0",
    "/pages/about/?v=b55e85b",
    "/tag/futuro/?v=8f8c7bf",
    "/tag/desastre/?v=b149e2c",
    "/category/microstories/?v=38f6ab5",
    "/link/espadeo-biblico-pdf/?v=bfc3e18",
    "/tag/alma-sotano-muerte-asesinato-sangre-microrrelato-suspenso-cuentocorto-lector-historias-leer/?v=51a293b",
    "/posts/luca-chapter-1/es/?v=36cbb66",
    "/author/sabrina-bernardelli/?v=d0b437d",
    "/posts/2017/?v=de7c7e1",
    "/link/arma-historia-pdf/?v=4444bb9",
    "/link/espadeo-biblico/?v=7a2ef55",
    "/theme/images/DOC.svg?v=5d41948",
    "/link/memo-paralelo-pdf/?v=33a1894",
    "/theme/css/style.css?v=34aec5c",
    "/theme/images/Jupyter.svg?v=056bcc4",
    "/authors/?v=8bce9f0",
    "/link/arma-historia/?v=69eb177",
    "/archives/?v=2d6f6ba",
    "/?v=fca0c8c",
    "/link/tabu-biblico/?v=fdcfb8b",
    "/link/trivia-adolescente-pdf/?v=b30b617",
    "/theme/images/RevealJS.svg?v=eb946c8",
    "/tags/?v=217277a",
    "/posts/luca-prologue/?v=11caf9d",
    "/tag/carta/?v=d5f5aae",
    "/pages/contact/es/?v=6c07f76",
    "/extra/sw_template.js?v=4cee959",
    "/tag/sociedad/?v=a594e2a",
    "/link/trivia-adolescente/?v=01c8b41",
    "/posts/inexistencia/es/?v=f6d0225",
    "/pages/contact/?v=ea023a6",
    "/link/conoce-historia-pdf/?v=2ee5701",
    "/tag/misterio/?v=08b95c0",
    "/tag/luca/?v=57a5bf9",
    "/theme/images/PDF.svg?v=872b33e",
    "/author/zam-ackerman/?v=a884112",
    "/posts/otra-carta-cualquiera/es/?v=0a8556c",
    "/pages/about/es/?v=1968ca7",
    "/link/github/?v=7239848",
    "/tag/inexistencia-findelmundo-eternidad-microrrelato-cuentoscortos-lector-historias-final/?v=4bfca1c",
    "/posts/luca-prologue/es/?v=83c86e7",
    "/posts/2017/Dec/?v=3a10b06",
    "/posts/alma/es/?v=3caadc7",
    "/categories/?v=09a0847",
    "/link/tabu-biblico-pdf/?v=2b7760e",
    "/safari-pinned-tab.svg?v=4686042",
    "/link/conoce-historia/?v=f9a6544"
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCacheName)
      .then(cache => cache.addAll(filesToCache))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => cacheNames.filter(cacheName => ! currentCacheName.includes(cacheName) ))
      .then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete))))
      .then(self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  const scope = self.registration.scope;
  
	if (!url.startsWith(scope)) {
		return;
  }

  event.respondWith(
    caches.open(currentCacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}) )
      .then(response => response || fetch(event.request) )
  );
});
