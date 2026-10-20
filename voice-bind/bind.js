const api='https://szjlowelnukjetjzizww.supabase.co/functions/v1/prism-voice-bind';
const form=document.querySelector('#form');
const submit=document.querySelector('#submit');
const status=document.querySelector('#status');
const display=document.querySelector('#display');
const parts=location.hash.slice(1).split('.');
history.replaceState(null,'',location.pathname);
const id=parts[0];
let invite=parts[1];
let needsPresence=false;
let needsVoiceButton=false;

async function call(action,extra={}){
  const response=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,id,invite,...extra})});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||'Prism Voice binding is unavailable.');
  return result;
}

function beacon(prefix){
  const uuid=document.querySelector('#'+prefix+'Uuid').value.trim();
  const major=Number(document.querySelector('#'+prefix+'Major').value);
  const minor=Number(document.querySelector('#'+prefix+'Minor').value);
  if(!uuid||!Number.isInteger(major)||!Number.isInteger(minor))throw new Error('Enter the complete beacon identity.');
  return {uuid,major,minor};
}

async function prepare(){
  try{
    if(!/^[0-9a-f-]{36}$/i.test(id)||!/^[0-9a-f]{64}$/.test(invite||''))throw new Error('This link is incomplete. Ask your agent for a new Voice binding link.');
    const info=await call('inspect');
    display.textContent='Display: '+info.displayName;
    needsPresence=info.presenceBeaconConfigured;
    needsVoiceButton=info.voiceButtonConfigured;
    for(const [name,needed] of [['presence',needsPresence],['voiceButton',needsVoiceButton]]){
      document.querySelector('#'+name).hidden=!needed;
      document.querySelector('#'+name+'Note').hidden=!needed;
      if(needed)for(const field of document.querySelectorAll('#'+name+' input'))field.required=true;
    }
    if(!info.ready)throw new Error('The TV is offline or its live channel is unavailable. Ask your agent for a new link after it reconnects.');
    submit.disabled=false;
  }catch(error){status.textContent=error.message||'Could not open this binding link.'}
}

form.addEventListener('submit',async event=>{
  event.preventDefault();
  submit.disabled=true;
  status.textContent='Sending to TV…';
  try{
    const result=await call('bind',{
      webhookUrl:document.querySelector('#webhookUrl').value.trim(),
      webhookKey:document.querySelector('#webhookKey').value,
      ...(needsPresence?{presenceBeacon:beacon('presence')}:{}),
      ...(needsVoiceButton?{voiceButtonBeacon:beacon('voiceButton')}:{})
    });
    invite='';
    form.reset();
    form.hidden=true;
    status.textContent='Binding sent to '+result.displayName+'. Ask your agent to check the TV’s Voice status and try a Voice handoff.';
  }catch(error){
    status.textContent=error.message||'Could not bind Voice. Please try again.';
    submit.disabled=false;
  }
});

void prepare();
