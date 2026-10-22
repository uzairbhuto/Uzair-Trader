/* Uzair Traders - website ka code (search, cart, wishlist, pages). Data products.js se aata hai. | VERSION 7: My Cart, All Products, video 3 second autoplay, title tap opens product */
const CAT_LABEL = { makeup:"Makeup", skincare:"Skincare", facewash:"Face Wash", soap:"Soap", lotion:"Lotion", cream:"Cream", shampoo:"Shampoo", stationery:"Stationery", supplement:"Fiber Supplement", toothpaste:"Oral Care", food:"Food", healthcare:"Health Care", herbaltea:"Herbal Tea", haircare:"Hair Care", diaper:"Diapers" };
const WA = "923193455171";
const $ = s => document.querySelector(s), byId = id => PRODUCTS.find(p => p.id === id);
const pkr = n => "Rs. " + n.toLocaleString("en-PK");
const store = { get(k, d){ try { return JSON.parse(localStorage.getItem(k)) || d; } catch(e){ return d; } }, set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} } };
let cart = store.get("ut_cart", {}), wish = store.get("ut_wish", []);
let view = "home", F = { cat: "", brand: "", q: "", sort: "" }, page = 24, slide = 0, timer;
const CATS = Object.keys(CAT_LABEL).filter(c => PRODUCTS.some(p => p.category === c));
const first = c => PRODUCTS.find(p => p.category === c);
const ICON = { home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>', cats:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>', wish:'<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.7A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>', cart:'<path d="M2 3h3l2.5 12h11L21 7H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>', acct:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>' };
const HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.7A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>';
const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
const cartTotal = () => Object.entries(cart).reduce((s, [id, q]) => s + (byId(+id) ? byId(+id).price * q : 0), 0);
function toast(t){ const e = $("#toast"); e.textContent = t; e.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("show"), 1500); }
function save(){ store.set("ut_cart", cart); store.set("ut_wish", wish); }
function card(p){
  return `<div class="pc" data-id="${p.id}"><div class="pi"><img src="${p.image}" alt="" loading="lazy" decoding="async"><button class="heart ${wish.includes(p.id) ? "on" : ""}" data-w="${p.id}" aria-label="Wishlist">${HEART}</button></div><div class="pn">${p.name}</div><div class="pb">${p.brand}</div><div class="pp"><b>${pkr(p.price)}</b><button class="add" data-a="${p.id}" aria-label="Add to cart">+</button></div></div>`;
}
function filtered(){
  const w = F.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let l = PRODUCTS.filter(p => { const h = (p.name + " " + p.brand + " " + (CAT_LABEL[p.category] || "")).toLowerCase(); return (!F.cat || p.category === F.cat) && (!F.brand || p.brand === F.brand) && w.every(x => h.includes(x)); });
  if (F.sort === "lo") l = l.slice().sort((a, b) => a.price - b.price);
  if (F.sort === "hi") l = l.slice().sort((a, b) => b.price - a.price);
  return l;
}
const SL = [
  ["Glow Naturally.", "Look Beautiful Everyday", "Premium Beauty & Cosmetics Collection", "", "skincare", "makeup"],
  ["Fresh Skin.", "Clean, Clear & Bright", "Face wash aur skincare ki original range", "facewash", "facewash", "cream"],
  ["Soft & Pure.", "Soap, Lotion & Care", "Roz marra ke liye original products", "soap", "soap", "lotion"]
];
function home(){
  const picks = BRANDS.map(b => PRODUCTS.find(p => p.brand === b)).filter(Boolean);
  return `<div class="hero"><div class="slides" id="slides">${SL.map(s => `<div class="slide"><div class="tx"><small>${s[0]}</small><h2 class="serif">${s[1]}</h2><p>${s[2]}</p><button class="cta" data-go="${s[3]}">Shop Now &rarr;</button></div><div class="im">${[s[4], s[5]].map(c => `<img src="${(first(c) || PRODUCTS[0]).image}" alt="">`).join("")}</div></div>`).join("")}</div><div class="dots" id="dots">${SL.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div></div>
  <div class="cats">${CATS.map(c => `<button class="cat" data-cat="${c}"><span><img src="${first(c).image}" alt="" loading="lazy"></span>${CAT_LABEL[c]}</button>`).join("")}</div>
  <div class="sec"><h3 class="serif">Top Picks</h3><a data-go="">View all &rsaquo;</a></div><div class="row">${picks.map(card).join("")}</div>
  <div class="sec"><h3 class="serif">Naye Products</h3><a data-go="">View all &rsaquo;</a></div><div class="row">${PRODUCTS.slice(-8).reverse().map(card).join("")}</div>`;
}
function list(){
  const l = filtered(), t = F.q ? `"${F.q}"` : (F.cat ? CAT_LABEL[F.cat] : (F.brand || "All Products"));
  return `<div class="sec" style="margin-top:8px"><h3 class="serif">${t}</h3></div>
  <div class="chips"><button class="chip ${F.brand ? "" : "on"}" data-brand="">Saari Brands</button>${BRANDS.map(b => `<button class="chip ${F.brand === b ? "on" : ""}" data-brand="${b}">${b}</button>`).join("")}</div>
  <div class="chips"><button class="chip ${F.cat ? "" : "on"}" data-cat="">All</button>${CATS.map(c => `<button class="chip ${F.cat === c ? "on" : ""}" data-cat="${c}">${CAT_LABEL[c]}</button>`).join("")}</div>
  <div class="bar"><span>${l.length} products</span><select id="sort"><option value="">Sort: Default</option><option value="lo" ${F.sort === "lo" ? "selected" : ""}>Price: Low to High</option><option value="hi" ${F.sort === "hi" ? "selected" : ""}>Price: High to Low</option></select></div>
  ${l.length ? `<div class="grid">${l.map(card).join("")}</div>` : `<div class="empty"><b>Koi product nahi mila</b>Kisi aur lafz se search karein.</div>`}`;
}
function cats(){
  return `<div class="sec" style="margin-top:8px"><h3 class="serif">Categories</h3></div><div class="cgrid">${CATS.map(c => `<button class="cc" data-cat="${c}"><span><img src="${first(c).image}" alt="" loading="lazy"></span><div>${CAT_LABEL[c]}<small>${PRODUCTS.filter(p => p.category === c).length} products</small></div></button>`).join("")}</div>
  <div class="sec"><h3 class="serif">Brands</h3></div><div class="chips" style="flex-wrap:wrap">${BRANDS.map(b => `<button class="chip" data-brand="${b}">${b}</button>`).join("")}</div>`;
}
function wishV(){
  const l = wish.map(byId).filter(Boolean);
  return `<div class="sec" style="margin-top:8px"><h3 class="serif">Wishlist</h3></div>` + (l.length ? `<div class="grid">${l.map(card).join("")}</div>` : `<div class="empty"><b>Wishlist khali hai</b>Pasandida products par &#9825; dabayein.</div>`);
}
function msg(){
  const lines = Object.entries(cart).map(([id, q]) => { const p = byId(+id); return p ? `- ${p.name} (${p.brand}) x${q} = ${pkr(p.price * q)}` : ""; }).filter(Boolean);
  return `https://wa.me/${WA}?text=` + encodeURIComponent(`Assalam-o-Alaikum, mujhe yeh order karna hai:\n${lines.join("\n")}\nTotal: ${pkr(cartTotal())}`);
}
function cartV(){
  const items = Object.entries(cart).filter(([id]) => byId(+id));
  if (!items.length) return `<div class="empty"><b>Cart khali hai</b>Products add karein aur WhatsApp par order bhejein.</div>`;
  return `<div class="sec" style="margin-top:8px"><h3 class="serif">My Cart</h3></div>${items.map(([id, q]) => { const p = byId(+id); return `<div class="ci"><div class="pi" data-id="${p.id}"><img src="${p.image}" alt=""></div><div class="tx"><div class="pn" data-id="${p.id}" style="min-height:0;cursor:pointer">${p.name}</div><div class="pb" data-id="${p.id}" style="cursor:pointer">${p.brand} &middot; ${pkr(p.price)}</div><div class="pp"><span class="q"><button data-m="${p.id}">&minus;</button><span>${q}</span><button data-p="${p.id}">+</button></span><b>${pkr(p.price * q)}</b></div></div></div>`; }).join("")}
  <div class="tot"><span>Total</span><span>${pkr(cartTotal())}</span></div><a class="wa" href="${msg()}" target="_blank" rel="noopener">WhatsApp par Order Karein</a>`;
}
function acct(){
  return `<div class="card" style="text-align:center"><img src="${LOGO}" alt="" data-lb style="width:84px;height:84px;border-radius:50%;object-fit:cover;cursor:pointer"><h3 class="serif" style="margin-top:8px">Uzair Traders</h3><p>Premium Cosmetics &amp; Personal Care<br>100% original products</p></div>
  <div class="card"><h4>Rabta Karein</h4><p>&#128222; <a href="tel:03193455171">0319-3455171</a><br>&#9993; <a href="mailto:uzairTraders@gmail.com">uzairTraders@gmail.com</a><br>&#128205; Rohri, Sukkur, Pakistan</p></div>
  <div class="card"><h4>Kaam Ke Auqat</h4><p>Mon - Sat: 10 AM - 9 PM<br>Sunday: 2 PM - 8 PM</p></div>
  <a class="wa" href="https://wa.me/${WA}?text=${encodeURIComponent("Assalam-o-Alaikum, mujhe order karna hai.")}" target="_blank" rel="noopener">WhatsApp par Baat Karein</a>
  <p class="ghost">Made with &#10084;&#65039; in Pakistan</p>`;
}
function draw(keep){
  if (!keep && document.activeElement !== $("#q")) closeSug();
  const m = $("#main"), y = m.scrollTop, oldRows = [...m.querySelectorAll(".chips")].map(r => r.scrollLeft);
  m.innerHTML = { home, list, cats, wish: wishV, cart: cartV, acct }[view]();
  m.scrollTop = keep ? y : 0;
  /* Filter chips: purani position wahi rakhein, aur selected chip hamesha nazar aaye */
  const rows = [...m.querySelectorAll(".chips")];
  rows.forEach((r, i) => {
    if (oldRows.length === rows.length) r.scrollLeft = oldRows[i];
    const a = r.querySelector(".chip.on"); if (!a) return;
    const rr = r.getBoundingClientRect(), ar = a.getBoundingClientRect();
    if (ar.left < rr.left + 8 || ar.right > rr.right - 8) r.scrollLeft += (ar.left + ar.width / 2) - (rr.left + rr.width / 2);
  });
  $("#nav").innerHTML = [["home", "Home"], ["cats", "Categories"], ["wish", "Wishlist"], ["cart", "Cart"], ["acct", "Account"]].map(([k, t]) => `<button data-v="${k}" class="${view === k || (view === "list" && k === "cats") ? "on" : ""}"><svg viewBox="0 0 24 24">${ICON[k]}</svg>${t}${k === "cart" ? `<span class="badge">${cartCount() || ""}</span>` : ""}${k === "wish" ? `<span class="badge">${wish.length || ""}</span>` : ""}</button>`).join("");
  $("#cartBadge").textContent = cartCount() || "";
  $(".sb").style.display = ["cart", "acct"].includes(view) ? "none" : "";
  clearInterval(timer);
  if (view === "home") timer = setInterval(() => go(slide + 1), 4500);
}
function go(i){ slide = (i + SL.length) % SL.length; const s = $("#slides"); if (!s) return; s.style.transform = `translateX(-${slide * 100}%)`; document.querySelectorAll("#dots i").forEach((d, k) => d.classList.toggle("on", k === slide)); }
function show(v){ view = v; draw(); }
function toList(o){ F = Object.assign({ cat: "", brand: "", q: "", sort: "" }, o); page = 24; $("#q").value = F.q; show("list"); }
function add(id, n){ cart[id] = (cart[id] || 0) + (n || 1); save(); toast("Cart mein add ho gaya"); $("#cartBadge").textContent = cartCount(); draw(true); }
function wishT(id){ wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id]; save(); draw(true); }
let vidTimer = 0;
function openP(id){
  const p = byId(id); let qty = 1; if (!p) return;
  const s = $("#sheet");
  const link = () => `https://wa.me/${WA}?text=` + encodeURIComponent(`Assalam-o-Alaikum, mujhe "${p.name}" (${p.brand}) order karna hai. Price: ${pkr(p.price)}.${qty > 1 ? ` Quantity: ${qty}. Subtotal: ${pkr(p.price * qty)}.` : ""}`);
  const upd = () => { $("#qv").textContent = qty; $("#wo").href = link(); };
  const render = () => { s.innerHTML = `<div class="top"><button class="ib" id="cl" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button class="ib heart ${wish.includes(p.id) ? "on" : ""}" id="sw" style="background:none">${HEART}</button></div><div class="body"><div class="big">${p.video ? `<video src="${p.video}" controls playsinline preload="auto" poster="${p.image}"></video>` : `<img src="${p.image}" alt="">`}</div>${p.video ? `<div class="big" style="margin-top:10px"><img src="${p.image}" alt=""></div>` : ""}<div class="pb" style="margin-top:12px">${p.brand} &middot; ${CAT_LABEL[p.category] || ""}</div><h1 class="serif">${p.name}</h1><div class="price">${pkr(p.price)}</div>${p.description ? `<div class="desc">${p.description}</div>` : ""}</div><div class="act"><span class="q"><button id="qm">&minus;</button><span id="qv">${qty}</span><button id="qp">+</button></span><button class="cta o" id="ac">Add to Cart</button><a id="wo" class="cta" style="text-decoration:none" target="_blank" rel="noopener" href="${link()}">Order</a></div>`;
    $("#cl").onclick = closeP; $("#sw").onclick = () => { wishT(p.id); $("#sw").classList.toggle("on", wish.includes(p.id)); };
    $("#qm").onclick = () => { qty = Math.max(1, qty - 1); upd(); }; $("#qp").onclick = () => { qty++; upd(); };
    $("#ac").onclick = () => { add(p.id, qty); closeP(); }; };
  render(); s.classList.add("open");
  clearTimeout(vidTimer);
  if (p.video) vidTimer = setTimeout(() => { /* video 3 second baad khud ek dafa chalegi; khatam hone par dobara khud nahi chalegi */
    const v = s.querySelector("video"); if (!v || !s.classList.contains("open")) return;
    if (v.paused && v.currentTime === 0 && !v.ended){ const r = v.play(); if (r && r.catch) r.catch(() => { v.muted = true; v.play().catch(() => {}); }); }
  }, 3000);
  try { history.pushState({ sheet: 1 }, ""); } catch (e) {}
}
function closeP(){ clearTimeout(vidTimer); const s = $("#sheet"); if (s.classList.contains("open")){ s.classList.remove("open"); s.innerHTML = ""; try { if (history.state && history.state.sheet) history.back(); } catch (e) {} } }
window.addEventListener("popstate", () => { clearTimeout(vidTimer); const s = $("#sheet"); if (s.classList.contains("open")){ s.classList.remove("open"); s.innerHTML = ""; } $("#drawer").classList.remove("open"); });
function drawer(o){
  const d = $("#drawer"); d.classList.toggle("open", o);
  if (o) $("#pn2").innerHTML = `<div class="logo serif" style="margin-bottom:14px"><img src="${LOGO}" alt="">Uzair <b>Traders</b></div><button class="l" data-dgo="">All Products</button><div class="pb" style="margin:14px 0 4px">BRANDS</div>${BRANDS.map(b => `<button class="l" data-dbrand="${b}">${b}</button>`).join("")}<div class="pb" style="margin:14px 0 4px">MORE</div><button class="l" data-dv="acct">Rabta &amp; Auqat</button><a class="l" style="display:block;padding:11px 0;color:#25a244;text-decoration:none;font-weight:600" target="_blank" rel="noopener" href="https://wa.me/${WA}">WhatsApp: 0319-3455171</a>`;
}

let SG = [], sgI = -1;
const sgBox = () => $("#sg");
function closeSug(){ SG = []; sgI = -1; const b = sgBox(); b.classList.remove("open"); b.innerHTML = ""; }
function renderSug(q){
  q = q.trim().toLowerCase(); if (!q) return closeSug();
  const w = q.split(/\s+/).filter(Boolean), hit = h => { h = h.toLowerCase(); return h.includes(q) || w.every(x => h.includes(x)); };
  const m = [];
  CATS.forEach(c => hit(CAT_LABEL[c]) && m.push({ k: "cat", v: c, t: CAT_LABEL[c], tag: "Category" }));
  BRANDS.forEach(b => hit(b) && m.push({ k: "brand", v: b, t: b, tag: "Brand" }));
  const top = m.slice(0, 6);
  if (q.length >= 3 || w.length > 1) PRODUCTS.forEach(p => { if (top.length < 8 && hit(p.name + " " + p.brand + " " + (CAT_LABEL[p.category] || ""))) top.push({ k: "prod", v: p.name, t: p.name, tag: "Product" }); });
  SG = top; sgI = -1; const b = sgBox();
  if (!SG.length){ b.classList.remove("open"); b.innerHTML = ""; return; }
  b.innerHTML = SG.map((s, i) => `<button data-sg="${i}"><span>${s.t}</span><i>${s.tag}</i></button>`).join(""); b.classList.add("open");
}
function pickSug(s){
  closeSug(); $("#q").blur();
  if (s.k === "cat") toList({ cat: s.v }); else if (s.k === "brand") toList({ brand: s.v }); else toList({ q: s.v });
  $("#q").value = s.t;
}
function runSearch(){ closeSug(); $("#q").blur(); }
$("#q").addEventListener("keydown", e => {
  const open = SG.length > 0, btns = document.querySelectorAll("#sg button");
  if ((e.key === "ArrowDown" || e.key === "ArrowUp") && open){ e.preventDefault(); sgI = e.key === "ArrowDown" ? (sgI + 1) % SG.length : (sgI - 1 + SG.length) % SG.length; btns.forEach((b, i) => b.classList.toggle("act", i === sgI)); }
  else if (e.key === "Escape") closeSug();
  else if (e.key === "Enter"){ e.preventDefault(); open && sgI > -1 ? pickSug(SG[sgI]) : runSearch(); }
});
$(".sb svg").addEventListener("click", runSearch);
document.addEventListener("click", e => {
  if (!e.target.closest(".sb")) closeSug();
  const t = e.target.closest("#logoBtn,[data-lb],#lb,[data-sg],[data-w],[data-a],[data-id],[data-v],[data-go],[data-cat],[data-brand],[data-p],[data-m],[data-dgo],[data-dbrand],[data-dv],#more,#clr,#menuBtn,#cartBtn,#dsh");
  if (!t) return;
  const D = t.dataset;
  if (t.id === "logoBtn" || D.lb !== undefined){ $("#lbi").src = LOGO; $("#lb").classList.add("open"); return; }
  if (t.id === "lb") return $("#lb").classList.remove("open");
  if (D.sg !== undefined) return pickSug(SG[+D.sg]);
  if (D.w) return wishT(+D.w);
  if (D.a) return add(+D.a);
  if (t.id === "menuBtn") return drawer(true);
  if (t.id === "dsh") return drawer(false);
  if (t.id === "cartBtn") return show("cart");
  if (D.v) return D.v === "cats" ? (F = { cat: "", brand: "", q: "", sort: "" }, $("#q").value = "", show("cats")) : show(D.v);
  if (D.dgo !== undefined){ drawer(false); return toList({}); }
  if (D.dbrand){ drawer(false); return toList({ brand: D.dbrand }); }
  if (D.dv){ drawer(false); return show(D.dv); }
  if (D.go !== undefined) return toList(D.go ? { cat: D.go } : {});
  if (D.cat !== undefined && !D.id) return toList(view === "list" ? Object.assign({}, F, { cat: D.cat }) : { cat: D.cat });
  if (D.brand !== undefined) return toList(view === "list" ? Object.assign({}, F, { brand: D.brand }) : { brand: D.brand });
  if (D.p){ cart[D.p]++; save(); return draw(true); }
  if (D.m){ cart[D.m]--; if (cart[D.m] <= 0) delete cart[D.m]; save(); return draw(true); }
  if (t.id === "more"){ page += 24; return draw(true); }
  if (t.id === "clr"){ cart = {}; save(); return draw(); }
  if (D.id) return openP(+D.id);
});
document.addEventListener("change", e => { if (e.target.id === "sort"){ F.sort = e.target.value; draw(true); } });
$("#q").addEventListener("input", e => { F = { cat: "", brand: "", q: e.target.value, sort: F.sort }; page = 24; if (view !== "list") view = "list"; draw(); renderSug(e.target.value); });
let sx = 0; document.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
document.addEventListener("touchend", e => { if (view === "home" && e.target.closest(".hero")){ const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) go(slide + (d < 0 ? 1 : -1)); } }, { passive: true });
/* Pink scroll indicator: same size as the old yellow one (5px x 70px), follows whichever page/sheet is scrolling */
(function(){
  const app = $("#app"), box = document.createElement("div"); box.className = "si"; box.innerHTML = '<div class="sit" id="sit"></div>'; app.appendChild(box);
  const thumb = box.firstChild; let raf = 0;
  function scroller(){ if ($("#drawer").classList.contains("open")) return null; return $("#sheet").classList.contains("open") ? $("#sheet .body") : $("#main"); }
  function update(){
    raf = 0; const el = scroller(); if (!el) { thumb.style.opacity = 0; return; }
    const max = el.scrollHeight - el.clientHeight; if (max <= 2) { thumb.style.opacity = 0; return; }
    const r = el.getBoundingClientRect(), a = app.getBoundingClientRect(), room = Math.max(0, r.height - 70);
    thumb.style.opacity = 1; thumb.style.top = (r.top - a.top + Math.min(1, Math.max(0, el.scrollTop / max)) * room) + "px";
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
  document.addEventListener("scroll", queue, true); document.addEventListener("load", queue, true); window.addEventListener("resize", queue);
  const mo = new MutationObserver(queue);
  ["#main", "#sheet", "#drawer"].forEach(s => mo.observe($(s), { childList: true, attributes: true }));
  queue();
})();
document.getElementById("hl").src = LOGO;
draw();
