export const portfolio = {
  name: 'Arjun A',
  roles: ['Student developer', 'AI enthusiast', 'Creative builder', 'Aspiring game developer'],
  headline: "Hey, I’m Arjun. I build AI tools, websites, and game worlds.",
  intro: "I’m a first-year student turning what I learn into interactive experiences.",
  about: ["Hey, I'm Arjun A, a first-year student building at the intersection of technology and creativity.", "I'm exploring AI, working with Python, C, C++, and AI/ML, creating websites, and experimenting with game development. Whether it’s an AI project, a company website, or a fantasy world, I enjoy turning an idea into something people can experience.", "Still learning. Still experimenting. Always curious about what comes next."],
  contacts: { email: 'arjun210608@gmail.com', github: 'https://github.com/Ar-gx', linkedin: 'https://www.linkedin.com/in/arjun-a-a34965437/' },
};
export const skills = ['C', 'C++', 'Python', 'AI / ML', 'AI Prompt Engineering'];
export type FeaturedProject = { id:string; title:string; category:string; description:string; url:string; image:string; theme:string; kind:'website'|'game'; status:string; details:string[]; facts:{label:string;value:string}[] };
export const irrigationEmphasis = 'if, when and how much';
export const projects: FeaturedProject[] = [
  { id:'01',title:'AquaSense AI',category:'AI / WEB PROJECT',description:`AquaSense AI decides ${irrigationEmphasis} to irrigate — from live weather, soil physics, crop growth stage and a trained ML model. Do not irrigate simply because it is time to irrigate.`,url:'https://aquasense-2-0.vercel.app',image:'/images/projects/aquasense.png',theme:'aqua',kind:'website',status:'Live website',details:['Try the demo farm or enter your own farm details to explore its irrigation recommendations.'],facts:[{label:'Project',value:'Irrigation decision support'},{label:'Status',value:'Live website'}]},
  { id:'02',title:'Nilvon',category:'COMPANY WEBSITE / WEB DEVELOPMENT',description:'A website for a home and building automation company, presenting its solutions through a polished web experience.',url:'https://nilvon.in',image:'https://image.thum.io/get/width/1200/crop/900/noanimate/https://nilvon.in',theme:'nilvon',kind:'website',status:'Live website',details:['A professional website created for Nilvon, a home and building automation company.','The website introduces the company and its automation solutions, including access control, convenience, safety and security, and entertainment.'],facts:[{label:'Client',value:'Nilvon Automation'},{label:'Project',value:'Company website'}]},
];
export const gameProject: FeaturedProject = {id:'03',title:'Last Dawn',category:'2.5D FANTASY ADVENTURE',description:'A fantasy world in development, built around atmospheric environments and a cinematic 2.5D visual direction.',url:'',image:'/images/environment-5.jpg',theme:'dawn',kind:'game',status:'In development',details:['An ongoing fantasy adventure project focused on worldbuilding and a detailed 2.5D visual experience.','Explore five supplied environment studies below. The project is in development; the gallery showcases its visual direction.'],facts:[{label:'Format',value:'2.5D fantasy adventure'},{label:'Status',value:'In development'}]};
export const featuredProjects: FeaturedProject[] = [...projects,gameProject];
export const environments = [
  {title:'The Homestead', description:'A quiet corner of a world taking shape.', image:'/images/environment-1.jpg'},
  {title:'The Azure Coast', description:'Turquoise waters. Distant peaks. Endless possibility.', image:'/images/environment-2.jpg'},
  {title:'The Forgotten Crossing', description:'Ancient stone, bamboo, and the passage of time.', image:'/images/environment-3.jpg'},
  {title:'The Hidden Falls', description:'A little wonder, tucked behind the waterfall.', image:'/images/environment-4.jpg'},
  {title:'The Crystal Wastes', description:'The last light meets an electric-blue mystery.', image:'/images/environment-5.jpg'},
];
