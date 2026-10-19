/* Premium still-based Prism journey built on the scroll-world engine. */
mountScrollWorld(document.getElementById('world'), {
  brand: {name:'PRISM',href:'#'},
  cta: {label:'Begin setup',href:'#start'},
  hint: 'Scroll to explore',
  atmosphere: false,
  stillOnly: true,
  diveScroll: 1.26,
  sections: [
    {id:'display',label:'The display',still:'world/assets/display.svg',stillMobile:'world/assets/display-mobile.svg',accent:'#a7e6d0',scroll:1.5,linger:.3,eyebrow:'THE DISPLAY',title:'Make room for intelligence.',body:'A Samsung display becomes a calm, useful surface for the agent you already use.',tags:['One room','Your agent'],cta:{primary:{label:'Begin setup',href:'#start'},secondary:{label:'Explore the journey',href:'#steps'}}},
    {id:'agent',label:'Your agent',still:'world/assets/agent.svg',stillMobile:'world/assets/agent-mobile.svg',accent:'#b5e2d5',eyebrow:'YOUR AGENT',title:'Bring the one you trust.',body:'Connect Grok Bot or Claude through Prism’s remote MCP and anonymous OAuth flow.',tags:['Grok Bot','Claude']},
    {id:'pair',label:'Pair in person',still:'world/assets/pair.svg',stillMobile:'world/assets/pair-mobile.svg',accent:'#d7e8c9',eyebrow:'IN YOUR CONTROL',title:'Approve it at the screen.',body:'A short-lived code gives your agent access to this display, only when you choose.',tags:['In-person approval','Time-limited claims']},
    {id:'publish',label:'In view',still:'world/assets/publish.svg',stillMobile:'world/assets/publish-mobile.svg',accent:'#aedbce',eyebrow:'EVERYDAY UTILITY',title:'See what matters, beautifully.',body:'Let your agent publish rotating information and timely updates where people can see them.',tags:['Live cards','Timely alerts']},
    {id:'voice',label:'Voice',still:'world/assets/voice.svg',stillMobile:'world/assets/voice-mobile.svg',accent:'#bbefd7',scroll:1.5,linger:.3,eyebrow:'A ROOM THAT RESPONDS',title:'Speak naturally. Stay present.',body:'Use the TV’s Grok Voice interface, with a local privacy control always close at hand.',tags:['Voice','Privacy mode'],cta:{primary:{label:'Set up Prism',href:'#start'},secondary:{label:'Agent guide',href:'agent-guide.txt'}}}
  ],
  connectors: []
});

const details=document.getElementById('start');
const journeyControls=[...document.querySelectorAll('.sw-nav,.sw-route,.sw-copylayer')];
function updateWorldVisibility(){
  const past=window.scrollY>details.offsetTop-window.innerHeight*.55;
  document.body.classList.toggle('past-world',past);
  for(const control of journeyControls){control.inert=past;control.setAttribute('aria-hidden',String(past));}
}
window.addEventListener('scroll',updateWorldVisibility,{passive:true});
window.addEventListener('resize',updateWorldVisibility);
updateWorldVisibility();

for(const button of document.querySelectorAll('[data-copy-target]')){
  button.addEventListener('click',async()=>{
    const source=document.getElementById(button.dataset.copyTarget);
    const original=button.innerHTML;
    try{
      await navigator.clipboard.writeText(source.textContent.trim());
      button.textContent='Copied';
      setTimeout(()=>button.innerHTML=original,2200);
    }catch{
      button.textContent='Select and copy';
      setTimeout(()=>button.innerHTML=original,3000);
    }
  });
}
