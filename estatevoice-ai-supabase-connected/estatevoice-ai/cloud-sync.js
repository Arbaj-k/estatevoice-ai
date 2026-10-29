/* EstateVoice AI Supabase auth + private workspace sync. No service-role key is used. */
(() => {
  const cfg = window.ESTATEVOICE_SUPABASE || {};
  const $ = id => document.getElementById(id);
  const modal = $('cloudModalBackdrop');
  const msg = $('cloudMessage');
  let client = null, session = null, syncing = false;
  const stateKey = 'estatevoice_ai_v1';
  function say(text, error=false){ if(msg){msg.textContent=text;msg.style.color=error?'#b42318':'#52627a';} }
  function open(){modal.classList.remove('hidden');}
  function close(){modal.classList.add('hidden');}
  function currentState(){try{return JSON.parse(localStorage.getItem(stateKey)||'{}')}catch{return {}}}
  function setStatus(label, text, cls){const b=$('dbStatusBadge'),t=$('dbStatusText'),c=$('cloudBtn');if(b){b.textContent=label;b.className='integration-status '+(cls||'local')}if(t)t.textContent=text;if(c)c.textContent=session?'☁ Cloud connected':'☁ Connect cloud';}
  function showSignedIn(){
    $('cloudAuthForm').classList.toggle('hidden',!!session);
    $('cloudAccountActions').classList.toggle('hidden',!session);
    if(session){$('cloudSignedInAs').textContent='Signed in as '+session.user.email;say('Signed in. You can now sync this browser workspace to your private cloud record.');setStatus('SIGNED IN','Signed in · sync available','demo');$('userAvatar').textContent=(session.user.email||'AD').slice(0,2).toUpperCase();}
    else {setStatus('READY','Configured · sign in to sync','local');$('userAvatar').textContent='AD';}
  }
  async function init(){
    $('cloudBtn').addEventListener('click',open);$('closeCloudModal').addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    if(!window.supabase || !cfg.url || !cfg.publishableKey){setStatus('OFFLINE','Supabase JS/config missing','off');say('Supabase client or configuration could not load.',true);return;}
    client=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    $('cloudAuthForm').addEventListener('submit',async e=>{e.preventDefault();say('Signing in…');const {data,error}=await client.auth.signInWithPassword({email:$('cloudEmail').value.trim(),password:$('cloudPassword').value});if(error){say(error.message,true);return;}session=data.session;showSignedIn();});
    $('cloudSignUp').addEventListener('click',async()=>{say('Creating account…');const {data,error}=await client.auth.signUp({email:$('cloudEmail').value.trim(),password:$('cloudPassword').value});if(error){say(error.message,true);return;}if(data.session){session=data.session;showSignedIn();say('Account created and signed in. Run SQL setup if sync reports a missing table.');}else say('Signup request sent. Check your email for verification, then sign in here.');});
    $('cloudSignOut').addEventListener('click',async()=>{const {error}=await client.auth.signOut();if(error){say(error.message,true);return;}session=null;showSignedIn();say('Signed out. This browser still has its local copy.');});
    $('cloudSyncBtn').addEventListener('click',syncWorkspace);
    const {data,error}=await client.auth.getSession();if(error){say(error.message,true);return;}session=data.session;showSignedIn();
    client.auth.onAuthStateChange((_event,newSession)=>{session=newSession;showSignedIn();});
    if(session) await offerRestore();
  }
  async function offerRestore(){
    const {data,error}=await client.from('estatevoice_workspace_state').select('workspace,updated_at').eq('user_id',session.user.id).maybeSingle();
    if(error){say('Signed in, but database setup is missing or blocked: '+error.message,true);return;}
    if(data && data.workspace){say('Cloud workspace found (updated '+new Date(data.updated_at).toLocaleString()+'). Click Sync only if you want to overwrite cloud data with this browser copy.');setStatus('CLOUD READY','Cloud record found','demo');}
    else say('No cloud workspace exists yet. Click “Sync this browser workspace to cloud” to create one.');
  }
  async function syncWorkspace(){
    if(!session){say('Sign in first.',true);return;} if(syncing)return;syncing=true;$('cloudSyncBtn').disabled=true;say('Syncing workspace securely…');
    try{const payload=currentState();const {error}=await client.from('estatevoice_workspace_state').upsert({user_id:session.user.id,workspace:payload,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;say('Sync successful. Your current browser workspace is saved to this signed-in user’s Supabase record.');setStatus('SYNCED','Cloud sync successful','demo');if(window.showToast)window.showToast('Workspace synced to Supabase.');}
    catch(e){say('Sync failed: '+e.message+'. Check that supabase-schema.sql was run in the correct project and email verification/login is complete.',true);}
    finally{syncing=false;$('cloudSyncBtn').disabled=false;}
  }
  window.addEventListener('DOMContentLoaded',init);
})();
