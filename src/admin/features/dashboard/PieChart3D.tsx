import { useEffect, useRef, useState } from "react";

/* ============================================================
   Gráfico de pastel 3D con WebGL puro (sin dependencias).
   - Cámara baja (vista casi lateral) y sombreado suave.
   - Cada rebanada es un sólido extruido con tapa levemente abombada.
   - Al cambiar los datos, las rebanadas se animan hasta el nuevo valor.
   - Se mece suavemente; se puede arrastrar para girarlo.
   - Al pasar el mouse por la leyenda, la rebanada se separa.
   ============================================================ */

export type Rebanada = { nombre: string; valor: number; color: string };

type Props = { datos: Rebanada[]; etiquetaTotal?: string };

/* ---------- Shaders ---------- */
const VS = `
attribute vec3 aPos;
attribute vec3 aNormal;
uniform mat4 uMVP;
uniform mat4 uModel;
uniform vec3 uOffset;
varying vec3 vN;
varying vec3 vP;
void main() {
  vN = (uModel * vec4(aNormal, 0.0)).xyz;
  vP = aPos;
  gl_Position = uMVP * vec4(aPos + uOffset, 1.0);
}`;

/* Iluminación "envolvente" + color pastel: sin brillos duros */
const FS = `
precision mediump float;
varying vec3 vN;
varying vec3 vP;
uniform vec3 uColor;
uniform float uGlow;
void main() {
  vec3 n = normalize(vN);
  vec3 l = normalize(vec3(-0.3, 0.8, 0.6));
  float d = dot(n, l) * 0.5 + 0.5;
  vec3 base = mix(uColor, vec3(1.0), 0.12);
  base = mix(base, vec3(1.0), clamp(uGlow * 0.48, 0.0, 0.48));
  vec3 c = base * (0.68 + 0.40 * d);
  c *= mix(0.80, 1.0, clamp(n.y, 0.0, 1.0));            // costados un poco más oscuros
  c += vec3(1.0) * pow(max(n.y, 0.0), 3.0) * 0.06;      // brillo suave arriba
  c = mix(c, vec3(1.0), 0.08 * (1.0 - clamp(length(vP.xz), 0.0, 1.0))); // centro más claro
  c += uGlow * 0.08;
  gl_FragColor = vec4(c, 1.0);
}`;

/* ---------- Matemática mínima (matrices column-major) ---------- */
type M4 = Float32Array;
const perspectiva = (fovy: number, asp: number, n: number, f: number): M4 => {
  const k = 1 / Math.tan(fovy / 2);
  return new Float32Array([k / asp, 0, 0, 0, 0, k, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0]);
};
const rotX = (t: number): M4 => {
  const c = Math.cos(t), s = Math.sin(t);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
};
const rotY = (t: number): M4 => {
  const c = Math.cos(t), s = Math.sin(t);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
};
const trasladar = (x: number, y: number, z: number): M4 =>
  new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
const mul = (a: M4, b: M4): M4 => {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
};
const proyectar = (m: M4, x: number, y: number, z: number, ancho: number, alto: number): [number, number] => {
  const cx = m[0] * x + m[4] * y + m[8] * z + m[12];
  const cy = m[1] * x + m[5] * y + m[9] * z + m[13];
  const cw = m[3] * x + m[7] * y + m[11] * z + m[15];
  return [((cx / cw) * 0.5 + 0.5) * ancho, (1 - ((cy / cw) * 0.5 + 0.5)) * alto];
};

const hexARgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const n = parseInt(v, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/* ---------- Geometría: rebanadas extruidas ---------- */
const RADIO = 1;
const ALTO = 0.40;
const ABOMBADO = 0.45; // cuánto se inclinan las normales de la tapa hacia el borde (efecto "almohadilla")

function construirGeometria(valores: number[]) {
  const total = valores.reduce((s, x) => s + x, 0) || 1;
  const v: number[] = [];
  const rangos: { first: number; count: number; mid: number }[] = [];
  const y0 = -ALTO / 2;
  const y1 = ALTO / 2;

  const push = (p: number[], n: number[]) => v.push(p[0], p[1], p[2], n[0], n[1], n[2]);

  let ang = -Math.PI / 2;
  for (const valor of valores) {
    const a0 = ang;
    const a1 = ang + (valor / total) * Math.PI * 2;
    ang = a1;
    const first = v.length / 6;
    const pasos = Math.max(2, Math.ceil(((a1 - a0) / (Math.PI * 2)) * 72));
    const arco = (i: number) => a0 + ((a1 - a0) * i) / pasos;

    for (let i = 0; i < pasos; i++) {
      const s0 = arco(i), s1 = arco(i + 1);
      const c0 = Math.cos(s0), z0 = Math.sin(s0);
      const c1 = Math.cos(s1), z1 = Math.sin(s1);

      // Tapa superior: centro hacia arriba, borde levemente inclinado hacia afuera
      const nb0 = normalizar([c0 * ABOMBADO, 1, z0 * ABOMBADO]);
      const nb1 = normalizar([c1 * ABOMBADO, 1, z1 * ABOMBADO]);
      push([0, y1, 0], [0, 1, 0]);
      push([c0 * RADIO, y1, z0 * RADIO], nb0);
      push([c1 * RADIO, y1, z1 * RADIO], nb1);

      // Pared exterior (normales suaves)
      push([c0 * RADIO, y0, z0 * RADIO], [c0, 0, z0]);
      push([c1 * RADIO, y0, z1 * RADIO], [c1, 0, z1]);
      push([c1 * RADIO, y1, z1 * RADIO], [c1, 0, z1]);
      push([c0 * RADIO, y0, z0 * RADIO], [c0, 0, z0]);
      push([c1 * RADIO, y1, z1 * RADIO], [c1, 0, z1]);
      push([c0 * RADIO, y1, z0 * RADIO], [c0, 0, z0]);
    }

    // Paredes radiales (los cortes entre rebanadas)
    const pared = (s: number, normal: number[]) => {
      const x = Math.cos(s) * RADIO, z = Math.sin(s) * RADIO;
      push([0, y0, 0], normal);
      push([x, y0, z], normal);
      push([x, y1, z], normal);
      push([0, y0, 0], normal);
      push([x, y1, z], normal);
      push([0, y1, 0], normal);
    };
    pared(a0, [Math.sin(a0), 0, -Math.cos(a0)]);
    pared(a1, [-Math.sin(a1), 0, Math.cos(a1)]);

    rangos.push({ first, count: v.length / 6 - first, mid: (a0 + a1) / 2 });
  }

  return { data: new Float32Array(v), rangos };
}

function normalizar(n: number[]) {
  const l = Math.hypot(n[0], n[1], n[2]) || 1;
  return [n[0] / l, n[1] / l, n[2] / l];
}

/* ---------- Componente ---------- */
export default function PieChart3D({ datos, etiquetaTotal = "Total" }: Props) {
  const contRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sombraRef = useRef<HTMLDivElement>(null);
  const datosRef = useRef<Rebanada[]>(datos);
  datosRef.current = datos;
  const activoRef = useRef<number | null>(null);
  const [activo, setActivoState] = useState<number | null>(null);
  const [sinWebgl, setSinWebgl] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<{
    indice: number;
    x: number;
    y: number;
    } | null>(null);

  const setActivo = (i: number | null) => {
    activoRef.current = i;
    setActivoState(i);
  };

  const total = datos.reduce((s, d) => s + d.valor, 0) || 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const cont = contRef.current;
    if (!canvas || !cont) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) {
      setSinWebgl(true);
      return;
    }

    /* Programa */
    const compilar = (tipo: number, src: string) => {
      const s = gl.createShader(tipo)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compilar(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const loc = {
      pos: gl.getAttribLocation(prog, "aPos"),
      normal: gl.getAttribLocation(prog, "aNormal"),
      mvp: gl.getUniformLocation(prog, "uMVP"),
      model: gl.getUniformLocation(prog, "uModel"),
      offset: gl.getUniformLocation(prog, "uOffset"),
      color: gl.getUniformLocation(prog, "uColor"),
      glow: gl.getUniformLocation(prog, "uGlow"),
    };

    /* Geometría (se reconstruye mientras los valores se animan) */
    let actual = datosRef.current.map((d) => d.valor);
    let geo = construirGeometria(actual);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, geo.data, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(loc.pos);
    gl.vertexAttribPointer(loc.pos, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(loc.normal);
    gl.vertexAttribPointer(loc.normal, 3, gl.FLOAT, false, 24, 12);

    const subir = () => {
      geo = construirGeometria(actual);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, geo.data, gl.DYNAMIC_DRAW);
    };

    const separacion: number[] = [];

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    /* Tamaño */
    let ancho = 1, alto = 1;
    let yawActual = -0.3;
    const ajustar = () => {
      const r = cont.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = Math.max(1, r.width);
      alto = Math.max(1, r.height);
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(cont);

    /* Arrastrar para girar */
    let arrastrando = false;
    let ultimoX = 0;
    let ultimoY = 0;

    let yawArrastre = 0;
    let pitchArrastre = 0;
    let pitchObjetivo = 0.4;
    const down = (e: PointerEvent) => {
    if (e.button !== 0) return;

    arrastrando = true;
    ultimoX = e.clientX;
    ultimoY = e.clientY;

    canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
        if (!arrastrando) return;

        const dx = e.clientX - ultimoX;
        const dy = e.clientY - ultimoY;

        yawArrastre += dx * 0.008;
        pitchArrastre += dy * 0.006;

        // Evita que el pastel termine completamente invertido.
        pitchArrastre = Math.max(
            -0.35,
            Math.min(0.35, pitchArrastre)
        );

        ultimoX = e.clientX;
        ultimoY = e.clientY;
        };

    const up = () => {
        arrastrando = false;
    };
    const detectarRebanada = (e: PointerEvent) => {
    if (arrastrando) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Coordenadas normalizadas respecto al centro del gráfico.
    const nx = (x - rect.width / 2) / (rect.width * 0.43);
    const ny = (y - rect.height / 2) / (rect.height * 0.43);

    // Descartar el cursor cuando está fuera del pastel.
    if (nx * nx + ny * ny > 1.05) {
        setHoverInfo(null);
        setActivo(null);
        return;
    }

    // Aproximación angular que compensa el giro horizontal.
    const px = nx * Math.cos(yawActual) - ny * Math.sin(yawActual);
    const pz = nx * Math.sin(yawActual) + ny * Math.cos(yawActual);

    let angulo = Math.atan2(pz, px);
    angulo = ((angulo + Math.PI / 2) % (Math.PI * 2) + Math.PI * 2)
        % (Math.PI * 2);

    const totalActual = datosRef.current.reduce(
        (s, d) => s + d.valor,
        0
    );

    if (totalActual <= 0) return;

    let acumulado = 0;
    let indice = -1;

    for (let i = 0; i < datosRef.current.length; i++) {
        acumulado +=
        (datosRef.current[i].valor / totalActual) * Math.PI * 2;

        if (angulo <= acumulado) {
        indice = i;
        break;
        }
    }

    if (indice >= 0) {
        setActivo(indice);
        setHoverInfo({ indice, x, y });
    }
    };
        
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("lostpointercapture", up);
    canvas.addEventListener("pointermove", detectarRebanada);

    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const FOV = (30 * Math.PI) / 180;
    const TILT = 0.4; // cámara baja (~23° de elevación)
    const SEP_BASE = 0.025; // pequeña separación permanente entre rebanadas
    const SEP_HOVER = 0.12;
    const cacheColor = new Map<string, [number, number, number]>();
    const colorDe = (hex: string) => {
      let c = cacheColor.get(hex);
      if (!c) { c = hexARgb(hex); cacheColor.set(hex, c); }
      return c;
    };
    let raf = 0;

    const dibujar = (t: number) => {
      /* Animar valores hacia los datos actuales */
      const ds = datosRef.current;
      const objetivo = ds.map((d) => d.valor);
      if (objetivo.length !== actual.length) {
        actual = objetivo.slice();
        subir();
      } else {
        const tot = objetivo.reduce((s, x) => s + x, 0) || 1;
        let cambio = false;
        actual = actual.map((val, i) => {
          const dif = objetivo[i] - val;
          if (Math.abs(dif) > tot * 0.0005) { cambio = true; return val + dif * 0.12; }
          return objetivo[i];
        });
        if (cambio) subir();
      }
      while (separacion.length < ds.length) separacion.push(0);

      const aspecto = ancho / alto;
      const tanMitad = Math.tan(FOV / 2);
      const distancia = Math.max(2.7 / (2 * tanMitad * aspecto), 1.9 / (2 * tanMitad), 3.2);

      // Giro continuo antihorario, independiente del arrastre.
        const giroContinuo = reducir ? 0 : -t * 0.00025;

        if (!arrastrando) {
        yawArrastre *= 0.96;
        pitchArrastre *= 0.90;
        }

        const balanceo = reducir
        ? 0
        : Math.sin(t * 0.0007) * 0.035;

        const yaw = -0.3 + giroContinuo + balanceo + yawArrastre;
        yawActual = yaw;
        const pitch = TILT + pitchArrastre;

        const modelo = mul(rotX(pitch), rotY(yaw));
      const mvp = mul(perspectiva(FOV, aspecto, 0.1, 50), mul(trasladar(0, 0, -distancia), modelo));

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(loc.mvp, false, mvp);
      gl.uniformMatrix4fv(loc.model, false, modelo);

      geo.rangos.forEach((rg, i) => {
        const obj = activoRef.current === i ? 1 : 0;
        separacion[i] += (obj - separacion[i]) * 0.14;
        const s = SEP_BASE + separacion[i] * SEP_HOVER;
        const c = colorDe(ds[i].color);
        gl.uniform3f(loc.offset, Math.cos(rg.mid) * s, 0, Math.sin(rg.mid) * s);
        gl.uniform3f(loc.color, c[0], c[1], c[2]);
        gl.uniform1f(loc.glow, separacion[i]);
        gl.drawArrays(gl.TRIANGLES, rg.first, rg.count);
      });

      /* Sombra suave en el suelo (elemento HTML desenfocado bajo el pastel) */
      const sombra = sombraRef.current;
      if (sombra) {
        const [px, py] = proyectar(mvp, 0, -ALTO / 2 - 0.03, 0, ancho, alto);
        const pxPorUnidad = alto / (2 * distancia * tanMitad);
        const w = 2 * 1.2 * pxPorUnidad;
        sombra.style.width = `${w}px`;
        sombra.style.height = `${w * Math.sin(TILT) * 0.85}px`;
        sombra.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
        sombra.style.opacity = "1";
      }

      raf = requestAnimationFrame(dibujar);
    };
    raf = requestAnimationFrame(dibujar);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("lostpointercapture", up);
      canvas.removeEventListener("pointermove", detectarRebanada);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <div className="adm-pie">
      <div className="adm-pie__escena" ref={contRef}>
        {sinWebgl ? (
          <p className="adm-pie__error">Tu navegador no soporta WebGL.</p>
        ) : (
          <>
            <div ref={sombraRef} className="adm-pie__sombra" style={{ opacity: 0 }} />
            <canvas
              ref={canvasRef}
              className="adm-pie__canvas"
              aria-label="Gráfico de pastel 3D de planes contratados"
              role="img"
            />
                        {hoverInfo && datos[hoverInfo.indice] && (
            <div
                className="adm-pie__tooltip"
                style={{
                left: hoverInfo.x,
                top: hoverInfo.y,
                }}
            >
                <span
                className="adm-pie__tooltip-punto"
                style={{
                    background: datos[hoverInfo.indice].color,
                }}
                />

                <div>
                <small>Plan contratado</small>
                <strong>{datos[hoverInfo.indice].nombre}</strong>
                <span>
                    {(
                    (datos[hoverInfo.indice].valor / total) * 100
                    ).toFixed(1)}%
                </span>
                </div>
            </div>
            )}
          </>
        )}
      </div>

      <div className="adm-pie__panel">
        <ul className="adm-pie__leyenda">
          {datos.map((d, i) => (
            <li
              key={d.nombre}
              className={activo === i ? "adm-pie__item adm-pie__item--activo" : "adm-pie__item"}
              onMouseEnter={() => setActivo(i)}
              onMouseLeave={() => setActivo(null)}
              onFocus={() => setActivo(i)}
              onBlur={() => setActivo(null)}
              tabIndex={0}
            >
              <span className="adm-pie__punto" style={{ background: d.color }} />
              <div className="adm-pie__texto">
                <div className="adm-pie__linea">
                  <span className="adm-pie__nombre">{d.nombre}</span>
                  <span className="adm-pie__valor">{d.valor.toLocaleString("en-US")}</span>
                </div>
                <small className="adm-pie__pct">{((d.valor / total) * 100).toFixed(1)}%</small>
              </div>
            </li>
          ))}
        </ul>

        <div className="adm-pie__total">
          <span>{etiquetaTotal}</span>
          <strong>{total.toLocaleString("en-US")}</strong>
        </div>
      </div>
    </div>
  );
}