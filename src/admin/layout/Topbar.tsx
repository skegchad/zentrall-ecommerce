import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTema } from "../../hooks/useTema";

const TITULOS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/productos": "Productos",
  "/admin/categorias": "Categorías",
  "/admin/pedidos": "Pedidos",
  "/admin/clientes": "Clientes",
  "/admin/reportes": "Reportes",
  "/admin/configuracion": "Configuración",
};

export default function Topbar({
  onAlternarSidebar,
}: {
  onAlternarSidebar: () => void;
}) {
  const { pathname } = useLocation();
  const titulo = TITULOS[pathname.replace(/\/$/, "")] ?? "Panel";

  const { tema, alternar } = useTema();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el menú de usuario al hacer clic fuera
  useEffect(() => {
    const fuera = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  return (
    <div className="adm-topbar">
      <button
        className="adm-topbar__btn adm-topbar__hamburguesa"
        onClick={onAlternarSidebar}
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      <div className="adm-topbar__titulo">
        <small>Panel</small>
        <h1>{titulo}</h1>
      </div>

      <div className="adm-topbar__acciones">
        <label className="adm-topbar__buscador">
          <Search size={17} />
          <input type="search" placeholder="Buscar" />
        </label>

        {/* Botón para cambiar el tema */}
        <button
          type="button"
          className="adm-topbar__btn adm-topbar__tema"
          onClick={alternar}
          aria-label={
            tema === "dark"
              ? "Cambiar a modo claro"
              : "Cambiar a modo oscuro"
          }
          title={
            tema === "dark"
              ? "Cambiar a modo claro"
              : "Cambiar a modo oscuro"
          }
        >
          {tema === "dark" ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

        <button
          className="adm-topbar__btn adm-topbar__notif"
          aria-label="Notificaciones"
        >
          <Bell size={19} />
          <span className="adm-topbar__badge">3</span>
        </button>

        <div className="adm-topbar__usuario" ref={ref}>
          <button
            className="adm-topbar__avatar"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Menú de usuario"
          >
            A
          </button>

          {menuAbierto && (
            <div className="adm-topbar__menu">
              <div className="adm-topbar__menu-cabecera">
                <strong>Administrador</strong>
                <span>admin@zenntral.com</span>
              </div>

              <button>
                <User size={16} /> Mi perfil
              </button>

              <button>
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
