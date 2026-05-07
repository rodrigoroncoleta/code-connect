import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../atoms/Button'

export function Sidebar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <aside className="bg-surface flex flex-col gap-12 items-center px-4 py-10 rounded-lg w-[180px] shrink-0 self-stretch">
      {/* Logo */}
      <Link to="/feed" className="flex items-center gap-2" aria-label="Code Connect">
        <span className="material-icons text-accent text-3xl">code</span>
        <span className="text-offwhite font-semibold text-lg leading-none">
          code<br />
          <span className="text-accent">connect</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-2 items-center w-full">
        {isAuthenticated && (
          <Link to="/posts/new" className="w-full">
            <Button variant="ghost">Publicar</Button>
          </Link>
        )}

        <NavItem to="/feed" icon="feed" label="Feed" />
        <NavItem to="/profile" icon="account_circle" label="Perfil" />
        <NavItem to="/about" icon="info" label="Sobre nós" />

        {isAuthenticated ? (
          <button
            type="button"
            onClick={logout}
            className="flex flex-col items-center gap-2 text-muted text-sm py-2 w-full hover:text-offwhite transition-colors cursor-pointer"
          >
            <span className="material-icons text-3xl">logout</span>
            Sair
          </button>
        ) : (
          <NavItem to="/" icon="login" label="Login" />
        )}
      </nav>
    </aside>
  )
}

function NavItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-2 text-sm py-2 w-full text-center transition-colors ${
          isActive ? 'text-offwhite' : 'text-muted hover:text-offwhite'
        }`
      }
    >
      <span className="material-icons text-3xl">{icon}</span>
      {label}
    </NavLink>
  )
}
