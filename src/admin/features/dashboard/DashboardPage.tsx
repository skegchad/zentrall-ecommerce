import { useState } from "react";
import { Package, Truck, Target, ShoppingBag, Wallet, ArrowRight, Layers, ChevronDown } from "lucide-react";
import PieChart3D, { type Rebanada } from "./PieChart3D";

/* ---------- Datos de ejemplo (luego vendrán del backend) ---------- */
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const VENTAS = [40, 55, 48, 70, 62, 85, 66, 92, 78, 105, 88, 110];
const ACTIVO = 9; // Oct

const METRICAS = [
  { titulo: "Meta mensual", sub: "$12,480 de $15,000", icono: <Target size={24} />, progreso: 83, detalle: "$12,480", etiqueta: "19 días" },
  { titulo: "Productos activos", sub: "312 de 400 publicados", icono: <Package size={24} />, progreso: 78, detalle: "312 / 400", etiqueta: "88 libres" },
  { titulo: "Pedidos enviados", sub: "54 pedidos esta semana", icono: <Truck size={24} />, progreso: 62, detalle: "54 / 87", etiqueta: "33 pendientes" },
];

/* Colores de la paleta actual de la página (cámbialos por los del logo cuando quieras) */
type Periodo = "mensual" | "anual";

const COLORES_PLANES = { Gratis: "#38b6d3", Starter: "#f2709c", Negocio: "#5b4fd6", Empresa: "#9a8cf5" };

const planes = (g: number, s: number, n: number, e: number): Rebanada[] => [
  { nombre: "Gratis", valor: g, color: COLORES_PLANES.Gratis },
  { nombre: "Starter", valor: s, color: COLORES_PLANES.Starter },
  { nombre: "Negocio", valor: n, color: COLORES_PLANES.Negocio },
  { nombre: "Empresa", valor: e, color: COLORES_PLANES.Empresa },
];

const PLANES: Record<Periodo, Rebanada[]> = {
  mensual: planes(120, 480, 360, 240),
  anual: planes(70, 250, 520, 360),
};

/* ---------- Gráfico: convierte los datos en una curva suave ---------- */
const W = 600;
const H = 160;

function construirCurva(datos: number[]) {
  const max = Math.max(...datos) * 1.12;
  const min = Math.min(...datos) * 0.55;
  const pts = datos.map((v, i) => [(i / (datos.length - 1)) * W, H - ((v - min) / (max - min)) * H]);

  let linea = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    linea += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return { linea, area: `${linea} L${W},${H} L0,${H} Z`, pts };
}

const CURVA = construirCurva(VENTAS);
const PUNTO = CURVA.pts[ACTIVO];

/* ---------- Tarjeta de curva (se reutiliza para Nuevos y Egresados) ---------- */
function TarjetaCurva({ titulo, id, clase = "" }: { titulo: string; id: string; clase?: string }) {
  return (
    <div className={`adm-resumen ${clase}`.trim()}>
      <header className="adm-resumen__cabecera">
        <h2>{titulo}</h2>
        <select className="adm-resumen__select" defaultValue="mensual" aria-label="Periodo">
          <option value="mensual">Mensual</option>
          <option value="semanal">Semanal</option>
        </select>
      </header>

      <div className="adm-grafico">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="adm-grafico__svg">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={CURVA.area} fill={`url(#${id})`} />
          <path d={CURVA.linea} fill="none" stroke="#ff8fb0" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>

        <span className="adm-grafico__banda" style={{ left: `${(PUNTO[0] / W) * 100}%` }} />
        <span
          className="adm-grafico__punto"
          style={{ left: `${(PUNTO[0] / W) * 100}%`, top: `${(PUNTO[1] / H) * 100}%` }}
        />
        <span
          className="adm-grafico__tip"
          style={{ left: `${(PUNTO[0] / W) * 100}%`, top: `${(PUNTO[1] / H) * 100}%` }}
        >
          <strong>$8,420</strong>
          <small>Ventas</small>
        </span>
      </div>

      <div className="adm-meses">
        {MESES.map((m, i) => (
          <span key={m} className={i === ACTIVO ? "adm-meses__activo" : ""}>{m}</span>
        ))}
      </div>

      <footer className="adm-resumen__pie">
        <div>
          <small>Ingresos</small>
          <strong>$12,480</strong>
          <span>Octubre</span>
        </div>
        <div className="adm-resumen__centro">
          <small>Pedidos totales</small>
          <strong>1,248</strong>
          <span>Octubre</span>
        </div>
        <div>
          <small>Meta</small>
          <strong>$15,000</strong>
          <span>Octubre</span>
        </div>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  const [periodoPlanes, setPeriodoPlanes] = useState<Periodo>("mensual");

  return (
    <div className="adm-dash">
      <div className="adm-dash__principal">
        {/* Fila 1 y 2: dos curvas + tarjetas destacadas */}
        <div className="adm-hero">
          <TarjetaCurva titulo="Usuarios Nuevos" id="adm-grad-nuevos" />
          <TarjetaCurva titulo="Usuarios Egresados" id="adm-grad-egresados" clase="userleft" />

          <div className="adm-hero__lado">
            <div className="adm-destacada">
              <span className="adm-destacada__icono"><ShoppingBag size={26} /></span>
              <strong>Pedidos nuevos</strong>
            </div>

            <div className="adm-destacada adm-destacada--rosa">
              <div className="adm-destacada__fila">
                <span className="adm-destacada__icono"><Wallet size={26} /></span>
                <strong>Ingresos hoy</strong>
              </div>
              <div className="adm-destacada__total">
                <small>Total</small>
                <strong>$1,240</strong>
                <span>12 de octubre</span>
              </div>
              <button className="adm-destacada__ir" aria-label="Ver detalle">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Fila 3: pastel 3D a la izquierda, métricas apiladas a la derecha */}
        <div className="adm-inferior">
          <section className="adm-planes">
            <header className="adm-planes__cabecera">
              <div className="adm-planes__titulo">
                <span className="adm-planes__icono"><Layers size={22} color="white" /></span>
                <h2>Planes contratados</h2>
              </div>
              <label className="adm-planes__selector">
                <select
                  value={periodoPlanes}
                  onChange={(e) => setPeriodoPlanes(e.target.value as Periodo)}
                  aria-label="Periodo de los planes"
                >
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </label>
            </header>
            <PieChart3D datos={PLANES[periodoPlanes]} etiquetaTotal="Total de planes" />
          </section>

          <div className="adm-metricas adm-metricas--columna">
            {METRICAS.map((m) => (
              <div key={m.titulo} className="adm-metrica">
                <span className="adm-metrica__icono">{m.icono}</span>
                <h3>{m.titulo}</h3>
                <p>{m.sub}</p>

                <div className="adm-metrica__progreso">
                  <span>Progreso</span>
                  <strong>{m.progreso}%</strong>
                </div>
                <div className="adm-barra">
                  <div className="adm-barra__relleno" style={{ width: `${m.progreso}%` }} />
                </div>

                <div className="adm-metrica__pie">
                  <small>{m.detalle}</small>
                  <span className="adm-pildora">{m.etiqueta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}