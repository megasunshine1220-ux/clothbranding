import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { navigation, products, editorialCopy } from "./data/storefront";
import "./style.css";

const money = value => "₹" + value.toLocaleString("en-IN");

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.14 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Header({ bagCount, onBag, onSearch }) {
  const [menu, setMenu] = useState(false);
  return <>
    <div className="utility"><span>{editorialCopy.announcement}</span><div><a href="#shipping">Shipping</a><a href="#footer">Login</a></div></div>
    <header className="site-header">
      <button className="mobile-trigger" aria-label="Toggle navigation" onClick={() => setMenu(!menu)}><Menu /></button>
      <a className="brand" href="#top">CHEC<span>®</span></a>
      <nav className={menu ? "main-nav nav-open" : "main-nav"}>{navigation.map(item => <a key={item} href="#products" onClick={() => setMenu(false)}>{item}</a>)}</nav>
      <div className="header-tools"><button aria-label="Search" onClick={onSearch}><Search /></button><a aria-label="Account" href="#footer" className="account-link">Account</a><button className="bag-trigger" onClick={onBag} aria-label="Shopping bag"><ShoppingBag /><span>{bagCount}</span></button></div>
    </header>
  </>;
}

function SceneOpening() {
  return <section className="scene-opening" id="top">
    <div className="opening-grain" />
    <div className="opening-copy"><span className="scene-kicker">CHEC — OBJECTS FOR EVERYDAY LIFE</span><h1>LESS NOISE.<br/><em>MORE STYLE.</em></h1><a href="#studio" className="scene-link">DISCOVER THE WORLD OF CHEC <ArrowDown size={15}/></a></div>
    <div className="plaster-room" aria-hidden="true">
      <div className="room-ceiling"/><div className="room-wall wall-left"/><div className="room-wall wall-right"/>
      <div className="room-arch"><div className="double-door"><i/><i/><b/><b/></div></div>
      <div className="ring ring-a"/><div className="ring ring-b"/><div className="armchair"><span/><i/></div><div className="room-floor"/>
    </div>
    <div className="scene-counter">01 / 08 <span>SCROLL TO ENTER</span></div>
  </section>;
}

function StudioScenes() {
  return <>
    <section className="scene-studio" id="studio">
      <div className="checker-wall"/><div className="studio-vase"><i/><i/><i/><b/></div><div className="dress-form"><div className="neck"/><div className="torso"/><div className="stand"/></div>
      <div className="studio-panels"><i/><i/><i/><i/></div>
      <div className="studio-copy"><span className="scene-kicker">A SPACE TO EXPLORE</span><h2>STEP INTO<br/><em>THE STUDIO.</em></h2><p>AN IMMERSIVE SPACE INSPIRED BY MATERIAL, MOTION, AND MOOD.</p></div>
      <span className="scene-counter">02 / 08</span>
    </section>
    <section className="scene-object">
      <div className="sun-disc"/><div className="lantern"><i/><i/><i/><b/></div><div className="branch"><i/><i/><i/><i/><i/></div>
      <div className="bag-stage"><div className="bag-handle"/><div className="bag-body"><span/></div><div className="bag-shadow"/></div>
      <div className="object-copy"><span className="scene-kicker">FORM MEETS FUNCTION</span><h2>WEIGHTLESS<br/><em>LUXURY.</em></h2><p>AN OBJECT OF INTENT. A STUDY IN FORM.</p></div><span className="scene-counter">03 / 08</span>
    </section>
  </>;
}

function ProductCard({ product, onAdd, onOpen }) {
  const [swatch, setSwatch] = useState(0);
  const [saved, setSaved] = useState(false);
  return <article className="product-card">
    <button className="product-photo" onClick={() => onOpen(product)} aria-label={"View " + product.name}><img src={product.image} alt={product.name}/>{product.label && <span className="product-label">{product.label}</span>}<span className="photo-action">QUICK VIEW <ArrowUpRight size={14}/></span></button>
    <div className="product-info"><div><h3>{product.name}</h3><p>{product.color}</p></div><strong>{money(product.price)}</strong></div>
    <div className="product-controls"><div className="swatches">{product.swatches.map((color, i) => <button key={color} aria-label={"Choose colour " + (i+1)} className={swatch === i ? "swatch selected" : "swatch"} style={{background:color}} onClick={() => setSwatch(i)}/>)}</div><button className="heart-button" aria-label="Save item" onClick={() => setSaved(!saved)}><Heart fill={saved ? "currentColor" : "none"}/></button><button className="quick-add" onClick={() => onAdd(product)}><ShoppingBag size={15}/> ADD</button></div>
  </article>;
}

function App() {
  useReveal();
  const [bag, setBag] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [quick, setQuick] = useState(null);
  const [toast, setToast] = useState("");
  const count = bag.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = bag.reduce((sum, item) => sum + item.price * item.qty, 0);
  const visible = useMemo(() => products.filter(p => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())), [category, search]);
  const notify = message => { setToast(message); window.clearTimeout(notify.timer); notify.timer = window.setTimeout(() => setToast(""), 2600); };
  const add = product => { setBag(current => { const found = current.find(item => item.id === product.id); return found ? current.map(item => item.id === product.id ? {...item, qty:item.qty+1} : item) : [...current, {...product, qty:1}]; }); notify(product.name + " added to your bag"); };
  const qty = (id, delta) => setBag(current => current.map(item => item.id === id ? {...item, qty:item.qty+delta} : item).filter(item => item.qty > 0));

  return <div className="chec-site">
    <Header bagCount={count} onBag={() => setBagOpen(true)} onSearch={() => setSearchOpen(!searchOpen)}/>
    {searchOpen && <div className="search-bar"><Search/><input autoFocus placeholder="Search the collection" value={search} onChange={e => setSearch(e.target.value)}/><button onClick={() => {setSearch("");setSearchOpen(false)}}><X/></button></div>}
    <SceneOpening/>
    <StudioScenes/>
    <section className="hero-campaign">
      <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=90" alt="Fashion campaign portrait"/>
      <div className="hero-overlay"/><div className="hero-campaign-copy"><span className="scene-kicker">THE CHEC POINT OF VIEW</span><h2>REDEFINING<br/><em>EVERYDAY</em><br/>LUXURY.</h2><a href="#statement" className="cream-button">EXPLORE THE COLLECTION <ArrowUpRight size={15}/></a></div><span className="hero-note">CAMPAIGN 01 — 2026</span>
    </section>
    <section className="statement" id="statement" data-reveal><span className="scene-kicker">A NEW PERSPECTIVE ON THE EVERYDAY</span><h2>REDEFINING<br/><em>EVERYDAY LUXURY.</em></h2><p>{editorialCopy.intro}</p><span className="statement-mark">CHEC — EST. 2026</span></section>
    <section className="lookbook">
      <div className="lookbook-image" data-reveal><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1300&q=88" alt="Model in contemporary black look"/><span className="image-index">01 / WOMENSWEAR</span></div>
      <div className="lookbook-copy" data-reveal><span className="scene-kicker">THE COLLECTION / 001</span><h2>THE ART OF<br/><em>GETTING DRESSED.</em></h2><p>Considered layers, confident shapes and details that reveal themselves over time.</p><a href="#products" className="dark-link">SHOP WOMENSWEAR <ArrowUpRight size={15}/></a><div className="lookbook-product"><span>FEATURED PIECE</span><strong>CLASSIC BLACK UTILITY JUMPSUIT</strong><a href="#products">DISCOVER <ArrowRight size={14}/></a></div></div>
    </section>
    <section className="modern-classic">
      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2200&q=90" alt="Monochrome fashion portrait"/>
      <div className="mono-wash"/><div className="mono-copy"><span className="scene-kicker">THE CAMPAIGN / 002</span><h2>THE MODERN<br/><em>CLASSIC.</em></h2><a href="#products" className="cream-button">SHOP NOW <ArrowUpRight size={15}/></a></div><span className="mono-side">CHEC — FORM / FUNCTION / FEELING</span>
    </section>
    <section className="catalog" id="products">
      <div className="catalog-heading" data-reveal><div><span className="scene-kicker">THE CURRENT EDIT</span><h2>THE PIECES<br/><em>WE KEEP.</em></h2></div><p>Designed to be worn.<br/>Made to be remembered.</p></div>
      <div className="category-tabs">{["All", ...navigation].map(item => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="catalog-grid">{visible.map(product => <ProductCard key={product.id} product={product} onAdd={add} onOpen={setQuick}/>)}</div>
      {visible.length === 0 && <p className="no-results">No matching pieces. Try another search.</p>}
    </section>
    <section className="category-mosaic">
      <a href="#products" className="mosaic-tile tile-clothing"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="Clothing collection"/><span>CLOTHING <ArrowUpRight/></span></a>
      <a href="#products" className="mosaic-tile tile-bags"><img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85" alt="Leather bag"/><span>BAGS <ArrowUpRight/></span></a>
      <a href="#products" className="mosaic-tile tile-shoes"><img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85" alt="Minimal shoes"/><span>SHOES <ArrowUpRight/></span></a>
      <div className="mosaic-note"><span className="scene-kicker">CURATED WITH CARE</span><h2>THE DETAIL<br/><em>EDIT.</em></h2><p>It is the little things that make the whole.</p><a href="#products" className="dark-link">EXPLORE THE EDIT <ArrowUpRight size={15}/></a></div>
    </section>
    <section className="detail-feature"><img src="https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=2000&q=88" alt="Outerwear editorial"/><div><span className="scene-kicker">DETAILS IN FOCUS</span><h2>THE DETAIL<br/><em>EDIT.</em></h2><p>Texture, proportion, finish. Nothing left to chance.</p><a href="#products" className="cream-button">DISCOVER THE PIECES <ArrowUpRight size={15}/></a></div></section>
    <section className="closing-statement" data-reveal><span className="scene-kicker">CHEC — A WAY OF SEEING</span><h2>DESIGNED WITH INTENTION.<br/><em>WORN WITH EASE.</em><br/>REMEMBERED FOR ELEGANCE.</h2><span className="closing-star">✳</span></section>
    <footer className="footer" id="footer"><div className="footer-top"><div className="footer-brand"><a href="#top" className="brand">CHEC<span>®</span></a><p>Less noise. More style.<br/>A considered wardrobe for modern life.</p><div className="socials"><a href="#footer">INSTAGRAM ↗</a><a href="#footer">PINTEREST ↗</a></div></div><div><h4>DISCOVER</h4><a href="#products">Women</a><a href="#products">Men</a><a href="#products">Shoes</a><a href="#products">Accessories</a></div><div><h4>CUSTOMER CARE</h4><a href="#shipping">Shipping & returns</a><a href="#footer">Size guide</a><a href="#footer">FAQs</a><a href="mailto:care@chec.example">Contact us</a></div><div className="newsletter"><h4>STAY IN THE KNOW</h4><p>Notes on new arrivals, considered design and more.</p><form onSubmit={e => {e.preventDefault();notify("Thank you for subscribing.");e.currentTarget.reset()}}><input type="email" required placeholder="Your email address"/><button aria-label="Subscribe"><ArrowUpRight/></button></form></div></div><div className="footer-bottom"><span>© 2026 CHEC. ALL RIGHTS RESERVED.</span><div><a href="#footer">PRIVACY</a><a href="#footer">TERMS</a><a href="#footer">ACCESSIBILITY</a></div><span>INDIA / ₹ INR</span></div></footer>

    {bagOpen && <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setBagOpen(false)}><aside className="bag-drawer"><div className="drawer-title"><h2>YOUR BAG <small>({count})</small></h2><button onClick={() => setBagOpen(false)}><X/></button></div>{bag.length === 0 ? <div className="bag-empty"><ShoppingBag/><p>Your bag is currently empty.</p><button onClick={() => setBagOpen(false)}>CONTINUE SHOPPING <ArrowRight/></button></div> : <><div className="bag-lines">{bag.map(item => <div className="bag-line" key={item.id}><img src={item.image} alt={item.name}/><div><h3>{item.name}</h3><p>{item.color}</p><strong>{money(item.price)}</strong><div className="quantity"><button onClick={() => qty(item.id,-1)}>−</button><span>{item.qty}</span><button onClick={() => qty(item.id,1)}>+</button></div></div></div>)}</div><div className="bag-total"><p><span>SUBTOTAL</span><strong>{money(subtotal)}</strong></p><small>Shipping and taxes calculated at checkout.</small><button onClick={() => notify("Checkout is not connected yet. Payment setup is required.")}>CHECKOUT <ArrowRight/></button></div></>}</aside></div>}
    {quick && <div className="overlay modal-overlay" onMouseDown={e => e.target === e.currentTarget && setQuick(null)}><div className="quick-modal"><button className="close-modal" onClick={() => setQuick(null)}><X/></button><img src={quick.image} alt={quick.name}/><div><span className="scene-kicker">THE CHEC COLLECTION</span><h2>{quick.name}</h2><strong>{money(quick.price)}</strong><p>Considered design, clean lines and an effortless silhouette. A piece designed to become part of your everyday rotation.</p><button className="modal-add" onClick={() => {add(quick);setQuick(null);setBagOpen(true)}}>ADD TO BAG <ShoppingBag/></button></div></div></div>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);
