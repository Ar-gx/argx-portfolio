import {useMotionPreference} from '../hooks/useMotionPreference';
import {motion} from 'framer-motion';
import {ArrowUpRight} from 'lucide-react';
import type {ReactNode} from 'react';
export {default as Marquee} from './PortalMarquee';
export function Reveal({children,className=''}:{children:ReactNode;className?:string}){const reduced=useMotionPreference();return <motion.div className={className} initial={reduced?false:{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.65,ease:[.2,.7,.2,1]}}>{children}</motion.div>}
export function Button({children,href,secondary=false}:{children:ReactNode;href:string;secondary?:boolean}){return <a href={href} className={`button ${secondary?'secondary':''}`}><span>{children}</span><i><ArrowUpRight size={19}/></i></a>}
export function Label({children}:{children:ReactNode}){return <p className="eyebrow"><span/> {children}</p>}
