import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import HomePage from './pages/public/HomePage';
import PerfilPage from './pages/public/PerfilPage';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import PerfilesListPage from './pages/admin/PerfilesListPage';
import PerfilFormPage from './pages/admin/PerfilFormPage';
import UsuariosListPage from './pages/admin/UsuariosListPage';
import UsuarioFormPage from './pages/admin/UsuarioFormPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/perfil/:codigo" element={<PerfilPage />} />

            {/* Login */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/perfiles"
              element={
                <ProtectedRoute>
                  <PerfilesListPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/perfiles/nuevo"
              element={
                <ProtectedRoute>
                  <PerfilFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/perfiles/editar/:id"
              element={
                <ProtectedRoute>
                  <PerfilFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute rolesPermitidos={['admin', 'superadmin']}>
                  <UsuariosListPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/usuarios/nuevo"
              element={
                <ProtectedRoute rolesPermitidos={['superadmin']}>
                  <UsuarioFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/usuarios/editar/:id"
              element={
                <ProtectedRoute rolesPermitidos={['superadmin']}>
                  <UsuarioFormPage />
                </ProtectedRoute>
              }
            />

            {/* Redirects */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
