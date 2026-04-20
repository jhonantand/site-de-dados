import React from "react";
import { Users, Briefcase, Lock, UserCircle2 } from "lucide-react";

export default function Sidebar({ module, setModule }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <p>Painel privado</p>
        <h2>Central de dados</h2>
      </div>

      <nav className="sidebar-nav">
        <SidebarButton
          active={module === "dashboard"}
          onClick={() => setModule("dashboard")}
          icon={<Users size={18} />}
        >
          Dashboard
        </SidebarButton>

        <SidebarButton
          active={module === "funcionarios"}
          onClick={() => setModule("funcionarios")}
          icon={<Briefcase size={18} />}
        >
          Funcionários
        </SidebarButton>

        <SidebarButton
          active={module === "pessoas"}
          onClick={() => setModule("pessoas")}
          icon={<UserCircle2 size={18} />}
        >
          Dados pessoais
        </SidebarButton>

        <SidebarButton
          active={module === "configuracoes"}
          onClick={() => setModule("configuracoes")}
          icon={<Lock size={18} />}
        >
          Configurações
        </SidebarButton>
      </nav>
    </aside>
  );
}

function SidebarButton({ children, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`sidebar-btn ${active ? "active" : ""}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}