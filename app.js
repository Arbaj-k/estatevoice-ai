const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "estatevoice_ai_v1";
const initialLeads = [
 {id:"L-1001",name:"Rahul Sharma",phone:"+91 90000 00001",budget:"₹60–75 lakh",location:"Jaipur West",type:"Apartment",status:"Hot",permission:"yes",timeline:"Within 3 months",notes:"Wants 3 BHK, prefers weekend visit.",lastContact:"Today"},
 {id:"L-1002",name:"Priya Verma",phone:"+91 90000 00002",budget:"₹45–55 lakh",location:"Ajmer Road",type:"Apartment",status:"Warm",permission:"yes",timeline:"3–6 months",notes:"Asked about amenities.",lastContact:"Yesterday"},
 {id:"L-1003",name:"Aman Gupta",phone:"+91 90000 00003",budget:"₹30–40 lakh",location:"Jagatpura",type:"Plot",status:"New",permission:"unknown",timeline:"Not sure",notes:"Imported from builder sample sheet.",lastContact:"—"},
 {id:"L-1004",name:"Neha Singh",phone:"+91 90000 00004",budget:"₹80 lakh–1 crore",location:"Vaishali Nagar",type:"Villa",status:"Callback",permission:"yes",timeline:"Within 1 month",notes:"Requested a callback after 6 PM.",lastContact:"Oct 27, 2026"},
 {id:"L-1005",name:"Vikram Mehta",phone:"+91 90000 00005",budget:"₹50–60 lakh",location:"Tonk Road",type:"Apartment",status:"Cold",permission:"yes",timeline:"6+ months",notes:"Early-stage research.",lastContact:"Oct 26, 2026"},
 {id:"L-1006",name:"Sana Khan",phone:"+91 90000 00006",budget:"₹70–85 lakh",location:"Jaipur South",type:"Apartment",status:"Warm",permission:"yes",timeline:"Within 3 months",notes:"Needs parking information.",lastContact:"Oct 25, 2026"},
 {id:"L-1007",name:"Karan Joshi",phone:"+91 90000 00007",budget:"₹25–35 lakh",location:"Sanganer",type:"Plot",status:"Not Interested",permission:"no",timeline:"—",notes:"Asked not to be contacted again.",lastContact:"Oct 24, 2026"},
 {id:"L-1008",name:"Meera Jain",phone:"+91 90000 00008",budget:"₹90 lakh+",location:"Civil Lines",type:"Apartment",status:"New",permission:"unknown",timeline:"Within 6 months",notes:"No details confirmed yet.",lastContact:"—"}
];
const initialProperties = [
 {id:"P-1",name:"Acme Heights",builder:"Acme Realty",location:"Jaipur West",price:"₹60–85 lakh (sample)",types:"2 BHK, 3 BHK apartments",rera:"Not entered",possession:"Not verified",verified:"",amenities:"Clubhouse, parking — verify with builder before use.",faq:"Demo sample project only. Replace every field with builder-approved facts before real use."}
];
const initialCalls = [
 {id:"C-1001",leadId:"L-1001",leadName:"Rahul Sharma",date:"Oct 28, 2026",duration:"2m 14s",outcome:"Hot",summary:"Asked about a 3 BHK within ₹75 lakh and weekend site visit.",next:"Sales team to confirm project availability and visit slot.",simulated:true},
 {id:"C-1002",leadId:"L-1002",leadName:"Priya Verma",date:"Oct 28, 2026",duration:"1m 48s",outcome:"Warm",summary:"Interested but needs amenities and floor plan details.",next:"Share verified brochure through sales team.",simulated:true},
 {id:"C-1003",leadId:"L-1004",leadName:"Neha Singh",date:"Oct 27, 2026",duration:"1m 02s",outcome:"Callback",summary:"Requested a callback after 6 PM.",next:"Human sales callback during approved business hours.",simulated:true}
];
let state = loadState();
function loadState(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));if(x)return {...x,leads:x.leads||initialLeads,properties:x.properties||initialProperties,calls:x.calls||initialCalls,settings:x.settings||{builderName:"Acme Realty",handoffContact:"",businessHours:"Mon–Sat, 10:00 AM – 6:00 PM",aiTone:"Friendly and professional Hinglish"}};}catch(e){}return {leads:structuredClone(initialLeads),properties:structuredClone(initialProperties),calls:structuredClone(initialCalls),settings:{builderName:"Acme Realty",handoffContact:"",businessHours:"Mon–Sat, 10:00 AM – 6:00 PM",aiTone:"Friendly and professional Hinglish"},dismissed:false};}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));renderAll();}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function initials(name){return String(name||"?").split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();}
function slug(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}
function badge(status){return `<span class="badge badge-${slug(status)}">${escapeHtml(status)}</span>`;}
function showToast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),3000);}
function go(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("crumb").textContent=({overview:"Overview",leads:"Leads",campaigns:"Campaigns",calls:"Call history",properties:"Property knowledge",settings:"Settings"})[page]||page;document.querySelector(".sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.goto)));
$("mobileMenu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("helpBtn").addEventListener("click",()=>showToast("Demo mode only: no real calls are placed."));
$("dismissBanner").addEventListener("click",()=>{$("dismissBanner").closest(".banner").remove();state.dismissed=true;persistOnly();});
function persistOnly(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
if(state.dismissed){const b=document.querySelector(".banner");if(b)b.remove();}

function renderFollowupQueue(){
 const rows=state.leads.filter(l=>l.status!=="Do Not Call"&&l.status!=="Not Interested"&&(l.callbackRequested==="yes"||l.visitRequested==="yes"||l.status==="Callback"));
 const body=$("followupQueue"),empty=$("followupEmpty");if(!body)return;
 if(empty)empty.classList.toggle("hidden",rows.length>0);
 body.innerHTML=rows.map(l=>{
  const tasks=[];
  if(l.callbackRequested==="yes"||l.status==="Callback")tasks.push("Sales callback");
  if(l.visitRequested==="yes")tasks.push("Site visit");
  const req=[l.type,l.area,l.location,l.budget].filter(Boolean).join(" · ");
  const permission=l.permission==="yes"?"Permission verified":l.permission==="no"?"No permission / opt-out":"Permission unverified";
  return `<tr><td><b>${escapeHtml(l.name)}</b><small style="display:block">${escapeHtml(l.phone)}</small></td><td>${escapeHtml(req||"Requirements incomplete")}</td><td>${escapeHtml(tasks.join(" + ")||"Callback follow-up")}</td><td>${escapeHtml(permission)}</td><td><button class="mini-btn" data-followup-done="${escapeHtml(l.id)}">Mark reviewed</button></td></tr>`;
 }).join("");
 body.querySelectorAll("[data-followup-done]").forEach(b=>b.addEventListener("click",()=>{
  const lead=state.leads.find(x=>x.id===b.dataset.followupDone);if(!lead)return;
  lead.callbackRequested="reviewed";lead.visitRequested="reviewed";if(lead.status==="Callback")lead.status="Warm";
  lead.notes=(lead.notes?lead.notes+" | ":"")+"Follow-up reviewed by sales team on "+new Date().toLocaleDateString("en-IN");
  save();showToast("Follow-up marked reviewed. No call was placed.");
 }));
}
function renderOverview(){
 $("statLeads").textContent=state.leads.length;
 $("navLeadCount").textContent=state.leads.length;
 $("statCalls").textContent=state.calls.length;
 $("statHot").textContent=state.leads.filter(l=>["Hot","Warm"].includes(l.status)).length;
 $("statVisits").textContent=state.calls.filter(c=>/visit/i.test(c.next||"")||/site visit/i.test(c.summary||"")).length;
 const order=["Hot","Warm","Cold","New","Callback","Not Interested","Do Not Call"];
 const colors={Hot:"#e66a73",Warm:"#e6ad4c",Cold:"#7794ef",New:"#a9b3c4",Callback:"#9b7ad9","Not Interested":"#9da7b6","Do Not Call":"#b7bdc8"};
 const counts=order.map(s=>({s,n:state.leads.filter(l=>l.status===s).length}));
 const max=Math.max(1,...counts.map(x=>x.n));
 $("pipeline").innerHTML=counts.map(x=>`<div class="pipeline-row"><span class="pipeline-name">${x.s}</span><div class="pipeline-track"><div class="pipeline-fill" style="width:${x.n/max*100}%;background:${colors[x.s]}"></div></div><b class="pipeline-count">${x.n}</b></div>`).join("");
 $("recentActivity").innerHTML=state.calls.slice(0,4).map(c=>`<div class="activity-item"><div class="activity-icon">◉</div><div><b>${escapeHtml(c.leadName)} · ${escapeHtml(c.outcome)}</b><p>${escapeHtml(c.summary)}</p><time>${escapeHtml(c.date)} · Simulated call</time></div></div>`).join("")||`<div class="empty-state">No activity yet. Run a demo call to get started.</div>`;
 const done=[true,state.properties.length>0,state.leads.length>0,state.calls.length>0].filter(Boolean).length;
 $("progressLabel").textContent=`${done} of 4 complete`;
 $("progressBar").style.width=(done/4*100)+"%";
 document.querySelectorAll(".step").forEach((s,i)=>{const isDone=[true,state.properties.length>0,state.leads.length>0,state.calls.length>0][i];s.classList.toggle("done",isDone);s.querySelector("span").textContent=isDone?"✓":String(i+1);});
}
function renderLeads(){
 const query=($("leadSearch").value||"").toLowerCase(),filter=$("leadStatusFilter").value;
 const rows=state.leads.filter(l=>(filter==="all"||l.status===filter)&&[l.name,l.phone,l.location,l.budget,l.type,l.area,l.purpose].some(v=>String(v||"").toLowerCase().includes(query)));
 $("leadResults").textContent=`${rows.length} lead${rows.length===1?"":"s"}`;
 $("leadEmpty").classList.toggle("hidden",rows.length>0);
 $("leadsTable").innerHTML=rows.map(l=>`<tr><td><div class="lead-cell"><div class="lead-avatar">${escapeHtml(initials(l.name))}</div><div><b>${escapeHtml(l.name)}</b><small>${escapeHtml(l.phone)}</small></div></div></td><td><div class="requirement"><b>${escapeHtml(l.budget||"Budget not set")}</b><small>${escapeHtml(l.location||"Location not set")} · ${escapeHtml(l.type||"Type unknown")}</small></div></td><td>${badge(l.status)}</td><td><span class="permission ${l.permission}">${l.permission==="yes"?"✓ Permission verified":l.permission==="no"?"⊘ Opt-out / no permission":"! Not verified"}</span></td><td>${escapeHtml(l.lastContact||"—")}</td><td><div class="row-actions"><button class="mini-btn" data-edit-lead="${l.id}">Edit</button><button class="mini-btn" data-demo-lead="${l.id}">Demo</button></div></td></tr>`).join("");
 document.querySelectorAll("[data-edit-lead]").forEach(b=>b.addEventListener("click",()=>openLeadModal(b.dataset.editLead)));
 document.querySelectorAll("[data-demo-lead]").forEach(b=>b.addEventListener("click",()=>{go("campaigns");$("demoLead").value=b.dataset.demoLead;runDemo();}));
}
$("leadSearch").addEventListener("input",renderLeads);$("leadStatusFilter").addEventListener("change",renderLeads);
function renderCalls(){
 const q=($("callSearch").value||"").toLowerCase(),filter=$("callFilter").value;
 const rows=state.calls.filter(c=>(filter==="all"||c.outcome===filter)&&[c.leadName,c.summary,c.next].some(v=>String(v||"").toLowerCase().includes(q)));
 $("callsEmpty").classList.toggle("hidden",rows.length>0);
 $("callsTable").innerHTML=rows.map(c=>`<tr><td><div class="lead-cell"><div class="lead-avatar">${escapeHtml(initials(c.leadName))}</div><div><b>${escapeHtml(c.leadName)}</b><small>${escapeHtml(c.leadId||"")}</small></div></div></td><td>${escapeHtml(c.date)}</td><td>${escapeHtml(c.duration)}</td><td>${badge(c.outcome)}</td><td><div class="call-summary-line">${escapeHtml(c.summary)}<br><small style="color:#9aa4b4">Next: ${escapeHtml(c.next)}</small></div></td><td><button class="mini-btn" data-view-call="${c.id}">Details</button></td></tr>`).join("");
 document.querySelectorAll("[data-view-call]").forEach(b=>b.addEventListener("click",()=>{const c=state.calls.find(x=>x.id===b.dataset.viewCall);showToast(`${c.leadName}: ${c.summary}`);}));
}
$("callSearch").addEventListener("input",renderCalls);$("callFilter").addEventListener("change",renderCalls);
function renderProperties(){
 $("propertyCards").innerHTML=state.properties.map(p=>`<article class="property-card"><div class="property-top"><div class="property-icon">⌂</div><div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.builder||state.settings.builderName)} · ${escapeHtml(p.location||"Location not set")}</p></div><div class="property-actions"><button class="mini-btn" data-edit-property="${p.id}">Edit</button><button class="mini-btn" data-delete-property="${p.id}">×</button></div></div><dl><dt>Price range</dt><dd>${escapeHtml(p.price||"Not verified")}</dd><dt>Configurations</dt><dd>${escapeHtml(p.types||"Not entered")}</dd><dt>RERA ID</dt><dd>${escapeHtml(p.rera||"Not verified")}</dd><dt>Possession</dt><dd>${escapeHtml(p.possession||"Not verified")}</dd></dl><div class="property-facts">${escapeHtml([p.amenities,p.faq].filter(Boolean).join("\n\n")||"No approved facts entered yet.")}</div><div class="verified-label">${p.verified?"Last verified "+escapeHtml(p.verified):"Verification date not recorded"}</div></article>`).join("")||`<div class="panel empty-state">No projects added yet. Add a builder-approved project to test the demo.</div>`;
 document.querySelectorAll("[data-edit-property]").forEach(b=>b.addEventListener("click",()=>openPropertyModal(b.dataset.editProperty)));
 document.querySelectorAll("[data-delete-property]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Delete this project from local demo data?")){state.properties=state.properties.filter(p=>p.id!==b.dataset.deleteProperty);save();showToast("Project deleted.");}}));
}
function fillSelects(){
 const oldLead=$("demoLead").value,oldProp=$("demoProperty").value;
 $("demoLead").innerHTML=state.leads.map(l=>`<option value="${l.id}" ${l.status==="Do Not Call"||l.permission!=="yes"?"disabled":""}>${escapeHtml(l.name)} — ${escapeHtml(l.status)}${l.permission!=="yes"?" (not cleared for demo) ":""}</option>`).join("");
 if(state.leads.some(l=>l.id===oldLead&&l.permission==="yes"&&l.status!=="Do Not Call"))$("demoLead").value=oldLead;
 $("demoProperty").innerHTML=state.properties.map(p=>`<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")||`<option value="">No project — add one first</option>`;
 if(state.properties.some(p=>p.id===oldProp))$("demoProperty").value=oldProp;
}
function renderBranding(){
 const name=(state.settings.builderName||"Builder workspace").trim()||"Builder workspace";
 const label=$("workspaceName"),initial=$("workspaceInitial"),title=document.querySelector("#page-overview h1");
 if(label)label.textContent=name;
 if(initial)initial.textContent=initials(name).slice(0,1);
 if(title)title.innerHTML=escapeHtml(name)+' <span class="wave">✦</span>';
 document.title="EstateVoice AI — "+name;
}
function renderCallSettings(){
 const s=state.settings.callSettings||{};
 if($("callLanguage"))$("callLanguage").value=s.language||"Hinglish";
 if($("callWindow"))$("callWindow").value=s.window||"Mon–Sat, 10 AM–6 PM";
 if($("callMaxAttempts"))$("callMaxAttempts").value=String(s.maxAttempts||1);
 if($("callRetryGap"))$("callRetryGap").value=String(s.retryGap||24);
 if($("callOpeningScript"))$("callOpeningScript").value=s.openingScript||"Namaste, main {{builder}} ki virtual assistant hoon. Kya abhi do minute baat karna convenient hai?";
 if($("callRequirePermission"))$("callRequirePermission").checked=s.requirePermission!==false;
}
function renderAll(){renderBranding();renderFollowupQueue();renderOverview();renderLeads();renderCalls();renderProperties();fillSelects();$("builderName").value=state.settings.builderName||"";$("handoffContact").value=state.settings.handoffContact||"";$("businessHours").value=state.settings.businessHours||"";$("aiTone").value=state.settings.aiTone||"Friendly and professional Hinglish";renderCallSettings();renderCallingIntegration();}
function openLeadModal(id){const l=state.leads.find(x=>x.id===id);$("leadForm").reset();$("leadId").value=l?.id||"";$("modalTitle").textContent=l?"Edit lead":"Add lead";$("modalSubtitle").textContent="Enter the builder’s existing lead details.";if(l){$("leadName").value=l.name;$("leadPhone").value=l.phone;$("leadBudget").value=l.budget||"";$("leadLocation").value=l.location||"";$("leadType").value=l.type||"Shop";if($("leadArea"))$("leadArea").value=l.area||"";if($("leadPurpose"))$("leadPurpose").value=l.purpose||"Not specified";if($("leadCallback"))$("leadCallback").value=l.callbackRequested||"unknown";if($("leadVisit"))$("leadVisit").value=l.visitRequested||"unknown";$("leadStatus").value=l.status||"New";$("leadPermission").value=l.permission||"unknown";$("leadTimeline").value=l.timeline||"";$("leadNotes").value=l.notes||"";} $("modalBackdrop").classList.remove("hidden");}
function closeLeadModal(){$("modalBackdrop").classList.add("hidden");}
$("addLeadBtn").addEventListener("click",()=>openLeadModal());$("closeModal").addEventListener("click",closeLeadModal);$("cancelModal").addEventListener("click",closeLeadModal);
$("leadForm").addEventListener("submit",e=>{e.preventDefault();const id=$("leadId").value||"L-"+Date.now().toString().slice(-6),phone=$("leadPhone").value.trim();const duplicate=state.leads.find(l=>l.phone.replace(/\D/g,"")===phone.replace(/\D/g,"")&&l.id!==id);if(duplicate){showToast("This phone number already exists in your lead list.");return;}const l={id,name:$("leadName").value.trim(),phone,budget:$("leadBudget").value.trim(),location:$("leadLocation").value.trim(),type:$("leadType").value,area:$("leadArea")?.value.trim()||"",purpose:$("leadPurpose")?.value||"Not specified",callbackRequested:$("leadCallback")?.value||"unknown",visitRequested:$("leadVisit")?.value||"unknown",area:$("leadArea")?.value.trim()||"",purpose:$("leadPurpose")?.value||"Not specified",callbackRequested:$("leadCallback")?.value||"unknown",visitRequested:$("leadVisit")?.value||"unknown",status:$("leadStatus").value,permission:$("leadPermission").value,timeline:$("leadTimeline").value.trim(),notes:$("leadNotes").value.trim(),lastContact:state.leads.find(x=>x.id===id)?.lastContact||"—"};const ix=state.leads.findIndex(x=>x.id===id);if(ix>=0)state.leads[ix]=l;else state.leads.unshift(l);save();closeLeadModal();showToast(ix>=0?"Lead updated.":"Lead added.");});
$("downloadTemplate").addEventListener("click",()=>download("estatevoice-leads-template.csv","name,phone,budget,location,type,status,permission,timeline,notes\nRahul Sharma,+91 90000 00001,₹60-75 lakh,Jaipur West,Apartment,New,yes,Within 3 months,Only import leads with permission"));
function download(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/csv;charset=utf-8;"}));a.download=name;a.click();URL.revokeObjectURL(a.href);}
function parseCSV(text){const rows=[];let row=[],cell="",quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'&&quoted&&text[i+1]==='"'){cell+='"';i++;}else if(c==='"'){quoted=!quoted;}else if(c===","&&!quoted){row.push(cell);cell="";}else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&text[i+1]==="\n")i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell="";}else cell+=c;}if(cell.length||row.length){row.push(cell);rows.push(row);}return rows;}
$("csvImport").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const rows=parseCSV(await f.text());if(rows.length<2)throw new Error("CSV needs a header row and at least one lead.");const headers=rows.shift().map(h=>h.trim().toLowerCase().replace(/[^a-z0-9]/g,""));const aliases={name:["name","fullname","leadname","customername"],phone:["phone","mobile","mobilenumber","phonenumber"],budget:["budget","budgetrange"],location:["location","preferredlocation","city"],type:["type","propertytype"],status:["status","leadstatus"],permission:["permission","consent","callingpermission"],timeline:["timeline","purchasetimeline"],notes:["notes","requirements","remarks"]};const index={};for(const key in aliases)index[key]=headers.findIndex(h=>aliases[key].includes(h));if(index.name<0||index.phone<0)throw new Error("CSV must contain name and phone columns.");let added=0,skipped=0;for(const r of rows){const get=k=>index[k]>=0?(r[index[k]]||"").trim():"";const name=get("name"),phone=get("phone");if(!name||!phone||state.leads.some(l=>l.phone.replace(/\D/g,"")===phone.replace(/\D/g,""))){skipped++;continue;}const rawPerm=get("permission").toLowerCase();state.leads.push({id:"L-"+Date.now().toString().slice(-5)+"-"+added,name,phone,budget:get("budget"),location:get("location"),type:get("type")||"Not sure",status:["New","Hot","Warm","Cold","Callback","Not Interested","Do Not Call"].includes(get("status"))?get("status"):"New",permission:["yes","true","verified","consent"].includes(rawPerm)?"yes":["no","false","optout","do not call"].includes(rawPerm)?"no":"unknown",timeline:get("timeline"),notes:get("notes"),lastContact:"—"});added++;}save();showToast(`Imported ${added} lead(s). Skipped ${skipped} duplicate/invalid row(s). Check permission before outreach.`);}catch(err){showToast(err.message||"Could not read CSV file.");}e.target.value="";});
function openPropertyModal(id){const p=state.properties.find(x=>x.id===id);$("propertyForm").reset();$("propertyId").value=p?.id||"";$("propertyModalTitle").textContent=p?"Edit project":"Add project";if(p){$("propertyName").value=p.name;$("propertyBuilder").value=p.builder||"";$("propertyLocation").value=p.location||"";$("propertyPrice").value=p.price||"";$("propertyTypes").value=p.types||"";$("propertyRera").value=p.rera||"";$("propertyPossession").value=p.possession||"";$("propertyVerified").value=p.verified||"";$("propertyAmenities").value=p.amenities||"";$("propertyFaq").value=p.faq||"";}else{$("propertyBuilder").value=state.settings.builderName||"";} $("propertyModalBackdrop").classList.remove("hidden");}
function closePropertyModal(){$("propertyModalBackdrop").classList.add("hidden");}
$("addPropertyBtn").addEventListener("click",()=>openPropertyModal());$("closePropertyModal").addEventListener("click",closePropertyModal);$("cancelPropertyModal").addEventListener("click",closePropertyModal);
$("propertyForm").addEventListener("submit",e=>{e.preventDefault();const id=$("propertyId").value||"P-"+Date.now().toString().slice(-6);const p={id,name:$("propertyName").value.trim(),builder:$("propertyBuilder").value.trim(),location:$("propertyLocation").value.trim(),price:$("propertyPrice").value.trim(),types:$("propertyTypes").value.trim(),rera:$("propertyRera").value.trim(),possession:$("propertyPossession").value.trim(),verified:$("propertyVerified").value,amenities:$("propertyAmenities").value.trim(),faq:$("propertyFaq").value.trim()};const ix=state.properties.findIndex(x=>x.id===id);if(ix>=0)state.properties[ix]=p;else state.properties.unshift(p);save();closePropertyModal();showToast("Project facts saved in this browser.");});
function say(role,text){return `<div class="chat-line ${role==="customer"?"customer":"ai"}"><div class="chat-icon">${role==="customer"?"C":"AI"}</div><div class="bubble"><small>${role==="customer"?"CUSTOMER":"ESTATEVOICE AI · SIMULATED"}</small>${escapeHtml(text)}</div></div>`;}
function runDemo(){
 const lead=state.leads.find(l=>l.id===$("demoLead").value),prop=state.properties.find(p=>p.id===$("demoProperty").value);if(!lead){showToast("Add a lead first.");return;}if(lead.permission!=="yes"||lead.status==="Do Not Call"||lead.status==="Not Interested"){showToast("This lead is not cleared for outreach. Verify permission and opt-out status first.");return;}
 if(!prop){showToast("Add a project with verified facts first.");return;}
 $("simState").textContent="Simulation complete";
 const purpose=$("callPurpose").value,open=$("openingLine").value.trim()||"Hello, main AI assistant hoon. Kya abhi baat karna convenient hai?";
 const budget=lead.budget||"budget not confirmed",location=lead.location||"preferred location not confirmed",type=lead.type||"commercial property type not confirmed",area=lead.area||"required area not confirmed",purpose=lead.purpose||"purpose not specified";
 let convo=[["ai",open],["customer","Haan, abhi baat kar sakte hain."],["ai",`Thank you, ${lead.name.split(" ")[0]}. Main aapki commercial property requirements confirm karna chahti hoon: budget ${budget}, location ${location}, property type ${type}, area ${area}, aur purpose ${purpose}. Kya ye broadly sahi hai?`],["customer","Haan, ye broadly sahi hai. Project ke baare mein bataiye."],["ai",`Project ${prop.name} ke liye mere paas ye recorded information hai: location ${prop.location||"abhi verified nahi hai"}, price range ${prop.price||"abhi verified nahi hai"}, configurations ${prop.types||"abhi verified nahi hain"}. Main unverified details confirm nahi karungi.`]];
 let outcome="Warm",summary=`Customer requirements noted: ${budget}, ${location}, ${type}.`,next="Sales team to verify availability and answer any unanswered questions.";
 if(purpose==="visit"){convo.push(["customer","Kya main site visit kar sakta/sakti hoon?"]);convo.push(["ai","Bilkul, main aapki site visit request sales team ko forward karne ke liye note kar rahi hoon. Team available slot confirm karegi."]);outcome="Hot";summary="Customer requested a site visit; schedule is not confirmed.";next="Human sales team must confirm the visit date and availability.";}
 else if(purpose==="callback"){convo.push(["customer","Mujhe baad mein sales person se baat karni hai."]);convo.push(["ai","Sure, main callback request note kar rahi hoon. Sales team aapse approved business hours mein contact karegi."]);outcome="Callback";summary="Customer requested a human sales callback.";next="Sales team to confirm a suitable callback time.";}
 else if(purpose==="project"){convo.push(["customer","Amenities aur current availability confirm hain?"]);convo.push(["ai",`Mere saved facts mein amenities: ${prop.amenities||"not verified"}. Current availability ki confirmation mere paas nahi hai. Main sales team se confirm karwane ka request note kar sakti hoon.`]);outcome="Warm";summary="Customer wants project amenities and current availability confirmed.";next="Sales team to verify current inventory and approved amenities.";}
 else {convo.push(["customer","Main options compare kar raha/rahi hoon, thoda time chahiye."]);convo.push(["ai","Samajh gayi. Main aapki requirements note kar rahi hoon. Aapki permission ke bina main repeated calls nahi karungi; agar aap chahein toh sales team se details mangwa sakte hain."]);outcome=lead.status==="Hot"?"Hot":"Warm";summary=`Commercial lead qualified at a high level; budget ${budget}, location ${location}, property ${type}, area ${area}, purpose ${purpose}.`;next="Sales team to send verified details and follow up only as permitted.";}
 const now=new Date();const date=now.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
 const call={id:"C-"+Date.now().toString().slice(-6),leadId:lead.id,leadName:lead.name,date,duration:`${Math.floor(1+Math.random()*2)}m ${String(Math.floor(Math.random()*60)).padStart(2,"0")}s`,outcome,summary,next,simulated:true,transcript:convo};
 state.calls.unshift(call);lead.status=outcome;lead.lastContact="Demo just now";lead.notes=(lead.notes?lead.notes+" | ":"")+`Demo: ${summary}`;save();
 $("transcript").innerHTML=convo.map(([r,t])=>say(r,t)).join("")+`<div class="call-summary"><h3>✦ Demo call summary</h3><p><b>Outcome:</b> ${escapeHtml(outcome)}</p><p><b>Requirements:</b> ${escapeHtml(budget)} · ${escapeHtml(location)} · ${escapeHtml(type)}</p><p><b>Summary:</b> ${escapeHtml(summary)}</p><p><b>Next action:</b> ${escapeHtml(next)}</p><p><b>Important:</b> This was a simulated text conversation, not a real call.</p></div>`;
 $("transcript").scrollTop=$("transcript").scrollHeight;showToast("Simulated call complete. No real call was placed.");
}
$("runDemo").addEventListener("click",runDemo);
$("saveSettings").addEventListener("click",()=>{state.settings={builderName:$("builderName").value.trim()||"Builder workspace",handoffContact:$("handoffContact").value.trim(),businessHours:$("businessHours").value.trim(),aiTone:$("aiTone").value};save();showToast("Builder profile saved. Workspace branding updated.");});
function renderCallingIntegration(){
 const s=state.settings.callIntegration||{};
 if($("callProvider"))$("callProvider").value=s.provider||"exotel";
 if($("voiceProvider"))$("voiceProvider").value=s.voiceProvider||"undecided";
 if($("callerIdStatus"))$("callerIdStatus").value=s.callerIdStatus||"pending";
 if($("callBackendStatus"))$("callBackendStatus").value=s.backendStatus||"missing";
}
function saveCallSettings(){
 state.settings=state.settings||{};
 state.settings.callSettings={language:$("callLanguage").value,window:$("callWindow").value,maxAttempts:Number($("callMaxAttempts").value),retryGap:Number($("callRetryGap").value),openingScript:$("callOpeningScript").value.trim(),requirePermission:$("callRequirePermission").checked};
 save();showToast("Call preferences saved locally. Live calls remain disabled.");
}
const saveCallBtn=document.createElement("button");
saveCallBtn.type="button";saveCallBtn.className="btn btn-primary";saveCallBtn.textContent="Save call settings";
saveCallBtn.addEventListener("click",saveCallSettings);
$("saveCallingIntegration")?.addEventListener("click",()=>{
 state.settings=state.settings||{};
 state.settings.callIntegration={provider:$("callProvider").value,voiceProvider:$("voiceProvider").value,callerIdStatus:$("callerIdStatus").value,backendStatus:$("callBackendStatus").value};
 save();showToast("Integration plan saved locally. This does not enable live calling.");
});
const callPanel=document.querySelector(".call-settings-panel");
if(callPanel){const actions=document.createElement("div");actions.className="modal-actions";actions.appendChild(saveCallBtn);callPanel.appendChild(actions);}

function init(){renderAll();if(!state.calls.length){$("statCalls").textContent="0";}}
init();
