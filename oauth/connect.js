const button=document.querySelector('#connect');
const status=document.querySelector('#status');
const requester=document.querySelector('#requester');
const authorizationId=new URLSearchParams(location.search).get('authorization_id');
const configUrl='https://szjlowelnukjetjzizww.supabase.co/functions/v1/prism-mcp/connect/config';
let base;
let authorizedHeaders;
let alreadyApprovedUrl;

async function readJson(response){
  const data=await response.json();
  if(!response.ok)throw new Error(data.msg||data.message||data.error||'Prism connection request failed.');
  return data;
}

async function prepare(){
  try{
    if(!authorizationId)throw new Error('This setup link is incomplete. Add Prism from your agent’s connector settings and try again.');
    const config=await readJson(await fetch(configUrl));
    base=config.projectUrl+'/auth/v1';
    const headers={'apikey':config.anonKey,'Authorization':'Bearer '+config.anonKey,'Content-Type':'application/json'};
    const session=await readJson(await fetch(base+'/signup',{
      method:'POST',headers,body:JSON.stringify({data:{},gotrue_meta_security:{}})
    }));
    if(!session.access_token)throw new Error('Could not create an anonymous Prism connection.');
    authorizedHeaders={...headers,'Authorization':'Bearer '+session.access_token};
    const details=await readJson(await fetch(base+'/oauth/authorizations/'+encodeURIComponent(authorizationId),{headers:authorizedHeaders}));
    alreadyApprovedUrl=details.redirect_url||null;
    const clientName=String(details.client_name||details.client?.name||'MCP connector');
    const redirect=details.redirect_uri||details.redirect_url;
    let host='';
    try{if(redirect)host=new URL(redirect).hostname}catch{}
    requester.textContent='Requesting app: '+clientName+(host?' ('+host+')':'')+'. Prism display access will be granted to this connector.';
    button.disabled=false;
  }catch(error){
    status.textContent=error?.message||'Could not prepare the Prism connection.';
  }
}

button.addEventListener('click',async()=>{
  button.disabled=true;
  status.textContent='Connecting…';
  try{
    if(alreadyApprovedUrl){location.replace(alreadyApprovedUrl);return}
    const approved=await readJson(await fetch(base+'/oauth/authorizations/'+encodeURIComponent(authorizationId)+'/consent',{
      method:'POST',headers:authorizedHeaders,body:JSON.stringify({action:'approve'})
    }));
    if(!approved.redirect_url)throw new Error('Could not finish the Prism connection.');
    status.textContent='Connected. Returning to your agent…';
    location.replace(approved.redirect_url);
  }catch(error){
    status.textContent=error?.message||'Could not connect to Prism. Please try again.';
    button.disabled=false;
  }
});

void prepare();
