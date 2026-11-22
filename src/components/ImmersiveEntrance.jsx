import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowDown } from "lucide-react";

export default function ImmersiveEntrance() {
  const sectionRef = useRef(null);
  const mountRef = useRef(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const host = mountRef.current;
    const section = sectionRef.current;
    if (!host || !section) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#554839");
    scene.fog = new THREE.Fog("#554839", 12, 42);
    const camera = new THREE.PerspectiveCamera(43, host.clientWidth / host.clientHeight, 0.1, 120);
    camera.position.set(0, 2.1, 9.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);
    const mat = (color, roughness=0.85, metalness=0) => new THREE.MeshStandardMaterial({color, roughness, metalness});
    const plaster = mat("#a38d73"), shadowWall = mat("#665747"), dark = mat("#191817",.65,.12);
    const brass = mat("#b9945e",.28,.7), floorMat = mat("#6b5947"), cream = mat("#e2d2b8");
    const addBox = (parent,w,h,d,material,x,y,z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
      m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
    };

    // Entrance architecture: a real hinged double door in a deep boutique room.
    addBox(world,18,9,.5,plaster,0,4.3,-6.3);
    addBox(world,.5,9,20,shadowWall,-7,4.3,-.2);
    addBox(world,.5,9,20,shadowWall,7,4.3,-.2);
    addBox(world,18,.35,22,floorMat,0,-.18,-.5);
    addBox(world,18,.3,22,plaster,0,8.8,-.5);
    addBox(world,.58,5.3,.8,brass,-2.45,2.65,-3.9);
    addBox(world,.58,5.3,.8,brass,2.45,2.65,-3.9);
    const arch=new THREE.Mesh(new THREE.TorusGeometry(2.2,.18,18,96,Math.PI),brass);
    arch.rotation.z=Math.PI; arch.position.set(0,5.2,-3.9); world.add(arch);
    const left=new THREE.Group(), right=new THREE.Group();
    left.position.set(-2.15,0,-3.82); right.position.set(2.15,0,-3.82); world.add(left,right);
    const makeDoor=(pivot,side)=>{
      addBox(pivot,2.12,4.95,.2,dark,side*1.06,2.48,0);
      for(const x of [.42,1.05,1.68]) addBox(pivot,.035,4.55,.035,brass,side*x,2.48,.13);
      const knob=new THREE.Mesh(new THREE.SphereGeometry(.07,16,12),brass);
      knob.position.set(side*1.78,2.4,.18); pivot.add(knob);
    };
    makeDoor(left,1); makeDoor(right,-1);

    // Chapter two: checkerboard runway wall, mannequin and sculptural display.
    const checker = new THREE.Group(); checker.position.set(0,0,-15); world.add(checker);
    const tile=mat("#ded8cc"), tileDark=mat("#292724");
    const tileSize=.72;
    for(let row=0;row<10;row++) for(let col=0;col<14;col++)
      addBox(checker,tileSize,.62,.12,(row+col)%2?tile:tileDark,(col-6.5)*tileSize,1.1+row*.62,0);
    const mannequin=new THREE.Group(); mannequin.position.set(-1.65,0,-13.2); world.add(mannequin);
    const linen=mat("#d5c5aa");
    const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.48,1.2,6,18),linen); torso.position.y=2.3; torso.scale.set(1.05,1.1,.72); mannequin.add(torso);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(.12,.15,.4,18),linen); neck.position.y=3.2; mannequin.add(neck);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.27,24,18),linen); head.position.y=3.58; mannequin.add(head);
    addBox(mannequin,.08,1.65,.08,brass,0,.9,0);
    const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.55,.62,.16,48),dark); pedestal.position.y=.08; mannequin.add(pedestal);
    const checkerLight=new THREE.PointLight("#f5e3c7",34,16); checkerLight.position.set(0,5,-13); world.add(checkerLight);

    // Chapter three: warm amber product stage and a sculptural handbag.
    const productStage=new THREE.Group(); productStage.position.set(0,0,-27); world.add(productStage);
    const amberWall=mat("#98643a");
    addBox(productStage,18,9,.35,amberWall,0,4.2,-2.8);
    const halo=new THREE.Mesh(new THREE.TorusGeometry(3.25,.12,20,100),mat("#e8bd7e",.25,.3));
    halo.position.set(0,3.55,-2.45); productStage.add(halo);
    const bag=new THREE.Group(); bag.position.set(.15,1.2,-1.3); productStage.add(bag);
    const bagBody=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.55,.72),mat("#d7c4a5",.72));
    bagBody.position.y=.9; bagBody.castShadow=true; bag.add(bagBody);
    const handle=new THREE.Mesh(new THREE.TorusGeometry(.48,.075,14,48,Math.PI),mat("#d7c4a5",.65));
    handle.position.set(0,1.72,0); bag.add(handle);
    const clasp=new THREE.Mesh(new THREE.BoxGeometry(.15,.18,.04),brass); clasp.position.set(0,.98,.39); bag.add(clasp);
    const plinth=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.65,.3,64),mat("#c6a477"));
    plinth.position.set(.15,.15,-1.3); productStage.add(plinth);
    const lantern=new THREE.Mesh(new THREE.CylinderGeometry(.38,.5,1.5,12,1,true),brass);
    lantern.position.set(-4,4.3,-1.9); productStage.add(lantern);
    const branch=new THREE.Group(); branch.position.set(4,1.5,-1.8); productStage.add(branch);
    const stem=new THREE.Mesh(new THREE.CylinderGeometry(.025,.045,4,8),dark); stem.rotation.z=-.18; branch.add(stem);
    for(let i=0;i<7;i++){
      const leaf=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),mat("#4e4936"));
      leaf.scale.set(1.7,.45,.25); leaf.position.set((i%2?-.45:.45),-1.5+i*.48,0); leaf.rotation.z=i%2?.5:-.5; branch.add(leaf);
    }

    const ambient=new THREE.HemisphereLight("#f0ddc1","#261b13",1.55); scene.add(ambient);
    const key=new THREE.DirectionalLight("#ffe1b8",3.1); key.position.set(-4,9,6); key.castShadow=true; key.shadow.mapSize.set(1024,1024); scene.add(key);
    const warm=new THREE.PointLight("#e4a45c",45,24); warm.position.set(0,4,-27); scene.add(warm);
    const rings=[];
    [[-2.6,6.5,-1.2,.72],[2.2,6.1,-2,.48]].forEach(([x,y,z,r])=>{
      const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.035,12,64),mat("#f5d7a4",.25,.3));
      ring.position.set(x,y,z); ring.rotation.x=Math.PI/2.3; world.add(ring); rings.push(ring);
      const light=new THREE.PointLight("#f2c887",18,8); light.position.set(x,y,z); world.add(light);
    });

    let targetProgress=0, currentProgress=0, raf=0, disposed=false, lastChapter=-1;
    const smooth=(a,b,t)=>a+(b-a)*t;
    const updateScroll=()=>{
      const rect=section.getBoundingClientRect();
      const travel=Math.max(1,section.offsetHeight-window.innerHeight);
      targetProgress=THREE.MathUtils.clamp(-rect.top/travel,0,1);
    };
    const onScroll=()=>updateScroll();
    const onResize=()=>{
      camera.aspect=host.clientWidth/host.clientHeight; camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth,host.clientHeight); updateScroll();
    };
    updateScroll();
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",onResize);
    const animate=()=>{
      if(disposed) return;
      raf=requestAnimationFrame(animate);
      currentProgress=smooth(currentProgress,targetProgress,.075);
      const p=currentProgress;
      // One continuous dolly move: entrance -> checkerboard mannequin -> amber bag.
      const points=[
        {x:0,y:2.1,z:9.2,lx:0,ly:1.9,lz:-4.5},
        {x:0,y:2.0,z:1.0,lx:0,ly:2.0,lz:-14.8},
        {x:0,y:2.15,z:-9.0,lx:0,ly:2.1,lz:-27.8},
        {x:0,y:2.0,z:-22.0,lx:0,ly:2.1,lz:-29.2}
      ];
      const scaled=p*3, idx=Math.min(2,Math.floor(scaled)), t=THREE.MathUtils.smoothstep(scaled-idx,0,1);
      const a=points[idx], b=points[idx+1];
      camera.position.set(smooth(a.x,b.x,t),smooth(a.y,b.y,t),smooth(a.z,b.z,t));
      camera.lookAt(smooth(a.lx,b.lx,t),smooth(a.ly,b.ly,t),smooth(a.lz,b.lz,t));
      const doorOpen=THREE.MathUtils.smoothstep(p,.015,.15);
      left.rotation.y=-doorOpen*1.35; right.rotation.y=doorOpen*1.35;
      const productReveal=THREE.MathUtils.smoothstep(p,.55,.82);
      bag.rotation.y=Math.sin(performance.now()*.0005)*.035;
      bag.scale.setScalar(.8+productReveal*.2);
      rings.forEach(r=>r.rotation.z=Math.sin(performance.now()*.0007)*.04);
      scene.background.lerp(new THREE.Color(p<.48?"#554839":"#98643a"),.025);
      scene.fog.color.copy(scene.background);
      const next=p<.29?0:p<.62?1:2;
      if(next!==lastChapter){lastChapter=next;setChapter(next);}
      renderer.render(scene,camera);
    };
    animate();
    return ()=>{
      disposed=true; cancelAnimationFrame(raf);
      window.removeEventListener("scroll",onScroll); window.removeEventListener("resize",onResize);
      renderer.dispose(); renderer.domElement.remove();
      scene.traverse(o=>{if(o.geometry)o.geometry.dispose();});
    };
  },[]);

  const copy=[
    {kicker:"CHEC — OBJECTS FOR EVERYDAY LIFE",title:<>LESS NOISE.<br/><em>MORE STYLE.</em></>,note:"SCROLL TO MOVE THROUGH THE SPACE"},
    {kicker:"A SPACE TO EXPLORE",title:<>STEP INTO<br/><em>THE STUDIO.</em></>,note:"A STUDY IN FORM, MATERIAL AND MOTION"},
    {kicker:"FORM MEETS FUNCTION",title:<>WEIGHTLESS<br/><em>LUXURY.</em></>,note:"AN OBJECT OF INTENT. A STUDY IN FORM."}
  ];
  return <section className="scroll-journey" id="top" ref={sectionRef}>
    <div className="journey-viewport">
      <div className="three-room" ref={mountRef} aria-label="Scroll-controlled three-dimensional CHEC boutique journey"/>
      <div className="journey-vignette"/>
      <div className="journey-copy" key={chapter}>
        <span className="scene-kicker">{copy[chapter].kicker}</span>
        <h1>{copy[chapter].title}</h1>
        <p>{copy[chapter].note}</p>
      </div>
      <div className="journey-progress"><span>0{chapter+1} / 03</span><i><b style={{transform:`scaleX(${(chapter+1)/3})`}}/></i><span>SCROLL TO EXPLORE</span></div>
      <div className="journey-hint"><ArrowDown size={14}/> SCROLL TO MOVE</div>
    </div>
  </section>;
}
