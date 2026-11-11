/* INAI intro: the kolam draws itself once per visit (Theatre.js core, Apache-2.0). Skippable; skipped for reduced-motion. */
(function(){
var root=document.documentElement;
if(!root.classList.contains('intro-on'))return;
var NS='http://www.w3.org/2000/svg',done=false;
function finish(){
  if(done)return;done=true;
  try{sessionStorage.setItem('inaiIntro','1')}catch(e){}
  var el=document.getElementById('intro');
  if(!el){root.classList.remove('intro-on');return}
  el.classList.add('out');
  setTimeout(function(){root.classList.remove('intro-on');el.remove()},700);
}
function build(){
  var el=document.createElement('div');el.id='intro';el.setAttribute('role','presentation');
  el.innerHTML='<svg viewBox="0 0 400 400" aria-hidden="true"><defs><filter id="ig" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur id="iblur" stdDeviation="0"/></filter></defs><g id="irot" transform="translate(200 185)"><g id="idots"></g><g id="iglow" filter="url(#ig)" opacity="0"><path id="igp" class="iln" style="stroke-width:5"/></g><path id="iloop" class="iln"/></g><text id="iword" x="200" y="348" text-anchor="middle" font-size="30" opacity="0">INAI</text></svg><button type="button" id="iskip">Skip</button>';
  document.body.appendChild(el);
  el.addEventListener('click',finish);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Enter')finish()});
  return el;
}
function run(){
  var core=window.Theatre&&window.Theatre.core;
  if(!core||!core.getProject){finish();return}
  build();
  var getProject=core.getProject,types=core.types;
  var S=56,rows=[1,3,5,3,1],pts=[];
  rows.forEach(function(n,r){for(var i=0;i<n;i++)pts.push([(i-(n-1)/2)*S,(r-2)*S])});
  var dots=document.getElementById('idots');
  pts.forEach(function(p){var c=document.createElementNS(NS,'circle');c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r',3.6);c.setAttribute('class','idot');c.style.opacity=0;dots.appendChild(c)});
  var R=S*1.9,k=S*1.15;
  var d='M0 '+(-R)+' C '+k+' '+(-R*.45)+' '+k+' '+(-R*.2)+' 0 0 C '+(-k)+' '+(-R*.2)+' '+(-k)+' '+(-R*.45)+' 0 '+(-R)+' Z '+
   'M'+R+' 0 C '+(R*.45)+' '+k+' '+(R*.2)+' '+k+' 0 0 C '+(R*.2)+' '+(-k)+' '+(R*.45)+' '+(-k)+' '+R+' 0 Z '+
   'M0 '+R+' C '+(-k)+' '+(R*.45)+' '+(-k)+' '+(R*.2)+' 0 0 C '+k+' '+(R*.2)+' '+k+' '+(R*.45)+' 0 '+R+' Z '+
   'M'+(-R)+' 0 C '+(-R*.45)+' '+(-k)+' '+(-R*.2)+' '+(-k)+' 0 0 C '+(-R*.2)+' '+k+' '+(-R*.45)+' '+k+' '+(-R)+' 0 Z';
  var loop=document.getElementById('iloop'),gp=document.getElementById('igp');
  [loop,gp].forEach(function(p){p.setAttribute('d',d);p.setAttribute('pathLength','1');p.style.strokeDasharray='1 1'});
  var tracks={},idmap={};
  function kf(pos,val,h){return{id:'k'+Math.random().toString(36).slice(2,8),position:pos,connectedRight:true,handles:h||[.4,0,.2,1],type:'bezier',value:val}}
  function track(p,f){var id='t_'+p;tracks[id]={type:'BasicKeyframedTrack',__debugName:'Kolam:["'+p+'"]',keyframes:f};idmap['["'+p+'"]']=id}
  /* shorter than the demo: 4.4 s total */
  track('dots',[kf(0,0),kf(1.0,1)]);
  track('draw',[kf(.7,1),kf(2.8,0,[.45,0,.55,1])]);
  track('glow',[kf(0,0),kf(2.3,0),kf(3,1),kf(4,.2)]);
  track('turn',[kf(0,-12),kf(4,0,[.2,.6,.2,1])]);
  track('word',[kf(3.1,0),kf(4,1)]);
  var state={sheetsById:{Intro:{staticOverrides:{byObject:{}},sequence:{subUnitsPerUnit:30,length:4.6,type:'PositionalSequence',tracksByObject:{Kolam:{trackData:tracks,trackIdByPropPath:idmap}}}}},definitionVersion:'0.4.0',revisionHistory:[]};
  var project=getProject('INAI intro',{state}),sheet=project.sheet('Intro');
  var o=sheet.object('Kolam',{dots:types.number(0),draw:types.number(1),glow:types.number(0),turn:types.number(-12),word:types.number(0)});
  var ds=dots.querySelectorAll('circle'),rot=document.getElementById('irot'),gg=document.getElementById('iglow'),bl=document.getElementById('iblur'),w=document.getElementById('iword');
  o.onValuesChange(function(v){
    ds.forEach(function(c,i){var t=Math.min(1,Math.max(0,v.dots*ds.length*.8-i*.6));c.style.opacity=t;c.setAttribute('r',3.6*(.4+.6*t))});
    loop.style.strokeDashoffset=v.draw;gp.style.strokeDashoffset=v.draw;
    gg.setAttribute('opacity',v.glow*.7);bl.setAttribute('stdDeviation',2+v.glow*5);
    rot.setAttribute('transform','translate(200 185) rotate('+v.turn+')');
    w.setAttribute('opacity',v.word);w.setAttribute('y',348-(1-v.word)*10);
  });
  project.ready.then(function(){
    sheet.sequence.play({iterationCount:1,range:[0,4.6]}).then(function(){setTimeout(finish,250)});
  });
  setTimeout(finish,9000); /* safety net */
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
