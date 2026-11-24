const project=document.querySelector('#project');
const zoom=document.querySelector('#zoom');
project.addEventListener('change',()=>{location.hash='slide-'+project.value;});
zoom.addEventListener('click',()=>{
 const on=document.body.classList.toggle('enlarged');
 zoom.setAttribute('aria-pressed',String(on));zoom.textContent=on?'Fit width':'Enlarge';
});
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const videos=[...document.querySelectorAll('video')];
const manualPause=new WeakSet();
videos.forEach(video=>{
 video.muted=true;
 video.addEventListener('pause',()=>{if(video.dataset.visible==='true'&&!video.dataset.autoPausing)manualPause.add(video);});
 video.addEventListener('play',()=>manualPause.delete(video));
});
function stop(video){video.dataset.autoPausing='true';video.pause();setTimeout(()=>delete video.dataset.autoPausing,100);}
const observer=new IntersectionObserver(entries=>{
 for(const entry of entries){const video=entry.target;video.dataset.visible=String(entry.isIntersecting);
  if(entry.isIntersecting&&!reduced.matches&&!manualPause.has(video)){video.play().catch(()=>{});}else if(!entry.isIntersecting){stop(video);}
 }
},{threshold:0.25});
videos.forEach(video=>observer.observe(video));
reduced.addEventListener('change',()=>{if(reduced.matches)videos.forEach(stop);});
document.addEventListener('visibilitychange',()=>{videos.forEach(video=>{if(document.hidden)stop(video);else if(video.dataset.visible==='true'&&!reduced.matches&&!manualPause.has(video))video.play().catch(()=>{});});});
const sections=[...document.querySelectorAll('.slide')];
let queued=false;
window.addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const current=sections.filter(s=>s.getBoundingClientRect().top<=innerHeight/2).pop();if(!current)return;const n=Number(current.id.slice(6));project.value=String(n>=18?18:n>=17?17:n>=12?12:n>=7?7:n>=4?4:1);});},{passive:true});
