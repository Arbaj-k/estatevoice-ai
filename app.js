(() => {
  const $ = (id) => document.getElementById(id);
  const keys = { leads: "estatevoice_leads_v1", properties: "estatevoice_properties_v1", calls: "estatevoice_calls_v1" };
  const load = (key, fallback = []) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
  let leads = load(keys.leads), properties = load(keys.properties), calls = load(keys.calls);
  let activeView = "overview", itemType = "lead", editingId = null;
  const uid = () => (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  const safe = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const money = s => s ? (String(s).startsWith("₹") ? s : "₹" + s) : "Not set";
  const save = () => { localStorage.setItem(keys.leads, JSON.stringify(leads)); localStorage.setItem(keys.properties, JSON.stringify(properties)); localStorage.setItem(keys.calls, JSON.stringify(calls)); render(); };
  const toast = message => { $("toast").textContent = message; $("toast").classList.remove("hidden"); clearTimeout(toast.timer); toast.timer = setTimeout(() => $("toast").classList.add("hidden"), 2800); };
  const setView = view => { activeView = view; document.querySelectorAll(".view").forEach(el => el.classList.add("hidden")); $(view + "View").classList.remove("hidden"); document.querySelectorAll(".nav").forEach(el => el.classList.toggle("active", el.dataset.view === view)); $("pageTitle").textContent = ({overview:"Overview",leads:"Lead pipeline",properties:"Property inventory",calls:"Call activity"})[view]; render(); };
  document.querySelectorAll(".nav").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.goto)));
  function render() {
    $("statLeads").textContent = leads.length; $("statProperties").textContent = properties.length; $("statCalls").textContent = calls.length; $("statFollowups").textContent = leads.filter(l => l.status === "Follow-up").length;
    $("recentLeads").innerHTML = leads.length ? leads.slice(-5).reverse().map(l => `<div class="call-row"><div class="call-icon">♙</div><div><b>${safe(l.name)}</b><p>${safe(l.interest || "Property enquiry")} · ${safe(l.phone || "No phone added")}</p></div><span class="badge ${l.status==="Qualified"?"green":l.status==="Follow-up"?"amber":""}">${safe(l.status)}</span></div>`).join("") : '<div class="empty">Your new prospects will appear here.</div>';
    $("leadsTable").innerHTML = leads.slice().reverse().map(l => `<tr><td><span class="person">${safe(l.name)}</span><span class="subtext">${safe(l.phone || "No phone")}${l.email ? " · "+safe(l.email) : ""}</span></td><td>${safe(l.interest || "—")}</td><td>${safe(money(l.budget))}</td><td><span class="badge ${l.status==="Qualified"?"green":l.status==="Follow-up"?"amber":""}">${safe(l.status)}</span></td><td>${safe(l.next || "Not set")}</td><td><button class="row-action" data-edit-lead="${safe(l.id)}">Edit</button> · <button class="row-action" data-delete-lead="${safe(l.id)}">Delete</button></td></tr>`).join("");
    $("emptyLeads").classList.toggle("hidden", leads.length > 0);
    $("propertyGrid").innerHTML = properties.map(p => `<article class="property-card"><div class="prop-icon">⌂</div><h3>${safe(p.name)}</h3><p>${safe(p.location || "Location not set")}</p><div class="price">${safe(money(p.price))}</div><div class="property-meta"><span>${safe(p.type || "Property")}</span><span>${safe(p.units || "Units not set")} units</span></div><button class="text-btn" data-delete-property="${safe(p.id)}" style="margin-top:16px;padding:0">Remove listing</button></article>`).join("");
    $("emptyProperties").classList.toggle("hidden", properties.length > 0);
    $("callList").innerHTML = calls.length ? calls.slice().reverse().map(c => `<div class="call-row"><div class="call-icon">◉</div><div><b>Demo call · ${safe(c.name)}</b><p>${safe(c.summary)}</p></div><time>${safe(c.date)}</time></div>`).join("") : '<div class="empty">No simulations yet. Run a demo to preview the flow.</div>';
    document.querySelectorAll("[data-edit-lead]").forEach(b => b.addEventListener("click", () => openModal("lead", b.dataset.editLead)));
    document.querySelectorAll("[data-delete-lead]").forEach(b => b.addEventListener("click", () => { leads = leads.filter(l => l.id !== b.dataset.deleteLead); save(); toast("Lead removed."); }));
    document.querySelectorAll("[data-delete-property]").forEach(b => b.addEventListener("click", () => { properties = properties.filter(p => p.id !== b.dataset.deleteProperty); save(); toast("Property removed."); }));
  }
  const fields = {
    lead: [{name:"name",label:"Prospect name",required:true,placeholder:"e.g. Aditi Sharma"},{name:"phone",label:"Phone number",placeholder:"+91 …"},{name:"email",label:"Email",type:"email",placeholder:"name@example.com"},{name:"interest",label:"Property interest",placeholder:"e.g. 3 BHK apartment"},{name:"budget",label:"Budget (₹)",placeholder:"e.g. 8500000"},{name:"status",label:"Lead status",type:"select",options:["New","Contacted","Qualified","Follow-up","Closed"]},{name:"next",label:"Next step",placeholder:"e.g. Call back tomorrow"},{name:"notes",label:"Notes",type:"textarea",full:true,placeholder:"Requirements, preferred area, timeline…"}],
    property: [{name:"name",label:"Project / property name",required:true,placeholder:"e.g. Palm Residency"},{name:"location",label:"Location",placeholder:"City / neighbourhood"},{name:"price",label:"Price (₹)",placeholder:"e.g. 7500000"},{name:"type",label:"Property type",type:"select",options:["Apartment","Villa","Plot","Commercial","Other"]},{name:"units",label:"Available units",type:"number",placeholder:"e.g. 12"},{name:"details",label:"Highlights",type:"textarea",full:true,placeholder:"Bedrooms, amenities, possession date…"}]
  };
  function openModal(type, id = null) {
    itemType = type; editingId = id; const current = id ? leads.find(l => l.id === id) : {};
    $("modalTitle").textContent = type === "lead" ? (id ? "Edit lead" : "Add lead") : "Add property";
    $("formFields").innerHTML = fields[type].map(f => {
      const value = safe(current?.[f.name] || (f.name === "status" ? "New" : f.name === "type" ? "Apartment" : ""));
      let control = f.type === "select" ? `<select name="${f.name}">${f.options.map(o=>`<option ${o===value?"selected":""}>${o}</option>`).join("")}</select>` : f.type === "textarea" ? `<textarea name="${f.name}" placeholder="${safe(f.placeholder||"")}">${value}</textarea>` : `<input name="${f.name}" type="${f.type||"text"}" value="${value}" placeholder="${safe(f.placeholder||"")}" ${f.required?"required":""} ${f.type==="number"?"min=0":""}>`;
      return `<label class="field ${f.full?"full":""}">${safe(f.label)}${control}</label>`;
    }).join("");
    $("modalBackdrop").classList.remove("hidden");
    const first = $("formFields").querySelector("input"); if (first) first.focus();
  }
  function closeModal() { $("modalBackdrop").classList.add("hidden"); $("itemForm").reset(); }
  ["closeModal","cancelModal"].forEach(id => $(id).addEventListener("click", closeModal));
  $("modalBackdrop").addEventListener("click", e => { if (e.target === $("modalBackdrop")) closeModal(); });
  $("itemForm").addEventListener("submit", e => {
    e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (itemType === "lead") {
      if (editingId) leads = leads.map(l => l.id === editingId ? {...l,...data} : l);
      else leads.push({id:uid(),...data,createdAt:new Date().toISOString()});
      toast(editingId ? "Lead updated." : "Lead added.");
    } else { properties.push({id:uid(),...data}); toast("Property added."); }
    save(); closeModal();
  });
  const addLead = () => openModal("lead"), addProperty = () => openModal("property");
  ["addLeadTop","addLeadBtn","quickLead"].forEach(id => $(id).addEventListener("click", addLead));
  ["quickProperty","addPropertyBtn"].forEach(id => $(id).addEventListener("click", addProperty));
  const simulateCall = () => {
    if (!leads.length) { toast("Add a lead first to simulate a call."); openModal("lead"); return; }
    const lead = leads[leads.length-1];
    calls.push({id:uid(),name:lead.name,summary:"Simulation only: greeting → confirm property needs → discuss budget → offer a follow-up.",date:new Date().toLocaleString()});
    save(); setView("calls"); toast("Demo call flow recorded. No phone call was made.");
  };
  ["startDemo","quickCall","simulateCallBtn"].forEach(id => $(id).addEventListener("click", simulateCall));
  $("exportBtn").addEventListener("click", () => {
    if (!leads.length) { toast("No leads to export yet."); return; }
    const cols = ["name","phone","email","interest","budget","status","next","notes"];
    const csv = [cols.join(","),...leads.map(l=>cols.map(c=>'"'+String(l[c]||"").replace(/"/g,'""')+'"').join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"})); const a=document.createElement("a");a.href=url;a.download="estatevoice-leads.csv";a.click();URL.revokeObjectURL(url);
  });
  render();
})();