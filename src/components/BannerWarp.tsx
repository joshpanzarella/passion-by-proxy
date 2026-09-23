"use client";

import { useEffect, useRef } from "react";

// A slow liquid undulation over a banner's art: the same image drawn through
// a small WebGL shader that bends it with a few slow, crossing sine waves.
// The <img> underneath stays as it is, and is all anyone sees with reduced
// motion, without WebGL, or before the first frame (the canvas fades in).
// Draws only while on screen and the page is not melting, at 1x: the art is
// soft, and sharper costs power for nothing. Sized and drifted by the same
// CSS as the <img>.

const VERT = `attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;

// box: canvas size in CSS px, so the waves are the same size on every banner
// fit: the share of the image the box shows (object-fit: cover)
// The bend eases off at the image's edges, so it never reaches past them,
// and builds up over the first seconds, so the canvas fades in over an
// exact match of the <img>.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D img;
uniform float t;
uniform vec2 box;
uniform vec2 fit;
uniform float amp;
varying vec2 v;
void main() {
  vec2 p = v * box / 140.;
  vec2 d = vec2(
    sin(p.y * 1.3 + t * .35) + .6 * sin(p.y * 2.2 - p.x * .7 + t * .5),
    sin(p.x * 1.1 - t * .3) + .6 * sin(p.x * 2.0 + p.y * .9 + t * .42)
  );
  vec2 uv = .5 + (v - .5) * fit;
  vec2 edge = min(uv, 1. - uv);
  float ease = smoothstep(0., .04, min(edge.x, edge.y)) * min(1., t / 3.);
  gl_FragColor = texture2D(img, uv + d * amp * ease);
}`;

const AMP = 0.012; // of the image's size, at amount 1

export function BannerWarp({ src, amount = 1 }: { src: string; amount?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
    if (!gl) return;
    const prog = build(gl);
    if (!prog) return;
    const u = (name: string) => gl.getUniformLocation(prog, name);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(u("amp"), AMP * amount);

    const img = new Image();
    img.src = src;
    const root = document.documentElement;
    let ready = false;
    let visible = false;
    let melting = root.dataset.melting !== undefined;
    let raf = 0;
    let start = 0; // the first frame, so the build-up is seen

    const size = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h || !img.naturalWidth) return;
      canvas.width = Math.round(w);
      canvas.height = Math.round(h);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u("box"), w, h);
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      gl.uniform2f(u("fit"), w / (img.naturalWidth * s), h / (img.naturalHeight * s));
    };

    const frame = (now: number) => {
      start ||= now;
      gl.uniform1f(u("t"), (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      canvas.dataset.on = "";
      raf = visible && !melting ? window.requestAnimationFrame(frame) : 0;
    };
    const run = () => {
      if (ready && visible && !melting && !raf) raf = window.requestAnimationFrame(frame);
    };

    img
      .decode()
      .then(() => {
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        size();
        ready = true;
        run();
      })
      .catch(() => {});

    const seen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        run();
      },
      { rootMargin: "100px" },
    );
    seen.observe(canvas.parentElement ?? canvas);
    // still while the page melts (Melt.tsx): each new frame would have the
    // whole melt redone
    const melt = new MutationObserver(() => {
      melting = root.dataset.melting !== undefined;
      run();
    });
    melt.observe(root, { attributes: true, attributeFilter: ["data-melting"] });
    const resized = new ResizeObserver(size);
    resized.observe(canvas);
    // a lost context leaves the <img> showing
    const lost = () => {
      ready = false;
      delete canvas.dataset.on;
    };
    canvas.addEventListener("webglcontextlost", lost);

    return () => {
      window.cancelAnimationFrame(raf);
      seen.disconnect();
      melt.disconnect();
      resized.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
    };
  }, [src, amount]);

  return <canvas ref={ref} aria-hidden="true" />;
}

function build(gl: WebGLRenderingContext) {
  const prog = gl.createProgram();
  if (!prog) return null;
  for (const [type, text] of [
    [gl.VERTEX_SHADER, VERT],
    [gl.FRAGMENT_SHADER, FRAG],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    gl.attachShader(prog, shader);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  return prog;
}
