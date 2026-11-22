import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Plus, Search, ShoppingBag, X } from "lucide-react";
import "./style.css";

const products = [
  { id:1, name:"The Sculpted Shirt", category:"Shirts", price:2890, color:"Ivory", tag:"BESTSELLER", image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1100&q=85", detail:"A relaxed silhouette in a crisp, breathable cotton blend." },
  { id:2, name:"Everyday Tailored Trouser", category:"Trousers", price:3490, color:"Stone", tag:"NEW", image:"https://images.unsplash.com/photo-1506629905607-d9a9a8b6e9f3?auto=format&fit=crop&w=1100&q=85", detail:"A clean, straight leg with a soft drape and considered finish." },
  { id:3, name:"Soft Form Knit", category:"Knitwear", price:3290, color:"Oat", tag:"", image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1100&q=85", detail:"An easy layer with a gentle hand-feel and subtle texture." },
  { id:4, name:"The Longline Jacket", category:"Outerwear", price:5990, color:"Espresso", tag:"LIMITED", image:"https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=1100&q=85", detail:"A structured outer layer balanced with an effortless fit." },
  { id:5, name:"Draped Weekend Shirt", category:"Shirts", price:3190, color:"Cloud", tag:"", image:"https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1100&q=85", detail:"Lightweight, versatile and made for repeat wear." },
  { id:6, name:"Relaxed Pleat Short", category:"Bottoms", price:2490, color:"Moss", tag:"", image:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1100&q=85", detail:"A tailored short with room to move." }
];

const money = n => "₹" + n.toLocaleString("en-IN");

function App(){
  const [entered,setEntered] = useState(false);
  const [activeCategory,setActiveCategory] = useState("All");
  const [bag,setBag] = useState([]);
  const [bagOpen,setBagOpen] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const [quickView,setQuickView] = useState(null);
  const [searchOpen,setSearchOpen] = useState(false);
  const [query,setQuery] = useState("");
  const [notice,setNotice] = useState("");
  const categories = ["All","Shirts","Trousers","Knitwear","Outerwear","Bottoms"];
  const shown = useMemo(()=>products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&p.name.toLowerCase().includes(query.toLowerCase())),[activeCategory,query]);
  const count = bag.reduce((n,item)=>n+item.qty,0);
  const subtotal = bag.reduce((n,item)=>n+item.price*item.qty,0);
  const add = (product)=>{setBag(old=>{const found=old.find(x=>x.id===product.id);return found?old.map(x=>x.id===product.id?{...x,qty:x.qty+1}:x):[...old,{...product,qty:1}]});setNotice(product.name+" added to your bag");setTimeout(()=>setNotice(""),2400);};
  const changeQty=(id,delta)=>setBag(old=>old.map(x=>x.id===id?{...x,qty:x.qty+delta}:x).filter(x=>x.qty>0));

  return <div className="site">
    {!entered && <section className="threshold" aria-label="AUREN boutique entrance">
      <div className="threshold-grain"/>
      <div className="entrance-top"><span>EST. MMXXIV</span><span>CONSIDERED CLOTHING</span><span>INDIA · WORLDWIDE</span></div>
      <div className="store-scene">
        <div className="slat-wall left-wall"/><div className="slat-wall right-wall"/>
        <div className="ceiling"><i/><i/><i/></div>
        <div className="pendant pendant-one"><b/></div><div className="pendant pendant-two"><b/></div>
        <div className="arch-outer"><div className="arch-inner"><div className="store-depth">
          <div className="back-glow"/>
          <div className="display-rail"><span/><span/><span/><span/></div>
          <div className="counter"><div className="counter-top"/><div className="counter-front">AUREN</div></div>
        </div></div></div>
        <div className="floor"/>
        <div className="side-rack rack-left"><span/><span/><span/></div><div className="side-rack rack-right"><span/><span/><span/></div>
      </div>
      <div className="threshold-copy"><p className="eyebrow">A NEW WAY TO GET DRESSED</p><h1>AUREN<span>.</span></h1><p className="threshold-sub">Quiet confidence. Everyday form.</p>
        <button className="enter-button" onClick={()=>setEntered(true)}>ENTER THE STORE <ArrowUpRight size={16}/></button>
      </div>
      <div className="threshold-bottom"><span>01 — 03</span><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/><span>DESIGNED FOR THE EVERYDAY</span></div>
    </section>}

    <main className={entered?"storefront visible":"storefront"}>
      <div className="announcement">COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹4,999 <span>·</span> MADE FOR THE LONG RUN</div>
      <header className="header">
        <button className="icon-button mobile-menu" aria-label="Open menu" onClick={()=>setMenuOpen(!menuOpen)}><Menu/></button>
        <a className="wordmark" href="#home" onClick={()=>setEntered(true)}>AUREN<span>.</span></a>
        <nav className={menuOpen?"nav open":"nav"}>
          <a href="#collection" onClick={()=>{setActiveCategory("All");setMenuOpen(false)}}>NEW ARRIVALS</a>
          <a href="#collection" onClick={()=>{setActiveCategory("Shirts");setMenuOpen(false)}}>SHIRTS</a>
          <a href="#collection" onClick={()=>{setActiveCategory("Trousers");setMenuOpen(false)}}>BOTTOMS</a>
          <a href="#story" onClick={()=>setMenuOpen(false)}>OUR APPROACH</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search" onClick={()=>setSearchOpen(!searchOpen)}><Search size={19}/></button>
          <button className="bag-button" onClick={()=>setBagOpen(true)}><ShoppingBag size={18}/><span>BAG ({count})</span></button>
        </div>
      </header>
      {searchOpen&&<div className="search-strip"><Search size={18}/><input autoFocus placeholder="Search the collection..." value={query} onChange={e=>setQuery(e.target.value)}/><button onClick={()=>{setSearchOpen(false);setQuery("")}}><X size={18}/></button></div>}
      <section className="hero" id="home">
        <div className="hero-image"><img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=90" alt="Editorial fashion campaign"/></div>
        <div className="hero-shade"/>
        <div className="hero-copy"><p className="eyebrow light">THE EVERYDAY, RECONSIDERED</p><h2>Less, but<br/><em>better.</em></h2><p>Pieces that feel right.<br/>Today, and years from now.</p><a href="#collection" className="light-link">DISCOVER THE COLLECTION <ArrowUpRight size={16}/></a></div>
        <div className="hero-index">01 / 03</div>
        <div className="hero-caption">A STUDY IN SIMPLICITY — 2026</div>
      </section>
      <section className="intro-line"><p>WE BELIEVE IN CLOTHES THAT EARN THEIR PLACE IN YOUR WARDROBE.</p><span>THOUGHTFUL BY DESIGN. EASY BY NATURE.</span></section>
      <section className="collection section-pad" id="collection">
        <div className="section-heading"><div><p className="eyebrow">THE AUREN EDIT</p><h2>Made to <em>move</em> with you.</h2></div><a href="#collection" className="text-link">VIEW ALL PIECES <ArrowUpRight size={15}/></a></div>
        <div className="filters">{categories.map(c=><button key={c} className={activeCategory===c?"filter active":"filter"} onClick={()=>setActiveCategory(c)}>{c}</button>)}</div>
        <div className="product-grid">{shown.map((p,i)=><article className="product-card" key={p.id}>
          <button className="product-image" onClick={()=>setQuickView(p)} aria-label={"View "+p.name}><img src={p.image} alt={p.name}/>{p.tag&&<span className="product-tag">{p.tag}</span>}<span className="quick-view">QUICK VIEW <ArrowUpRight size={13}/></span></button>
          <div className="product-meta"><div><h3>{p.name}</h3><p>{p.color} · {p.category}</p></div><strong>{money(p.price)}</strong></div>
          <button className="add-inline" onClick={()=>add(p)}><Plus size={14}/> ADD TO BAG</button>
        </article>)}</div>
        {shown.length===0&&<p className="empty-state">No pieces match that search. Try another name.</p>}
      </section>
      <section className="manifesto" id="story"><div className="manifesto-image"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85" alt="Minimal fashion editorial"/></div><div className="manifesto-copy"><p className="eyebrow">OUR APPROACH</p><h2>Buy less.<br/><em>Choose well.</em><br/>Wear often.</h2><p>We design around the pieces you reach for again and again. Clean lines, considered details and a quieter kind of confidence.</p><a className="text-link" href="#collection">GET TO KNOW AUREN <ArrowUpRight size={15}/></a></div></section>
      <section className="values"><div><span>01</span><h3>CONSIDERED FORM</h3><p>Intentional silhouettes. Nothing unnecessary.</p></div><div><span>02</span><h3>EVERYDAY EASE</h3><p>Comfort and clarity in equal measure.</p></div><div><span>03</span><h3>MADE TO REPEAT</h3><p>Versatile pieces for a wardrobe that works.</p></div></section>
      <section className="newsletter"><p className="eyebrow">A NOTE FROM AUREN</p><h2>Stay in the <em>know.</em></h2><p>New collections, thoughtful notes and things worth keeping.</p><form onSubmit={e=>{e.preventDefault();setNotice("Thank you — you're on the list.");e.target.reset();setTimeout(()=>setNotice(""),3000)}}><input type="email" required placeholder="Your email address"/><button type="submit">SIGN ME UP <ArrowUpRight size={15}/></button></form></section>
      <footer className="footer"><div className="footer-main"><div><a className="wordmark footer-mark" href="#home">AUREN<span>.</span></a><p>Quiet confidence.<br/>Everyday form.</p></div><div><h4>EXPLORE</h4><a href="#collection">Shop all</a><a href="#collection">New arrivals</a><a href="#story">Our approach</a></div><div><h4>HELP</h4><a href="mailto:hello@auren.example">Contact</a><a href="#footer">Shipping & returns</a><a href="#footer">FAQs</a></div><div><h4>FOLLOW ALONG</h4><a href="#footer">Instagram ↗</a><a href="#footer">Pinterest ↗</a></div></div><div className="footer-bottom"><span>© 2026 AUREN STUDIO</span><span>MADE WITH INTENTION</span><span>INDIA · INR ₹</span></div></footer>
    </main>

    {bagOpen&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setBagOpen(false)}><aside className="drawer"><div className="drawer-head"><h2>Your bag <span>({count})</span></h2><button onClick={()=>setBagOpen(false)}><X/></button></div>{bag.length===0?<div className="empty-bag"><ShoppingBag size={28}/><p>Your bag is currently empty.</p><button onClick={()=>setBagOpen(false)}>CONTINUE SHOPPING <ArrowRight size={15}/></button></div>:<><div className="bag-items">{bag.map(item=><div className="bag-item" key={item.id}><img src={item.image} alt={item.name}/><div className="bag-item-info"><h3>{item.name}</h3><p>{item.color}</p><strong>{money(item.price)}</strong><div className="qty"><button onClick={()=>changeQty(item.id,-1)}>−</button><span>{item.qty}</span><button onClick={()=>changeQty(item.id,1)}>+</button></div></div></div>)}</div><div className="drawer-foot"><div><span>SUBTOTAL</span><strong>{money(subtotal)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="checkout" onClick={()=>setNotice("Checkout is not connected yet. This is a storefront preview.")}>CONTINUE TO CHECKOUT <ArrowRight size={16}/></button></div></>}</aside></div>}
    {quickView&&<div className="overlay modal-overlay" onMouseDown={e=>e.target===e.currentTarget&&setQuickView(null)}><div className="quick-modal"><button className="modal-close" onClick={()=>setQuickView(null)}><X/></button><img src={quickView.image} alt={quickView.name}/><div className="quick-info"><p className="eyebrow">AUREN ESSENTIALS</p><h2>{quickView.name}</h2><strong>{money(quickView.price)}</strong><p>{quickView.detail}</p><p className="color-note">COLOUR: {quickView.color.toUpperCase()}</p><button className="checkout" onClick={()=>{add(quickView);setQuickView(null);setBagOpen(true)}}>ADD TO BAG <Plus size={16}/></button><small>Product imagery is illustrative. Final product details to be confirmed.</small></div></div></div>}
    {notice&&<div className="toast"><Check size={16}/>{notice}</div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);
