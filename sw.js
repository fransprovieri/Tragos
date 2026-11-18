const C='tragos-v8';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png','./assets/Ruina.ttf',
 ...['mi','tiki','clasico'].map(b=>`./assets/marco/${b}.webp`),
 ...['old-fashioned','mai-tai','pina-colada','painkiller','jungle-bird','daiquiri','negroni','margarita','martini','manhattan','mojito','aperol-spritz','whiskey-sour','espresso-martini','fernet-coca','cynar-pomelo','gancia-sprite'].map(d=>`./assets/drinks/${d}.webp`)];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res}).catch(()=>caches.match('./index.html'))))});
