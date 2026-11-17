export function portalMarquee(reverse,skills){
  const images=front=>['left','right'].map(side=>`<img class="portal-art ${front?'portal-front ':''}portal-art-${side}" src="images/portal-aperture.png" alt="" aria-hidden="true" loading="lazy"/>`).join('');
  return `<section ${reverse?'':'id="skills"'} class="marquee-section pdf-marquee portal-flow portal-depth ${reverse?'reversed':''}" aria-label="Skills">
    <p class="portal-skills">${skills.join(' · ')}</p><canvas class="portal-stream" aria-hidden="true"></canvas>
    <span class="portal-lip lip-left" aria-hidden="true"></span><span class="portal-lip lip-right" aria-hidden="true"></span>
    ${images(false)}${images(true)}
  </section>`;
}
