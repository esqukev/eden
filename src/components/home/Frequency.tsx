"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/data/site";
import styles from "./Frequency.module.css";

const VERT = /* glsl */ `
  attribute vec3 aLogo;
  attribute vec3 aChaos;
  attribute float aSeed;
  attribute float aBright;
  uniform float uTime;
  uniform float uProgress;
  uniform float uVelocity;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uHasMouse;
  varying float vBright;
  varying float vGlow;

  void main() {
    float assemble = mix(0.62, 0.88, smoothstep(0.0, 0.8, uProgress));
    vec3 pos = mix(aChaos, aLogo, assemble);
    pos.z += sin(uTime * 0.65 + aSeed * 6.28318) * mix(0.07, 0.018, assemble);

    float dist = length(pos.xy - uMouse);
    float near = uHasMouse * (1.0 - smoothstep(0.08, 1.15, dist));
    pos.xy += normalize(pos.xy - uMouse + vec2(0.0001)) * near * 0.28;
    pos.z += near * 0.32;

    vBright = aBright;
    vGlow = near;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = mix(1.8, 4.6, aBright) + near * 4.5;
    gl_PointSize = size * uPixelRatio * (2.4 / max(1.2, -mv.z));
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying float vBright;
  varying float vGlow;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    if (d > 0.5) discard;
    vec3 bone = vec3(0.925, 0.902, 0.847);
    vec3 color = bone * mix(0.55, 1.0, vBright);
    float alpha = smoothstep(0.5, 0.12, d) * mix(0.55, 1.0, vBright + vGlow);
    gl_FragColor = vec4(color, alpha);
  }
`;

type Sample = {
  logo: Float32Array;
  chaos: Float32Array;
  seed: Float32Array;
  bright: Float32Array;
  logoW: number;
};

function sampleMark(img: HTMLImageElement, step: number): Sample {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return {
      logo: new Float32Array(),
      chaos: new Float32Array(),
      seed: new Float32Array(),
      bright: new Float32Array(),
      logoW: 4.8,
    };
  }
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;
  const aspect = w / Math.max(h, 1);
  const logoW = 4.8;
  const logoH = logoW / aspect;
  const logo: number[] = [];
  const chaos: number[] = [];
  const seed: number[] = [];
  const bright: number[] = [];

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (data[i + 3] < 18 || lum < 24) continue;
      const lx = (x / w - 0.5) * logoW;
      const ly = -(y / h - 0.5) * logoH;
      const s = Math.random();
      const ang = s * Math.PI * 2;
      const rad = 0.25 + Math.random() * 1.55;
      logo.push(lx, ly, (lum / 255 - 0.45) * 0.16);
      chaos.push(
        lx + Math.cos(ang) * rad,
        ly + Math.sin(ang) * rad * 0.48,
        (Math.random() - 0.5) * 1.35,
      );
      seed.push(s);
      bright.push(lum / 255);
    }
  }

  return {
    logo: new Float32Array(logo),
    chaos: new Float32Array(chaos),
    seed: new Float32Array(seed),
    bright: new Float32Array(bright),
    logoW,
  };
}

export function Frequency() {
  const root = useRef<HTMLElement>(null);
  const speed = useRef(0);

  useLenis((lenis) => {
    speed.current = lenis.velocity;
  });

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const canvas = el.querySelector<HTMLCanvasElement>("[data-canvas]");
      const sceneEl = el.querySelector<HTMLElement>("[data-scene]");
      const stage = el.querySelector<HTMLElement>("[data-stage]");
      if (!canvas || !sceneEl || !stage) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        });
      } catch {
        return;
      }

      renderer.setClearColor(0x080704, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
      camera.position.set(0, 0, 6.2);

      const uniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uVelocity: { value: 0 },
        uPixelRatio: { value: 1 },
        uMouse: { value: new THREE.Vector2(40, 40) },
        uHasMouse: { value: 0 },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
      });
      const points = new THREE.Points(new THREE.BufferGeometry(), material);
      scene.add(points);

      const state = { p: 0 };
      const mouse = { x: 40, y: 40 };
      const mouseTarget = { x: 40, y: 40 };
      let hasPointer = false;
      let logoW = 4.8;
      let disposed = false;
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const hit = new THREE.Vector3();
      const localPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const worldPlane = new THREE.Plane();

      const apply = () => {
        const t = state.p;
        uniforms.uProgress.value = t;
        points.rotation.y = Math.sin(uniforms.uTime.value * 0.18) * 0.06 + (t - 0.5) * 0.18;
        points.rotation.x = 0.1 - t * 0.12;
        camera.position.z = 6.4 - t * 1.7;
        camera.lookAt(0, 0, 0);
      };

      const fit = () => {
        const w = stage.clientWidth || window.innerWidth;
        const h = stage.clientHeight || window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        uniforms.uPixelRatio.value = dpr;
        const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * 6.2;
        const visW = visH * camera.aspect;
        const target = Math.min(visW * 0.82, visH * 2.1);
        points.scale.setScalar(target / logoW);
      };

      const draw = () => {
        apply();
        renderer.render(scene, camera);
      };

      const tick = (_time: number, delta: number) => {
        if (disposed) return;
        uniforms.uTime.value += delta * 0.00105;
        uniforms.uVelocity.value += (Math.abs(speed.current) - uniforms.uVelocity.value) * 0.1;
        mouse.x += (mouseTarget.x - mouse.x) * 0.12;
        mouse.y += (mouseTarget.y - mouse.y) * 0.12;
        uniforms.uMouse.value.set(mouse.x, mouse.y);
        uniforms.uHasMouse.value = hasPointer ? 1 : 0;
        draw();
      };

      const onPointer = (event: PointerEvent) => {
        const box = stage.getBoundingClientRect();
        pointer.x = ((event.clientX - box.left) / box.width) * 2 - 1;
        pointer.y = -((event.clientY - box.top) / box.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        points.updateMatrixWorld();
        worldPlane.copy(localPlane).applyMatrix4(points.matrixWorld);
        if (raycaster.ray.intersectPlane(worldPlane, hit)) {
          points.worldToLocal(hit);
          mouseTarget.x = hit.x;
          mouseTarget.y = hit.y;
          hasPointer = true;
        }
      };

      const onLeave = () => {
        hasPointer = false;
      };

      const img = new Image();
      img.decoding = "async";
      img.src = site.mark;
      img.onload = () => {
        if (disposed) return;
        const step = window.innerWidth < 900 ? 6 : 4;
        const sample = sampleMark(img, step);
        if (sample.logo.length < 9) return;
        logoW = sample.logoW;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(sample.logo, 3));
        geometry.setAttribute("aLogo", new THREE.BufferAttribute(sample.logo, 3));
        geometry.setAttribute("aChaos", new THREE.BufferAttribute(sample.chaos, 3));
        geometry.setAttribute("aSeed", new THREE.BufferAttribute(sample.seed, 1));
        geometry.setAttribute("aBright", new THREE.BufferAttribute(sample.bright, 1));
        points.geometry.dispose();
        points.geometry = geometry;
        fit();
        draw();
      };
      img.onerror = () => undefined;

      fit();
      draw();
      window.addEventListener("resize", fit);
      stage.addEventListener("pointermove", onPointer);
      stage.addEventListener("pointerleave", onLeave);
      gsap.ticker.add(tick);

      gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sceneEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
          invalidateOnRefresh: true,
          onRefresh: fit,
        },
      });

      return () => {
        disposed = true;
        window.removeEventListener("resize", fit);
        stage.removeEventListener("pointermove", onPointer);
        stage.removeEventListener("pointerleave", onLeave);
        gsap.ticker.remove(tick);
        points.geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} id="frecuencia">
      <div className={styles.scene} data-scene>
        <div className={styles.sticky} data-stage>
          <canvas className={styles.canvas} data-canvas />
        </div>
      </div>
      <footer className={styles.end}>
        <a href={site.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </footer>
    </section>
  );
}
