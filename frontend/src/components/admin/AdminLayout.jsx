import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, FileText, Users, LogOut, Sun, Moon } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/perfiles', label: 'Perfiles', icon: FileText },
  ];

  if (['admin', 'superadmin'].includes(usuario?.rol)) {
    navItems.push({ path: '/admin/usuarios', label: 'Usuarios', icon: Users });
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-polar-200 dark:border-polar-800 bg-white/80 dark:bg-polar-950/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/admin/dashboard" className="flex items-center gap-3">
                <img src="/favicon.png" alt="MetaRed" className="h-8" />
                <span className="font-semibold">MetaRed Admin</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(({ path, label, icon: Icon, exact }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      (exact ? location.pathname === path : isActive(path))
                        ? 'bg-polar-100 dark:bg-polar-800 text-polar-900 dark:text-polar-100'
                        : 'text-polar-600 dark:text-polar-400 hover:bg-polar-50 dark:hover:bg-polar-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="btn-ghost p-2"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-polar-200 dark:border-polar-700">
                <span className="text-sm text-polar-600 dark:text-polar-400">
                  {usuario?.nombre}
                </span>
                <span className="badge-primary text-xs">
                  {usuario?.rol}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="btn-ghost p-2 text-polar-600 dark:text-polar-400 hover:text-red-500"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
