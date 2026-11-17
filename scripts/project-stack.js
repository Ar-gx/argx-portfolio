(()=>{
  const cards=[...document.querySelectorAll('.stack-card')];
  document.querySelectorAll('.project-screenshot').forEach(img=>{
    const cover=img.parentElement;
    const failed=()=>{cover.dataset.previewState='error';if(img.src.startsWith('http'))cover.querySelector('.preview-fallback small').textContent='Screenshot unavailable. Open the card to visit the live website.'};
    const ready=()=>{if(img.naturalWidth)cover.dataset.previewState='ready';else failed()};
    img.addEventListener('load',ready);img.addEventListener('error',failed);
    if(img.complete)ready();
  });
  cards.forEach(card=>{
    const summary=card.querySelector('summary');
    if(card.classList.contains('dawn')){
      summary.addEventListener('click',event=>{
        if(card.open||(event.detail!==0&&!event.target.closest('.stack-gallery-action')))return;
        requestAnimationFrame(()=>{
          if(!card.open)return;
          const gallery=card.querySelector('#world');
          gallery?.focus({preventScroll:true});
          gallery?.scrollIntoView({block:'start'});
        });
      });
    }
    card.addEventListener('toggle',()=>{
      const label=card.classList.contains('dawn')
        ? (card.open?'Close Last Dawn project details':'Last Dawn: View environments')
        : summary.getAttribute('aria-label').replace(/^(Open|Close)/,card.open?'Close':'Open');
      summary.setAttribute('aria-label',label);
      if(!card.open)return;
      cards.forEach(other=>{if(other!==card)other.open=false});
      if(document.documentElement.dataset.motion!=='reduced')card.querySelector('.project-expanded').animate([{opacity:0,translate:'0 12px'},{opacity:1,translate:'0 0'}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'});
    });
    card.addEventListener('keydown',event=>{if(event.key==='Escape'&&card.open){card.open=false;card.querySelector('summary').focus()}});
  });
})();
