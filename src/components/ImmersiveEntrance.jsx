import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function ImmersiveEntrance() {
  const mountRef = useRef(null);
  const sceneApi = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#554839");
    scene.fog = new THREE.Fog("#554839", 9, 24);
    const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.1, 80);
    camera.position.set(0, 2.1, 8.7);
    camera.lookAt(0, 1.8, -3.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    host.appendChild(renderer.domElement);

    const room = new THREE.Group();
    scene.add(room);
    const plaster = new THREE.MeshStandardMaterial({ color: "#a38d73", roughness: 0.94 });
    const sideMat = new THREE.MeshStandardMaterial({ color: "#796956", roughness: 0.95 });
    const dark = new THREE.MeshStandardMaterial({ color: "#171716", roughness: 0.68 });
    const brass = new THREE.MeshStandardMaterial({ color: "#b9945e", metalness: 0.72, roughness: 0.27 });
    const floorMat = new THREE.MeshStandardMaterial({ color: "#665443", roughness: 0.88 });
    const addBox = (w,h,d,mat,x,y,z,parent=room) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
      mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    };

    addBox(18, 9, 0.45, plaster, 0, 4.3, -6.3);
    addBox(0.45, 9, 14, sideMat, -6.9, 4.3, 0);
    addBox(0.45, 9, 14, sideMat, 6.9, 4.3, 0);
    addBox(18, 0.35, 14, floorMat, 0, -0.18, 0);
    addBox(18, 0.3, 14, plaster, 0, 8.8, 0);
    // Architectural doorway surround: thick stone piers and a curved crown.
    addBox(0.62, 5.2, 0.8, brass, -2.55, 2.6, -3.85);
    addBox(0.62, 5.2, 0.8, brass, 2.55, 2.6, -3.85);
    const archCurve = new THREE.TorusGeometry(2.25, 0.19, 18, 96, Math.PI);
    const arch = new THREE.Mesh(archCurve, brass);
    arch.rotation.z = Math.PI; arch.position.set(0, 5.2, -3.85); arch.castShadow = true; room.add(arch);
    addBox(4.5, 0.25, 0.8, brass, 0, 5.1, -3.85);

    // Double doors pivot on their outer edges so the opening is physically hinged.
    const doorMaterial = new THREE.MeshStandardMaterial({ color: "#211f1c", roughness: 0.58, metalness: 0.12 });
    const doorLeft = new THREE.Group(); doorLeft.position.set(-2.2, 0, -3.82); room.add(doorLeft);
    const doorRight = new THREE.Group(); doorRight.position.set(2.2, 0, -3.82); room.add(doorRight);
    const makeDoor = (pivot, side) => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(2.18, 4.98, 0.2), doorMaterial);
      panel.position.x = side * 1.09; panel.position.y = 2.5; panel.castShadow = true; panel.receiveShadow = true; pivot.add(panel);
      for (let x of [0.42, 1.08, 1.74]) {
        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 4.6, 0.025), brass);
        strip.position.set(side * x, 2.5, 0.12); pivot.add(strip);
      }
      const handle = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), brass);
      handle.position.set(side * 1.8, 2.45, 0.18); pivot.add(handle);
    };
    makeDoor(doorLeft, 1); makeDoor(doorRight, -1);

    // Rear studio glimpsed beyond the doors.
    addBox(12, 7, 0.25, new THREE.MeshStandardMaterial({ color: "#8e785d", roughness: 1 }), 0, 3.4, -11.7);
    const mannequin = new THREE.Group(); mannequin.position.set(0.4, 0, -9.6); room.add(mannequin);
    const linen = new THREE.MeshStandardMaterial({ color: "#d2c0a2", roughness: 0.92 });
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 1.15, 6, 16), linen);
    torso.position.y = 2.25; torso.scale.set(1, 1.15, 0.68); mannequin.add(torso);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.42, 18), linen); neck.position.y = 3.15; mannequin.add(neck);
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,1.8,12), brass); stand.position.y = 0.9; mannequin.add(stand);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.48,0.48,0.08,32), dark); base.position.y = 0.05; mannequin.add(base);

    // Ochre lounge chair, kept to the right edge of the entrance.
    const chairMat = new THREE.MeshStandardMaterial({ color: "#a97932", roughness: 0.84 });
    const chair = new THREE.Group(); chair.position.set(4.25, 0, 1.0); room.add(chair);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.65,0.5,1.3), chairMat); seat.position.y = 0.75; seat.castShadow = true; chair.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.65,1.7,0.38), chairMat); back.position.set(0,1.75,-0.48); back.castShadow = true; chair.add(back);
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.15,0.18,0.86), new THREE.MeshStandardMaterial({color:"#eee8dc",roughness:1})); cushion.position.set(0,1.08,0.12); chair.add(cushion);
    for (const x of [-0.62,0.62]) for (const z of [-0.45,0.45]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.035,0.65,10), dark); leg.position.set(x,0.32,z); chair.add(leg);
    }

    // Hanging luminous rings.
    const ringMat = new THREE.MeshStandardMaterial({ color:"#f5d7a4", emissive:"#dba85c", emissiveIntensity:2.4, metalness:0.3, roughness:0.25 });
    [[-2.8,6.7,-1.0,0.72],[2.2,6.15,-1.8,0.48]].forEach(([x,y,z,r]) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r,0.035,12,64), ringMat);
      ring.position.set(x,y,z); ring.rotation.x = Math.PI/2.3; room.add(ring);
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,1.1,8), dark); cable.position.set(x,y+0.55,z); room.add(cable);
      const glow = new THREE.PointLight("#f2c887", 24, 7); glow.position.set(x,y-0.1,z); room.add(glow);
    });

    const ambient = new THREE.HemisphereLight("#e9d4b2", "#2b2118", 1.6); scene.add(ambient);
    const key = new THREE.DirectionalLight("#ffe0b1", 3.2); key.position.set(-3,8,5); key.castShadow = true; key.shadow.mapSize.set(1024,1024); scene.add(key);
    const fill = new THREE.PointLight("#d89b55", 34, 15); fill.position.set(0,3,-7); scene.add(fill);

    // Fine architectural grooves on the side walls.
    for (let x=-6.45; x<=-6.0; x+=0.12) addBox(0.018,8.5,0.018,brass,x,4.2,-0.2);
    for (let x=6.0; x<=6.45; x+=0.12) addBox(0.018,8.5,0.018,brass,x,4.2,-0.2);

    let progress = 0, target = 0, raf = 0, disposed = false;
    const animate = () => {
      if (disposed) return;
      raf = requestAnimationFrame(animate);
      progress += (target - progress) * 0.055;
      const eased = progress * progress * (3 - 2 * progress);
      doorLeft.rotation.y = -eased * 1.32;
      doorRight.rotation.y = eased * 1.32;
      camera.position.z = 8.7 - eased * 7.0;
      camera.position.y = 2.1 - eased * 0.12;
      camera.position.x = Math.sin(eased * Math.PI) * 0.12;
      camera.lookAt(0, 1.9, -4.2 - eased * 1.5);
      ringMat.emissiveIntensity = 2.1 + Math.sin(performance.now() * 0.0017) * 0.25;
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      if (!host) return;
      camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", resize);
    sceneApi.current = { open: () => { target = 1; setEntered(true); }, reset: () => { target = 0; setEntered(false); } };
    return () => {
      disposed = true; cancelAnimationFrame(raf); window.removeEventListener("resize", resize);
      renderer.dispose(); renderer.domElement.remove();
      room.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); });
      sceneApi.current = null;
    };
  }, []);

  const enter = () => {
    sceneApi.current?.open();
    window.setTimeout(() => document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" }), 1700);
  };
  const handleWheel = event => {
    if (event.deltaY > 0 && !entered) { event.preventDefault(); enter(); }
  };

  return <section className="scene-opening real-3d-entrance" id="top" onWheel={handleWheel}>
    <div className="three-room" ref={mountRef} aria-label="Interactive three-dimensional boutique entrance" />
    <div className="opening-grain"/>
    <div className="opening-copy"><span className="scene-kicker">CHEC — OBJECTS FOR EVERYDAY LIFE</span><h1>LESS NOISE.<br/><em>MORE STYLE.</em></h1>
      <button className="scene-link enter-3d" onClick={enter}>{entered ? "ENTERING THE STUDIO" : "OPEN THE DOORS"} {entered ? <ArrowRight size={15}/> : <ArrowDown size={15}/>}</button>
    </div>
    <div className="scene-counter">01 / 08 <span>{entered ? "WELCOME INSIDE" : "SCROLL OR OPEN THE DOORS"}</span></div>
  </section>;
}
