import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const script=readFileSync(new URL('../oauth/connect.js',import.meta.url),'utf8');

async function runPage(search){
  const elements=Object.fromEntries(['#connect','#status','#requester'].map(key=>[key,{
    disabled:true,textContent:'',addEventListener(_event,callback){this.click=callback}
  }]));
  const requests=[];
  const redirects=[];
  const replies=[
    {projectUrl:'https://example.supabase.co',anonKey:'public-key'},
    {access_token:'anonymous-session'},
    {client_name:'Grokbot',redirect_uri:'https://grok.com/callback'},
    {redirect_url:'https://grok.com/callback?code=issued'}
  ];
  const context={
    URL,URLSearchParams,JSON,encodeURIComponent,
    document:{querySelector:key=>elements[key]},
    location:{search,replace:url=>redirects.push(url)},
    fetch:async(url,options)=>{
      requests.push({url,options});
      return {ok:true,json:async()=>replies.shift()};
    }
  };
  vm.runInNewContext(script,context);
  await new Promise(resolve=>setImmediate(resolve));
  return {elements,requests,redirects};
}

test('OAuth page keeps the authorization ID and returns to the requesting connector',async()=>{
  const page=await runPage('?authorization_id=one%2Btwo');
  assert.equal(page.elements['#connect'].disabled,false);
  assert.match(page.elements['#requester'].textContent,/Grokbot \(grok.com\)/);
  assert.equal(page.requests[2].url,'https://example.supabase.co/auth/v1/oauth/authorizations/one%2Btwo');
  assert.equal(page.requests[2].options.headers.Authorization,'Bearer anonymous-session');
  await page.elements['#connect'].click();
  assert.equal(page.requests[3].url,'https://example.supabase.co/auth/v1/oauth/authorizations/one%2Btwo/consent');
  assert.deepEqual(page.redirects,['https://grok.com/callback?code=issued']);
});

test('OAuth page does not create a connection without an authorization ID',async()=>{
  const page=await runPage('');
  assert.equal(page.requests.length,0);
  assert.equal(page.elements['#connect'].disabled,true);
  assert.match(page.elements['#status'].textContent,/setup link is incomplete/);
});
