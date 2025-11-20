import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

const UsuariosListPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const { data } = await adminAPI.listarUsuarios();
      setUsuarios(data.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Desactivar este usuario? No podrá iniciar sesión.')) {
      return;
    }

    try {
      await adminAPI.eliminarUsuario(id);
      cargarUsuarios();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  const getRolBadge = (rol) => {
    switch (rol) {
      case 'superadmin':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'admin':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'editor':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      default:
        return 'bg-polar-100 dark:bg-polar-800 text-polar-600 dark:text-polar-400';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <p className="text-polar-500 dark:text-polar-400 mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/usuarios/nuevo')}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <div className="card overflow-hidden">
        {cargando ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-uc-blue border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-polar-200 dark:border-polar-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-polar-500 dark:text-polar-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-polar-500 dark:text-polar-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-polar-500 dark:text-polar-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-polar-500 dark:text-polar-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-polar-500 dark:text-polar-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-200 dark:divide-polar-700">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-polar-50 dark:hover:bg-polar-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-polar-900 dark:text-polar-100">
                        {usuario.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-polar-600 dark:text-polar-400">
                        {usuario.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRolBadge(usuario.rol)}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        usuario.activo
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/usuarios/editar/${usuario.id}`)}
                          className="p-2 rounded-lg text-polar-500 dark:text-polar-400 hover:text-uc-blue hover:bg-polar-100 dark:hover:bg-polar-800 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminar(usuario.id)}
                          className="p-2 rounded-lg text-polar-500 dark:text-polar-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Desactivar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!cargando && usuarios.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-polar-300 dark:text-polar-700 mx-auto mb-4" />
            <p className="text-polar-500 dark:text-polar-400">
              No hay usuarios registrados
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsuariosListPage;
