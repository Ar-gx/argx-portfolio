import {ArrowUp,Github,Linkedin,Mail} from 'lucide-react';
import {createElement} from 'react';
import {portfolio} from '../data/portfolio';

export default function Contact(){
  const contacts=[
    {name:'Email',url:portfolio.contacts.email?`mailto:${portfolio.contacts.email}`:'',icon:Mail},
    {name:'GitHub',url:portfolio.contacts.github,icon:Github},
    {name:'LinkedIn',url:portfolio.contacts.linkedin,icon:Linkedin},
  ];

  return <>
    <section id="contact" className="contact-beacon" aria-labelledby="contact-title">
      {createElement('contact-beacon-art', {'aria-hidden':true})}
      <div className="beacon-copy">
        <h2 id="contact-title">Let’s build something cool.</h2>
        <div className="beacon-links">{contacts.map(({name,url,icon:Icon})=>url
          ? <a key={name} href={url} target={name==='Email'?undefined:'_blank'} rel="noopener noreferrer"><Icon size={21} aria-hidden="true"/>{name}</a>
          : <span key={name}><Icon size={21} aria-hidden="true"/>{name} <small>Coming soon</small></span>
        )}</div>
      </div>
    </section>
    <footer><a className="logo" href="#home">A<span>.</span></a><span>© {new Date().getFullYear()} {portfolio.name}</span><p>Built with curiosity and a little bit of chaos.</p><a href="#home">Back to top <ArrowUp size={16}/></a></footer>
  </>;
}
