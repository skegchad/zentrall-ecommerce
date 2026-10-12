import { useState } from "react";
import { Package, Truck, Target, ShoppingBag, Wallet, ArrowRight, Mail, MapPin } from "lucide-react";

/* ---------- Datos de ejemplo (luego vendrán del backend) ---------- */
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const VENTAS = [40, 55, 48, 70, 62, 85, 66, 92, 78, 105, 88, 110];
const ACTIVO = 9; // Oct

const METRICAS = [
  { titulo: "Productos activos", sub: "312 de 400 publicados", icono: <Package size={24} />, progreso: 78, detalle: "312 / 400", etiqueta: "88 libres" },
  { titulo: "Pedidos enviados", sub: "54 pedidos esta semana", icono: <Truck size={24} />, progreso: 62, detalle: "54 / 87", etiqueta: "33 pendientes" },
  { titulo: "Meta mensual", sub: "$12,480 de $15,000", icono: <Target size={24} />, progreso: 83, detalle: "$12,480", etiqueta: "19 días" },
];

/*const ACTIVIDAD = {
  pedidos: [
    { nombre: "María Gómez", detalle: "Pedido #1048 · $85.00", hace: "hace 5 min", color: "#7c5cd6" },
    { nombre: "Luis Andrade", detalle: "Pedido #1047 · $42.50", hace: "hace 22 min", color: "#f2709c" },
    { nombre: "Carla Ruiz", detalle: "Pedido #1046 · $130.00", hace: "hace 1 h", color: "#0ea5b7" },
    { nombre: "Jorge Vera", detalle: "Pedido #1045 · $27.90", hace: "hace 3 h", color: "#f59e0b" },
    { nombre: "Ana Lema", detalle: "Pedido #1044 · $64.00", hace: "hace 5 h", color: "#22a06b" },
  ],
  clientes: [
    { nombre: "Pedro Mora", detalle: "Nuevo registro", hace: "hace 10 min", color: "#7c5cd6" },
    { nombre: "Sofía Peña", detalle: "Nuevo registro", hace: "hace 48 min", color: "#f2709c" },
    { nombre: "Diego Cruz", detalle: "Nuevo registro", hace: "hace 2 h", color: "#0ea5b7" },
    { nombre: "Valeria Paz", detalle: "Nuevo registro", hace: "hace 4 h", color: "#f59e0b" },
    { nombre: "Iván Soto", detalle: "Nuevo registro", hace: "ayer", color: "#22a06b" },
  ],
};*/  

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

export default function DashboardPage() {
  const [tab, setTab] = useState<"pedidos" | "clientes">("pedidos");

  return (
    <div className="adm-dash">
      {/* ================= Columna principal ================= */}
      <div className="adm-dash__principal">
        <div className="adm-hero">
          {/* Tarjeta grande con gráfico */}
          <div className="adm-resumen">
            <header className="adm-resumen__cabecera">
              <h2>Usuarios Nuevos</h2>
              <select className="adm-resumen__select" defaultValue="mensual" aria-label="Periodo">
                <option value="mensual">Mensual</option>
                <option value="semanal">Semanal</option>
              </select>
            </header>

            <div className="adm-grafico">
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="adm-grafico__svg">
                <defs>
                  <linearGradient id="adm-grad-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={CURVA.area} fill="url(#adm-grad-area)" />
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
          <div className="adm-resumen userleft" >
            <header className="adm-resumen__cabecera">
              <h2>Usuarios Egresados</h2>
              <select className="adm-resumen__select" defaultValue="mensual" aria-label="Periodo">
                <option value="mensual">Mensual</option>
                <option value="semanal">Semanal</option>
              </select>
            </header>

            <div className="adm-grafico">
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="adm-grafico__svg">
                <defs>
                  <linearGradient id="adm-grad-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={CURVA.area} fill="url(#adm-grad-area)" />
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

        {/* Tarjetas con ícono sobresaliente */}
        <div className="adm-metricas">
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
  );
}