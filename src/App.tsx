import {useMotionPreference} from './hooks/useMotionPreference';
import {MotionConfig,motion,useScroll} from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import {Marquee} from './components/Shared';
export default function App(){const {scrollYProgress}=useScroll();const reduced=useMotionPreference();return <MotionConfig reducedMotion={reduced?'always':'never'}><a className="skip-link" href="#main">Skip to content</a><motion.div className="scroll-progress" style={{scaleX:scrollYProgress}}/><Navbar/><main id="main"><Hero/><About/><Marquee/><Projects/><Marquee reverse/><Contact/></main></MotionConfig>}
