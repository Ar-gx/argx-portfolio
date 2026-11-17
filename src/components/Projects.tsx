import {useState} from 'react';
import {motion} from 'framer-motion';
import {ArrowUpRight,Plus} from 'lucide-react';
import {environments,featuredProjects,irrigationEmphasis} from '../data/portfolio';
import {Label,Reveal} from './Shared';
import {useMotionPreference} from '../hooks/useMotionPreference';
import GameGallery from './GameGallery';

function Preview({title,image,theme,large=false,game=false}:{title:string;image:string;theme:string;large?:boolean;game?:boolean}){
 const [state,setState]=useState('loading');
 return <span className={large?'expanded-screenshot':'stack-cover'} data-preview-state={state}><span className="preview-fallback" aria-hidden="true"><span className="preview-mark">{theme==='aqua'?'≈':theme==='nilvon'?'N.':'LD'}</span><strong>{title}</strong><small>{state==='error'?'Screenshot unavailable. Visit the live website.':large?'Explore the live website using the link above.':game?'Development artwork':'Website screenshot preview'}</small></span><img className="project-screenshot" src={image} alt={game?`${title} development environment artwork`:`${title} website screenshot`} loading="lazy" referrerPolicy="no-referrer" onLoad={()=>setState('ready')} onError={()=>setState('error')}/>{!large&&<span className="cover-caption">{game?'WORLD IN DEVELOPMENT':'WEB PROJECT'}</span>}</span>;
}
export default function Projects(){
 const [openId,setOpenId]=useState<string|null>(null);const reduced=useMotionPreference();
 return <section id="projects" className="section projects pdf-projects stacked-projects"><img className="project-cloud cloud-one" src="/images/cloud.png" alt="" aria-hidden="true" loading="lazy"/><img className="project-cloud cloud-two" src="/images/cloud.png" alt="" aria-hidden="true" loading="lazy"/><Reveal className="pdf-project-heading"><Label>IDEAS, BUILT INTO EXPERIENCES</Label><div><img src="/images/enchanted-book.png" alt="" loading="lazy"/><h2 className="section-title">Featured <em>projects.</em></h2></div><p>Three projects. Three different directions.<br/>Open a card to explore.</p></Reveal><div className="project-stack">{featuredProjects.map(project=>{
  const open=openId===project.id;
  const isGame=project.kind==='game';
  const [before,after]=project.description.split(irrigationEmphasis);
  return <details className={`stack-card ${project.theme}`} id={`project-${project.id}`} open={open} key={project.id} onKeyDown={event=>{if(event.key==='Escape'&&open&&!(event.target as Element).closest('.lightbox')){setOpenId(null);event.currentTarget.querySelector('summary')?.focus()}}}>
   <summary aria-label={!open&&isGame?'Last Dawn: View environments':`${open?'Close':'Open'} ${project.title} project details`} onClick={event=>{
    event.preventDefault();
    setOpenId(open?null:project.id);
    if (!open&&isGame&&(event.detail===0||(event.target as Element).closest('.stack-gallery-action'))) {
      requestAnimationFrame(()=>{
        const gallery=document.getElementById('world');
        gallery?.focus({preventScroll:true});
        gallery?.scrollIntoView({block:'start'});
      });
    }
   }}><span className="stack-index">/{project.id}</span><Preview title={project.title} image={project.image} theme={project.theme} game={project.kind==='game'}/><span className="stack-heading"><span className="meta">{project.category}</span><span className="stack-title">{project.title}</span><span className="stack-description">{after===undefined?before:<>{before}<strong>{irrigationEmphasis}</strong>{after}</>}</span><span className="stack-status"><i/>{project.status}{isGame&&` · ${environments.length} environment studies`}</span>{isGame&&!open&&<span className="stack-gallery-action">View environments <span aria-hidden="true">↓</span></span>}</span><span className="stack-open" aria-hidden="true"><Plus size={20}/></span></summary>
   <motion.div className="project-expanded" initial={false} animate={reduced?{opacity:1,y:0}:{opacity:open?1:0,y:open?0:12}} transition={{duration:.3,ease:[.16,1,.3,1]}}><div className="expanded-overview"><div><h3>{project.kind==='game'?'The world behind Last Dawn':'About the project'}</h3>{project.details.map(detail=><p key={detail}>{detail}</p>)}{project.url&&<a className="button project-live" href={project.url} target="_blank" rel="noopener noreferrer"><span>Visit {project.title}</span><i><ArrowUpRight size={19}/></i></a>}</div><dl>{project.facts.map(fact=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></div>{project.kind==='game'&&<GameGallery/>}</motion.div>
  </details>;
 })}</div></section>;
}
