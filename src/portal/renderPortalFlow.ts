type Mouth={x:number;y:number};
type FlowState={frames:number;left:Mouth;right:Mouth;running:boolean;kind:'depth-path'};
type DebugCanvas=HTMLCanvasElement&{portalFlowState?:FlowState};
export function mountPortalFlow(section:HTMLElement,skills:string[]){
  const candidate=section.querySelector<HTMLCanvasElement>('canvas');if(!candidate)return()=>{};
  const canvas:HTMLCanvasElement=candidate;
  const context=canvas.getContext('2d');if(!context)return()=>{};
  const ctx:CanvasRenderingContext2D=context;
  const state:FlowState={frames:0,left:{x:0,y:0},right:{x:0,y:0},running:false,kind:'depth-path'};
  (canvas as DebugCanvas).portalFlowState=state;
  let width=0,height=0,portalSize=0,fontSize=30,amplitude=40,cycleWidth=1,phase=0,lastTime=0,frame=0,visible=false,disposed=false;
  let glyphs:{char:string;advance:number}[]=[];
  const clamp=(v:number)=>Math.max(0,Math.min(1,v));
  const smooth=(v:number)=>{const n=clamp(v);return n*n*(3-2*n)};
  const reduced=()=>document.documentElement.dataset.motion==='reduced'||(document.documentElement.dataset.motion!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  function measure(){
    width=section.clientWidth;height=section.clientHeight;
    const portals=[...section.querySelectorAll<HTMLImageElement>('.portal-art:not(.portal-front)')].sort((a,b)=>a.offsetLeft-b.offsetLeft);
    if(portals.length!==2)return;
    portalSize=portals[0].clientWidth;
    state.left={x:portals[0].offsetLeft+portalSize*.5,y:height*.5};
    state.right={x:portals[1].offsetLeft+portalSize*.5,y:height*.5};
    const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
    fontSize=width<760?20:30;amplitude=width<760?18:38;
    ctx.font=`400 ${fontSize}px Inter, sans-serif`;
    const bullet=ctx.measureText('•').width;
    const bodyWidth=skills.reduce((sum,skill)=>sum+[...skill].reduce((n,char)=>n+ctx.measureText(char).width+.25,0)+bullet,0);
    const gap=Math.max(fontSize*.8,(width*1.05-bodyWidth)/(skills.length*2));
    glyphs=skills.flatMap(skill=>[...[...skill].map(char=>({char,advance:ctx.measureText(char).width+.25})),{char:' ',advance:gap},{char:'•',advance:bullet},{char:' ',advance:gap}]);
    cycleWidth=glyphs.reduce((sum,glyph)=>sum+glyph.advance,0);
    draw();start();
  }
  function point(t:number,direction:number){
    const span=state.right.x-state.left.x;
    const distance=span*t;
    const z=Math.sin(Math.PI*t)*74;
    const perspective=1000/(1000-z);
    const worldX=state.left.x+distance;
    const worldY=height*.5+Math.sin(Math.PI*2*t)*Math.pow(Math.sin(Math.PI*t),.4)*amplitude*direction;
    const edge=smooth(Math.min(distance,span-distance)/Math.max(30,portalSize*.39));
    return{x:width*.5+(worldX-width*.5)*perspective,y:height*.5+(worldY-height*.5)*perspective,scale:perspective*(.13+.87*edge),edge};
  }
  function rail(direction:number){
    const upper:{x:number;y:number}[]=[],lower:{x:number;y:number}[]=[];
    for(let i=0;i<=100;i++){const p=point(i/100,direction),half=(fontSize*.73)*p.scale;upper.push({x:p.x,y:p.y-half});lower.push({x:p.x,y:p.y+half})}
    ctx.beginPath();upper.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));lower.reverse().forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.fillStyle=document.documentElement.dataset.theme==='light'?'#eee8f580':'#07060ab0';ctx.fill();
    ctx.strokeStyle=document.documentElement.dataset.theme==='light'?'#79638e40':'#b3a5c64d';ctx.lineWidth=.65;ctx.stroke();
  }
  function textRow(row:number){
    const span=state.right.x-state.left.x;
    const direction=row===0?1:-1;
    const sign=(section.classList.contains('reversed')?-1:1)*direction;
    const offset=((phase*sign+cycleWidth*(row ? .47 : 0))%cycleWidth+cycleWidth)%cycleWidth;
    let cursor=-cycleWidth+offset;
    ctx.font=`400 ${fontSize}px Inter, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    const repeats=Math.ceil(span/cycleWidth)+3;
    for(let copy=0;copy<repeats;copy++)for(const glyph of glyphs){
      const centre=cursor+glyph.advance*.5;cursor+=glyph.advance;
      if(centre<=0||centre>=span||glyph.char===' ')continue;
      const t=centre/span,p=point(t,direction),before=point(Math.max(0,t-.001),direction),after=point(Math.min(1,t+.001),direction);
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(after.y-before.y,after.x-before.x));ctx.scale(p.scale,p.scale);
      ctx.globalAlpha=smooth(p.edge*1.3);ctx.fillStyle=document.documentElement.dataset.theme==='light'?(p.edge<.9?'#7833ad':'#24202d'):(p.edge<.9?'#e0baff':'#f4f2f8');
      if(p.edge<.85){ctx.shadowColor='#ba66ff';ctx.shadowBlur=9*(1-p.edge)}
      ctx.fillText(glyph.char,0,0);ctx.restore();
    }
  }
  function draw(){if(disposed||!width||!cycleWidth)return;ctx.clearRect(0,0,width,height);ctx.save();ctx.beginPath();ctx.rect(state.left.x,0,state.right.x-state.left.x,height);ctx.clip();rail(-1);textRow(1);rail(1);textRow(0);ctx.restore();state.frames++}
  function tick(time:number){
    frame=0;if(disposed||!visible||document.hidden||reduced()){state.running=false;return}
    if(lastTime)phase+=Math.min(time-lastTime,50)*cycleWidth/22000;lastTime=time;
    draw();state.running=true;frame=requestAnimationFrame(tick);
  }
  function start(){if(!frame&&!disposed&&visible&&!document.hidden&&!reduced()){lastTime=0;frame=requestAnimationFrame(tick)}}
  function preference(){cancelAnimationFrame(frame);frame=0;lastTime=0;state.running=false;draw();start()}
  const resize=new ResizeObserver(measure);resize.observe(section);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;state.running=false}});intersection.observe(section);
  const motion=new MutationObserver(preference);motion.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion','data-theme']});
  document.addEventListener('visibilitychange',preference);
  document.fonts.ready.then(()=>{if(!disposed)measure()});measure();
  return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();motion.disconnect();document.removeEventListener('visibilitychange',preference);delete (canvas as DebugCanvas).portalFlowState};
}
