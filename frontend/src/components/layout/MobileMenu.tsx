import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

type NavItem = {
  label: string;
  path: string;
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  userName?: string;
  onLogout: () => void;
};

export default function MobileMenu({
  open,
  onClose,
  navItems,
  userName = "Usuario",
  onLogout,
}: MobileMenuProps) {
  const location = useLocation();

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-[85%] max-w-sm border-l border-white/10 bg-zinc-950/90 p-5 shadow-[-20px_0_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <img
            src={logo}
            alt="Ludarte Acrilicos"
            className="h-10 w-auto object-contain"
            draggable={false}
          />

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white"
            aria-label="Fechar menu"
          >
            X
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Usuario
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-200">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-zinc-400">Sessao ativa</p>
              <p className="font-medium text-white">{userName}</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`block rounded-2xl px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "border border-violet-500/20 bg-violet-500/15 text-violet-200"
                    : "border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="mt-6 w-full rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
        >
          Sair
        </button>
      </aside>
    </>
  );
}
