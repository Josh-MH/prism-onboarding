import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const script=readFileSync(new URL('../voice-bind/bind.js',import.meta.url),'utf8');
const id='00000000-0000-4000-8000-000000000001';
const invite='a'.repeat(64);

async function page(hash){
  const elements=Object.fromEntries([
    '#form','#submit','#status','#display','#webhookUrl','#webhookKey',
    '#presence','#presenceNote','#voiceButton','#voiceButtonNote'
  ].map(key=>[key,{hidden:false,disabled:true,value:'',textContent:'',addEventListener(_event,handler){this.submit=handler},reset(){this.resetCalled=true}}]));
  elements['#webhookUrl'].value='https://hooks.example.com/voice';
  elements['#webhookKey'].value='private-test-bearer-key';
  const requests=[];
  const historyCalls=[];
  const context={
    URL,JSON,Number,
    location:{hash,pathname:'/prism-onboarding/voice-bind/'},
    history:{replaceState:(...args)=>historyCalls.push(args)},
    document:{querySelector:key=>elements[key],querySelectorAll:()=>[]},
    fetch:async(url,options)=>{
      requests.push({url,body:JSON.parse(options.body)});
      return {ok:true,json:async()=>requests.length===1?
        {displayName:'Joe Burrage Office',ready:true,presenceBeaconConfigured:false,voiceButtonConfigured:false}:
        {sent:true,displayName:'Joe Burrage Office'}};
    }
  };
  vm.runInNewContext(script,context);
  await new Promise(resolve=>setImmediate(resolve));
  return {elements,requests,historyCalls};
}

test('private link is removed from the address bar and secrets are submitted only in POST body',async()=>{
  const p=await page('#'+id+'.'+invite);
  assert.equal(p.historyCalls[0][2],'/prism-onboarding/voice-bind/');
  assert.equal(p.requests[0].body.action,'inspect');
  assert.equal(p.elements['#submit'].disabled,false);
  await p.elements['#form'].submit({preventDefault(){}});
  assert.equal(p.requests[1].url,'https://szjlowelnukjetjzizww.supabase.co/functions/v1/prism-voice-bind');
  assert.equal(p.requests[1].body.webhookKey,'private-test-bearer-key');
  assert.equal(p.elements['#form'].hidden,true);
  assert.equal(p.elements['#form'].resetCalled,true);
});

test('invalid link cannot inspect or submit',async()=>{
  const p=await page('#invalid');
  assert.equal(p.requests.length,0);
  assert.equal(p.elements['#submit'].disabled,true);
  assert.match(p.elements['#status'].textContent,/incomplete/);
});
