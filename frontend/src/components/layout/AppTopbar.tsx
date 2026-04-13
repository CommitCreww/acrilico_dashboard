import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import logo from "../../assets/logo.png";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Pedidos", path: "/pedidos" },
  { label: "Clientes", path: "/clientes" },
  { label: "Materiais", path: "/materiais" },
];

type AppTopbarProps = {
  userName?: string;
};

export default function AppTopbar({ userName = "Usuário" }: AppTopbarProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-4 z-50 px-4 md:px-6 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-zinc-900/60 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl md:px-5">
            {/* esquerda */}
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Ludarte Acrílicos"
                  className="h-10 w-auto object-contain md:h-11"
                  draggable={false}
                />
              </Link>
            </div>

            {/* centro - desktop */}
            <nav className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-violet-500/15 text-violet-200"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* direita */}
            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 lg:flex lg:items-center lg:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-200">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <div className="text-left">
                  <p className="text-xs text-zinc-500">Conectado</p>
                  <p className="text-sm font-medium text-white">{userName}</p>
                </div>
              </div>

              {/* mobile 3 pontinhos */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08] lg:hidden"
                aria-label="Abrir menu"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
        userName={userName}
      />
    </>
  );
}