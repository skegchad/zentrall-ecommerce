import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AdminLayout.css";

export default function AdminLayout() {
  // En móvil el sidebar es un cajón deslizable; en escritorio siempre está visible.
  const [movilAbierto, setMovilAbierto] = useState(false);

  return (
    <div className={"admin" + (movilAbierto ? " admin--movil-abierto" : "")}>
      <div className="adm-marco">
        <div className="adm-pantalla">
          <Sidebar onNavegar={() => setMovilAbierto(false)} />
          <div className="admin__overlay" onClick={() => setMovilAbierto(false)} />

          <div className="admin__main">
            <Topbar onAlternarSidebar={() => setMovilAbierto((v) => !v)} />
            <div className="admin__contenido">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}