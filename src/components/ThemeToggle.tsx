import {isMotionReduced} from '../hooks/useMotionPreference';
import {useEffect, useRef, useState} from 'react';
import {Moon, Sun} from 'lucide-react';

type TransitionDocument = Document & {startViewTransition?: (callback:()=>void)=>{ready:Promise<void>;finished:Promise<void>}};
export default function ThemeToggle(){
  const [light,setLight]=useState(()=>{try{return localStorage.getItem('arjun-theme')==='light'}catch{return false}});
  const busy=useRef(false);
  useEffect(()=>{document.documentElement.dataset.theme=light?'light':'dark';},[light]);
  async function toggle(event:React.MouseEvent<HTMLButtonElement>){
    if(busy.current)return;
    const next=!light;
    const apply=()=>{document.documentElement.dataset.theme=next?'light':'dark';setLight(next);try{localStorage.setItem('arjun-theme',next?'light':'dark')}catch{/* Storage is optional. */}};
    const doc=document as TransitionDocument;
    if(!doc.startViewTransition || isMotionReduced()){apply();return}
    busy.current=true;
    const box=event.currentTarget.getBoundingClientRect();
    const x=box.left+box.width/2,y=box.top+box.height/2;
    const radius=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    const transition=doc.startViewTransition(apply);
    try{
      await transition.ready;
      const frames=Array.from({length:49},(_,frame)=>{
        const t=frame/48, r=radius*1.12*t;
        const points=Array.from({length:100},(_,i)=>{
          const a=i/100*Math.PI*2;
          const wave=1+(Math.sin(a*5-t*10)*.075+Math.sin(a*9+t*8)*.035)*Math.sin(Math.PI*t);
          return `${x+Math.cos(a)*r*wave}px ${y+Math.sin(a)*r*wave}px`;
        });
        return {clipPath:`polygon(${points.join(',')})`};
      });
      await document.documentElement.animate(frames,{duration:1150,easing:'cubic-bezier(.22,.7,.2,1)',pseudoElement:'::view-transition-new(root)',fill:'forwards'}).finished;
      await transition.finished;
    }catch{/* Theme still changes if transition support is interrupted. */}finally{busy.current=false}
  }
  return <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${light?'dark':'light'} mode`} title="Pour a little change"><span>{light?<Moon size={17}/>:<Sun size={17}/>}</span><span className="theme-text">{light?'Go dark':'Go light'}</span></button>;
}
