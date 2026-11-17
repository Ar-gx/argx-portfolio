import {useEffect,useRef} from 'react';
import {skills} from '../data/portfolio';
import {mountPortalFlow} from '../portal/renderPortalFlow';
export default function PortalMarquee({reverse=false}:{reverse?:boolean}){
  const ref=useRef<HTMLElement>(null);
  useEffect(()=>{if(ref.current)return mountPortalFlow(ref.current,skills)},[]);
  return <section ref={ref} id={reverse?undefined:'skills'} className={`marquee-section pdf-marquee portal-flow portal-depth ${reverse?'reversed':''}`} aria-label="Skills">
    <p className="portal-skills">{skills.join(' · ')}</p>
    <canvas className="portal-stream" aria-hidden="true"/>
    <span className="portal-lip lip-left" aria-hidden="true"/><span className="portal-lip lip-right" aria-hidden="true"/>
    {['left','right'].map(side=><img key={side} className={`portal-art portal-art-${side}`} src="/images/portal-aperture.png" alt="" aria-hidden="true" loading="lazy"/>)}
    {['left','right'].map(side=><img key={side} className={`portal-art portal-front portal-art-${side}`} src="/images/portal-aperture.png" alt="" aria-hidden="true" loading="lazy"/>)}
  </section>;
}
