import {mountPortalFlow} from './portal-renderer.js';
const cleanups=[...document.querySelectorAll('.portal-depth')].map(section=>mountPortalFlow(section,window.portfolioData.skills));
addEventListener('pagehide',()=>cleanups.forEach(cleanup=>cleanup()),{once:true});
