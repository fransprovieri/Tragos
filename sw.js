const C='tragos-v31';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png','./assets/Ruina.ttf',
 ...['mi','tiki','clasico'].flatMap(b=>[0,1,2,3].map(f=>`./assets/marco/${b}_${f}.webp`)),
 ...['old-fashioned','mai-tai','pina-colada','painkiller','jungle-bird','daiquiri','negroni','margarita','martini','manhattan','mojito','aperol-spritz','whiskey-sour','espresso-martini','fernet-coca','cynar-pomelo','gancia-sprite'].map(d=>`./assets/drinks/${d}.webp`)];
/* al instalar, baja todo de nuevo desde la red (sin usar el caché del navegador) */
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:'reload'})).then(r=>{if(r.ok)return c.put(f,r)}))) ).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* la app (index) siempre intenta la red primero para que las novedades lleguen; el resto sale del caché */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const isPage=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html')||u.pathname.endsWith('sw.js');
  if(isPage){
    e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res}).catch(()=>caches.match('./index.html'))));
});
