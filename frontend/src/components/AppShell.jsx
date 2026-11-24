import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronsLeft, CircleHelp, Command, FolderKanban, LayoutGrid, LogOut, Settings2, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Brand from './Brand';

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const boardName = location.pathname === '/profile'
    ? 'Meu perfil'
    : location.pathname.startsWith('/boards/') ? 'Quadro' : 'Visão geral';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-[#e8ebe7] bg-[#f3f5f2] px-3 pb-4 pt-5 lg:flex">
        <div className="flex items-center justify-between px-2">
          <Brand />
          <button type="button" aria-label="Recolher menu" title="Menu lateral" className="rounded-md p-1.5 text-muted transition-colors hover:bg-white hover:text-ink"><ChevronsLeft size={17} /></button>
        </div>

        <div className="mt-9 px-2">
          <div className="mb-2 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#929a93]">
            <span>Workspace</span>
          </div>
          <button type="button" className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-ink transition-colors hover:bg-white/80">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[#dfe8df] text-[10px] font-semibold text-accent">T</span>
            Meu espaço
            <ChevronDown size={14} className="ml-auto text-muted" />
          </button>
        </div>

        <nav className="mt-7 space-y-1" aria-label="Navegação principal">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#929a93]">Organização</p>
          <NavLink to="/boards" end className={({ isActive }) => `nav-link ${isActive || location.pathname.startsWith('/boards/') ? 'nav-link-active' : ''}`}>
            <LayoutGrid size={16} strokeWidth={1.8} />
            <span>Quadros</span>
            <span className="ml-auto rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] text-muted">⌘ 1</span>
          </NavLink>
          <button type="button" disabled className="nav-link w-full cursor-not-allowed opacity-45" title="Disponível em uma próxima versão">
            <FolderKanban size={16} strokeWidth={1.8} />
            <span>Meus itens</span>
          </button>
        </nav>

        <div className="mt-auto space-y-1 border-t border-[#e5e9e4] pt-4">
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}><UserRound size={16} strokeWidth={1.8} /><span>Meu perfil</span></NavLink>
          <button type="button" className="nav-link w-full opacity-60" title="Configurações em breve"><Settings2 size={16} strokeWidth={1.8} /><span>Configurações</span></button>
          <button type="button" className="nav-link w-full opacity-60" title="Ajuda em breve"><CircleHelp size={16} strokeWidth={1.8} /><span>Ajuda</span></button>
          <div className="relative mt-3 border-t border-[#e5e9e4] pt-3">
            <button type="button" onClick={() => setProfileOpen((open) => !open)} className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-white/80">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#dce8df] text-[11px] font-semibold text-[#365a43]">{initials(user?.name)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-ink">{user?.name || 'Usuário'}</span>
                <span className="mt-0.5 block truncate text-[11px] text-muted">{user?.email}</span>
              </span>
              <ChevronDown size={14} className="text-muted" />
            </button>
            {profileOpen && <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-line bg-white p-1.5 shadow-panel"><NavLink to="/profile" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-ink transition-colors hover:bg-[#f5f7f4]"><UserRound size={14} />Meu perfil</NavLink><button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-[#8b4039] transition-colors hover:bg-[#fbf2f0]"><LogOut size={14} />Sair da conta</button></div>}
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[62px] items-center justify-between border-b border-line bg-white/90 px-5 backdrop-blur-sm sm:px-8">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="font-medium text-muted">Meu espaço</span>
            <span className="text-[#c4c9c3]">/</span>
            <span className="font-medium text-ink">{boardName}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-line bg-[#fafbf9] px-2.5 py-1.5 text-[11px] text-muted sm:flex"><Command size={12} /> <span>Atalhos em breve</span></div>
            <div className="relative lg:hidden">
              <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-label="Abrir menu da conta" className="grid h-8 w-8 place-items-center rounded-full bg-[#e4ece5] text-[10px] font-semibold text-accent">{initials(user?.name)}</button>
              {profileOpen && <div className="absolute right-0 top-10 z-40 w-48 rounded-xl border border-line bg-white p-1.5 shadow-panel"><p className="truncate px-2.5 py-2 text-[11px] text-muted">{user?.email}</p><NavLink to="/profile" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-ink hover:bg-[#f5f7f4]"><UserRound size={14} />Meu perfil</NavLink><button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#8b4039] hover:bg-[#fbf2f0]"><LogOut size={14} />Sair da conta</button></div>}
            </div>
          </div>
        </header>
        <main>{children || <Outlet />}</main>
      </div>
    </div>
  );
}
