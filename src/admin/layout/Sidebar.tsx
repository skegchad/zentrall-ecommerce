import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  Store,
  LogOut,
} from "lucide-react";
import logo from "../../assets/zentrall-isotipo.svg";

type Item = { a: string; texto: string; icono: React.ReactNode; fin?: boolean };

// Cada sub-arreglo es un grupo; entre grupos se dibuja una línea separadora.
const MENU: Item[][] = [
  [{ a: "/admin", texto: "Dashboard", icono: <LayoutDashboard size={20} />, fin: true }],
  [
    { a: "/admin/planes", texto: "Planes", icono: <Package size={20} /> },
    { a: "/admin/servicios", texto: "Servicios", icono: <Tags size={20} /> },
    { a: "/admin/usuarios", texto: "Usuarios", icono: <Users size={20} /> },
  ],
  [
    { a: "/admin/reportes", texto: "Reportes", icono: <BarChart3 size={20} /> },
    { a: "/admin/configuracion", texto: "Configuración", icono: <Settings size={20} /> },
  ],
];

const clase = ({ isActive }: { isActive: boolean }) =>
  "adm-sidebar__link" + (isActive ? " adm-sidebar__link--activo" : "");

export default function Sidebar({ onNavegar }: { onNavegar: () => void }) {
  return (
    <div className="adm-sidebar">
      <div className="adm-sidebar__marca">
        <span className="adm-sidebar__logo-caja">
          <NavLink to="/" aria-label="Ir al inicio" rel="noopener noreferrer">
            <img src={logo} alt="Zenntral" className="adm-sidebar__logo" />
          </NavLink>
        </span>
        <span className="adm-sidebar__nombre">Zenntral</span>
      </div>

      <div className="adm-sidebar__nav">
        {MENU.map((grupo, i) => (
          <div key={i} className="adm-sidebar__grupo">
            {i > 0 && <span className="adm-sidebar__sep" />}
            {grupo.map((item) => (
              <NavLink
                key={item.a}
                to={item.a}
                end={item.fin}
                onClick={onNavegar}
                className={clase}
                data-tip={item.texto}
                aria-label={item.texto}
              >
                {item.icono}
                <span className="adm-sidebar__texto">{item.texto}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="adm-sidebar__pie">
        <NavLink to="/" className="adm-sidebar__link" data-tip="Ver tienda" aria-label="Ver tienda">
          <Store size={20} />
          <span className="adm-sidebar__texto">Ver tienda</span>
        </NavLink>
        {/* Cuando haya sesión real, aquí se cierra la sesión antes de ir a /login */}
        <NavLink to="/login" className="adm-sidebar__link" data-tip="Cerrar sesión" aria-label="Cerrar sesión">
          <LogOut size={20} />
          <span className="adm-sidebar__texto">Cerrar sesión</span>
        </NavLink>
      </div>
    </div>
  );
}