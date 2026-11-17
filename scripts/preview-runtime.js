(()=>{
  'use strict';
  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const read=(key,fallback)=>{try{return localStorage.getItem(key)||fallback}catch{return fallback}};
  const save=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
  let galleryIndex=1,themeBusy=false,returnFocus=null;
  const {environments}=window.portfolioData;
  const root=document.documentElement;
  const reduced=root.dataset.motion==='reduced';
  const hero=$('.pdf-hero'),avatar=$('.hero-voxel');
  let pointerSeen=false,heroVisible=true,energyActive=false,heroFrame=0;
  let tx=avatar.clientWidth*.5,ty=avatar.clientHeight*.35,x=tx,y=ty,depthX=0,depthY=0;

  root.classList.toggle('js-motion', !reduced);
  startHero();

  root.dataset.theme=read('arjun-theme','dark');
  function themeLabel(){const light=root.dataset.theme==='light';$('.theme-toggle').setAttribute('aria-label',`Switch to ${light?'dark':'light'} mode`);$('.theme-text').textContent=light?'Go dark':'Go light'}
  themeLabel();
  function liquidFrames(cx,cy){const radius=Math.hypot(Math.max(cx,innerWidth-cx),Math.max(cy,innerHeight-cy))*1.15;return Array.from({length:55},(_,frame)=>{const t=frame/54,r=radius*t;return{clipPath:`polygon(${Array.from({length:120},(_,i)=>{const a=i/120*Math.PI*2,w=1+(Math.sin(a*5-t*12)*.09+Math.sin(a*9+t*7)*.035)*Math.sin(Math.PI*t);return`${cx+Math.cos(a)*r*w}px ${cy+Math.sin(a)*r*w}px`}).join(',')})`}})}
  $('.theme-toggle').addEventListener('click',async event=>{
    if(themeBusy)return;
    const next=root.dataset.theme==='light'?'dark':'light';
    const apply=()=>{root.dataset.theme=next;save('arjun-theme',next);themeLabel()};
    if(reduced){apply();return}
    themeBusy=true;const box=event.currentTarget.getBoundingClientRect(),cx=box.left+box.width/2,cy=box.top+box.height/2;
    root.dataset.transitioning='true';
    try{
      if(document.startViewTransition){const transition=document.startViewTransition(apply);await transition.ready;await root.animate(liquidFrames(cx,cy),{duration:1200,easing:'cubic-bezier(.2,.65,.2,1)',pseudoElement:'::view-transition-new(root)',fill:'forwards'}).finished;await transition.finished}
      else{const overlay=document.createElement('div');overlay.className='theme-liquid';overlay.style.background=next==='light'?'#f1eee7':'#09090b';document.body.append(overlay);await overlay.animate(liquidFrames(cx,cy),{duration:1100,easing:'ease-out',fill:'forwards'}).finished;apply();await overlay.animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards'}).finished;overlay.remove()}
    }catch{apply()}finally{themeBusy=false;delete root.dataset.transitioning}
  });

  // The reveal stays usable with reduced motion; only interpolation and idle movement stop.
  function renderHero(time){
    heroFrame=0;
    if(!heroVisible||document.hidden)return;
    if(!pointerSeen&&!reduced){const size=avatar.getBoundingClientRect();tx=size.width*(.5+Math.sin(time*.0006)*.12);ty=size.height*(.3+Math.cos(time*.0007)*.08)}
    const ease=reduced?1:.1;x+=(tx-x)*ease;y+=(ty-y)*ease;
    avatar.style.setProperty('--x',x+'px');avatar.style.setProperty('--y',y+'px');
    avatar.style.setProperty('--depth-x',reduced?'0px':depthX+'px');avatar.style.setProperty('--depth-y',reduced?'0px':depthY+'px');
    if(!reduced&&(!pointerSeen||Math.abs(tx-x)+Math.abs(ty-y)>.2))heroFrame=requestAnimationFrame(renderHero);
  }
  function startHero(){if(!heroFrame&&heroVisible)heroFrame=requestAnimationFrame(renderHero)}
  hero.addEventListener('pointermove',event=>{const r=avatar.getBoundingClientRect();tx=event.clientX-r.left;ty=event.clientY-r.top;pointerSeen=true;depthX=(event.clientX/innerWidth-.5)*12;depthY=(event.clientY/innerHeight-.5)*7;startHero()},{passive:true});
  hero.addEventListener('pointerleave',()=>{pointerSeen=false;depthX=depthY=0;startHero()});
  hero.addEventListener('touchstart',event=>{const p=event.touches[0],r=avatar.getBoundingClientRect();tx=p.clientX-r.left;ty=p.clientY-r.top;pointerSeen=true;startHero()},{passive:true});
  const heroObserver=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible)startHero();else{cancelAnimationFrame(heroFrame);heroFrame=0}});heroObserver.observe(hero);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)startHero()});
  Promise.all($$('.hero-voxel img').map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true})}))).then(()=>{hero.classList.add('assets-ready');avatar.setAttribute('aria-busy','false');$('.avatar-skeleton')?.remove();startHero()});
  $('.energy-toggle').addEventListener('click',event=>{
    energyActive=!energyActive;hero.dataset.energy=energyActive?'on':'follow';event.currentTarget.setAttribute('aria-pressed',String(energyActive));event.currentTarget.querySelector('span').textContent=energyActive?'Follow my cursor':'Activate energy';
    if(!reduced){const rect=avatar.getBoundingClientRect();burst(rect.left+rect.width*.5,rect.top+rect.height*.32)}
  });
  function burst(clientX,clientY){for(let i=0;i<12;i++){const cube=document.createElement('i');cube.className='energy-burst';cube.style.left=clientX+'px';cube.style.top=clientY+'px';document.body.append(cube);const angle=i/12*Math.PI*2;cube.animate([{opacity:1,transform:'translate(0,0) rotate(0deg) scale(1)'},{opacity:0,transform:`translate(${Math.cos(angle)*160}px,${Math.sin(angle)*130}px) rotate(160deg) scale(.15)`}],{duration:850+i*20,easing:'ease-out'}).finished.finally(()=>cube.remove())}}

  function spotlight(element,tilt=false){
    let raf=0,px=element.clientWidth/2,py=element.clientHeight/2,sx=px,sy=py;
    function render(){raf=0;const factor=reduced?1:.16;sx+=(px-sx)*factor;sy+=(py-sy)*factor;element.style.setProperty('--x',sx+'px');element.style.setProperty('--y',sy+'px');if(tilt&&!reduced){element.style.setProperty('--rx',((sy/element.clientHeight-.5)*-7)+'deg');element.style.setProperty('--ry',((sx/element.clientWidth-.5)*9)+'deg')}if(Math.abs(px-sx)+Math.abs(py-sy)>.2)raf=requestAnimationFrame(render)}
    element.addEventListener('pointermove',event=>{const r=element.getBoundingClientRect();px=event.clientX-r.left;py=event.clientY-r.top;if(!raf)raf=requestAnimationFrame(render)},{passive:true});
    element.addEventListener('pointerleave',()=>{element.style.setProperty('--rx','0deg');element.style.setProperty('--ry','0deg')});
  }
  $$('.project-visual').forEach(el=>spotlight(el,true));
  $$('.button').forEach(button=>{button.addEventListener('pointermove',event=>{if(reduced||event.pointerType==='touch')return;const r=button.getBoundingClientRect();button.style.translate=`${(event.clientX-r.left-r.width/2)*.08}px ${(event.clientY-r.top-r.height/2)*.1}px`},{passive:true});button.addEventListener('pointerleave',()=>button.style.translate='0px 0px')});

  function show(index){
    galleryIndex=(index+environments.length)%environments.length;const env=environments[galleryIndex],image=$('#gallery-image');image.src='images/environment-'+(galleryIndex+1)+'.jpg';image.alt=env.title+' — fantasy environment development visual';
    if(!reduced)image.animate([{opacity:.25,transform:'translateX(12px) scale(1.025)'},{opacity:1,transform:'translateX(0) scale(1)'}],{duration:500,easing:'ease-out'});
    $('#env-number').textContent='ENVIRONMENT STUDY / 0'+(galleryIndex+1);$('#env-title').textContent=env.title;$('#env-description').textContent=env.description;$('#count').textContent='0'+(galleryIndex+1);
    $$('[data-slide]').forEach(button=>{const active=+button.dataset.slide===galleryIndex;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active))});
    $('.lightbox>img').src=image.src;$('.lightbox>img').alt=env.title;$('#lightbox-caption').textContent=`0${galleryIndex+1} / 05 — ${env.title}`;
  }
  $$('[data-slide]').forEach(button=>button.addEventListener('click',()=>show(+button.dataset.slide)));$$('.prev-env').forEach(button=>button.addEventListener('click',()=>show(galleryIndex-1)));$$('.next-env').forEach(button=>button.addEventListener('click',()=>show(galleryIndex+1)));show(1);
  let dragStart=0;
  $('.gallery-main').addEventListener('pointerdown',event=>{dragStart=event.clientX},{passive:true});$('.gallery-main').addEventListener('pointerup',event=>{const delta=event.clientX-dragStart;if(Math.abs(delta)>45)show(galleryIndex+(delta<0?1:-1))},{passive:true});
  $('.gallery-main').addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();show(galleryIndex-1)}if(event.key==='ArrowRight'){event.preventDefault();show(galleryIndex+1)}});
  function closeDialog(element){element.hidden=true;document.body.style.overflow='';returnFocus?.focus();$('.mobile-trigger').setAttribute('aria-expanded','false')}
  function openDialog(element){returnFocus=document.activeElement;element.hidden=false;document.body.style.overflow='hidden';element.querySelector('button,a').focus();if(!reduced)element.animate([{opacity:0},{opacity:1}],{duration:230})}
  $('.expand-gallery').onclick=()=>openDialog($('.lightbox'));$('.lightbox-close').onclick=()=>closeDialog($('.lightbox'));$('.mobile-trigger').onclick=()=>{openDialog($('.mobile-menu'));$('.mobile-trigger').setAttribute('aria-expanded','true')};$('.close-menu').onclick=()=>closeDialog($('.mobile-menu'));$$('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>closeDialog($('.mobile-menu'))));
  document.addEventListener('keydown',event=>{const dialog=$$('.lightbox,.mobile-menu').find(el=>!el.hidden);if(!dialog)return;if(event.key==='Escape')closeDialog(dialog);if(dialog.classList.contains('lightbox')){if(event.key==='ArrowLeft'){event.preventDefault();show(galleryIndex-1)}if(event.key==='ArrowRight'){event.preventDefault();show(galleryIndex+1)}}if(event.key==='Tab'){const items=[...dialog.querySelectorAll('button,a')],first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});

  const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)$$('.desktop-nav a').forEach(link=>link.classList.toggle('active',link.hash==='#'+entry.target.id))}),{rootMargin:'-15% 0px -60% 0px'});$$('#home,#about,#skills,#projects,#contact').forEach(el=>navObserver.observe(el));
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.1});$$('.reveal').forEach(el=>revealObserver.observe(el));
  const animationObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{entry.target.dataset.visible=String(entry.isIntersecting)}));$$('.marquee-section,.project-card').forEach(el=>animationObserver.observe(el));
  let scrollFrame=0;
  function scroll(){if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const distance=root.scrollHeight-innerHeight;$('.scroll-progress').style.transform=`scaleX(${distance?scrollY/distance:0})`;$('.nav').classList.toggle('scrolled',scrollY>30);
    if(!reduced){const projectRect=$('#projects').getBoundingClientRect();if(projectRect.top<innerHeight&&projectRect.bottom>0){const p=(innerHeight/2-projectRect.top-projectRect.height/2);$('.cloud-one').style.transform=`translateY(${p*.18}px)`;$('.cloud-two').style.transform=`translateY(${-p*.16}px) scaleX(-1)`}
      if(heroVisible)$('.hero-name').style.transform=`translateY(${scrollY*.13}px)`;
    }
  })}
  addEventListener('scroll',scroll,{passive:true});addEventListener('resize',()=>{if(!pointerSeen){tx=avatar.clientWidth*.5;ty=avatar.clientHeight*.35;startHero()}scroll()},{passive:true});scroll();
  $('.copy-code').onclick=async()=>{try{await navigator.clipboard.writeText($('.code-window code').innerText.replace(/^0[2-7]/gm,''));$('.copy-code').setAttribute('aria-label','Profile code copied');$('.copy-code').textContent='✓';setTimeout(()=>{$('.copy-code').textContent='⧉';$('.copy-code').setAttribute('aria-label','Copy profile code')},1600)}catch{$('.copy-code').setAttribute('aria-label','Copy unavailable in this browser')}};
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(heroFrame);cancelAnimationFrame(scrollFrame);heroObserver.disconnect();animationObserver.disconnect();revealObserver.disconnect();navObserver.disconnect()},{once:true});
})();
