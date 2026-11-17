const arrow='<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m7 17 10-10M7 7h10v10"/></svg>';
const plus='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const local=path=>path.startsWith('/')?path.slice(1):path;
export function projectStackMarkup(projects,gallery,environmentCount,irrigationEmphasis){
 return `<section id="projects" class="section projects pdf-projects stacked-projects">
  <img class="project-cloud cloud-one" src="images/cloud.png" alt="" aria-hidden="true" loading="lazy"/><img class="project-cloud cloud-two" src="images/cloud.png" alt="" aria-hidden="true" loading="lazy"/>
  <div class="pdf-project-heading reveal"><p class="eyebrow"><span></span>IDEAS, BUILT INTO EXPERIENCES</p><div><img src="images/enchanted-book.png" alt="" loading="lazy"/><h2 class="section-title">Featured <em>projects.</em></h2></div><p>Three projects. Three different directions.<br/>Open a card to explore.</p></div>
  <div class="project-stack">${projects.map(p=>`<details class="stack-card ${p.theme}" id="project-${p.id}" name="portfolio-projects">
    <summary aria-label="${p.kind==='game'?'Last Dawn: View environments':'Open '+p.title+' project details'}"><span class="stack-index">/${p.id}</span>
      <span class="stack-cover" data-preview-state="loading"><span class="preview-fallback" aria-hidden="true"><span class="preview-mark">${p.theme==='aqua'?'≈':p.theme==='nilvon'?'N.':'LD'}</span><strong>${p.title}</strong><small>${p.kind==='website'?'Website screenshot preview':'Development artwork'}</small></span><img class="project-screenshot" src="${local(p.image)}" alt="${p.kind==='website'?p.title+' website screenshot':p.title+' development environment artwork'}" loading="lazy" referrerpolicy="no-referrer"/><span class="cover-caption">${p.kind==='website'?'WEB PROJECT':'WORLD IN DEVELOPMENT'}</span></span>
      <span class="stack-heading"><span class="meta">${p.category}</span><span class="stack-title">${p.title}</span><span class="stack-description">${p.description.replace(irrigationEmphasis,`<strong>${irrigationEmphasis}</strong>`)}</span><span class="stack-status"><i></i>${p.status}${p.kind==='game'?` · ${environmentCount} environment studies`:''}</span>${p.kind==='game'?'<span class="stack-gallery-action">View environments <span aria-hidden="true">↓</span></span>':''}</span>
      <span class="stack-open" aria-hidden="true">${plus}</span>
    </summary>
    <div class="project-expanded"><div class="expanded-overview"><div><h3>${p.kind==='game'?'The world behind Last Dawn':'About the project'}</h3>${p.details.map(text=>`<p>${text}</p>`).join('')}${p.url?`<a class="button project-live" href="${p.url}" target="_blank" rel="noopener noreferrer"><span>Visit ${p.title}</span><i>${arrow}</i></a>`:''}</div><dl>${p.facts.map(f=>`<div><dt>${f.label}</dt><dd>${f.value}</dd></div>`).join('')}</dl></div>
      ${p.kind==='game'?gallery:''}
    </div>
  </details>`).join('')}</div>
 </section>`;
}
