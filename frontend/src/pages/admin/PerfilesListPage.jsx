import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { Edit, Trash2, Eye, EyeOff, Plus, FileText, Search } from 'lucide-react';

const PerfilesListPage = () => {
  const { usuario } = useAuth();
  const [perfiles, setPerfiles] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPerfiles();
  }, [filtro]);

  const cargarPerfiles = async () => {
    setCargando(true);
    try {
      const params = {};
      if (filtro === 'publicados') params.publicado = 'true';
      if (filtro === 'borradores') params.publicado = 'false';

      const { data } = await adminAPI.listarTodosPerfiles(params);
      setPerfiles(data.data);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleTogglePublicado = async (id) => {
    if (!confirm('¿Cambiar estado de publicación?')) return;

    try {
      await adminAPI.togglePublicado(id);
      cargarPerfiles();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este perfil? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await adminAPI.eliminarPerfil(id);
      cargarPerfiles();
    } catch (error) {
      alert('Error al eliminar perfil');
    }
  };

  const puedeEliminar = ['admin', 'superadmin'].includes(usuario?.rol);

  const perfilesFiltrados = perfiles.filter(perfil => {
    if (!busqueda) return true;
    const term = busqueda.toLowerCase();
    return (
      perfil.codigo.toLowerCase().includes(term) ||
      perfil.nombre.toLowerCase().includes(term) ||
      perfil.categoria.toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Perfiles</h1>
          <p className="text-polar-500 dark:text-polar-400 mt-1">
            Administra todos los perfiles del catálogo
          </p>
        </div>
        <Link to="/admin/perfiles/nuevo" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Perfil
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === 'todos'
                  ? 'bg-uc-blue text-white'
                  : 'bg-polar-100 dark:bg-polar-800 text-polar-600 dark:text-polar-400 hover:bg-polar-200 dark:hover:bg-polar-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro('publicados')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === 'publicados'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-polar-100 dark:bg-polar-800 text-polar-600 dark:text-polar-400 hover:bg-polar-200 dark:hover:bg-polar-700'
              }`}
            >
              Publicados
            </button>
            <button
              onClick={() => setFiltro('borradores')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === 'borradores'
                  ? 'bg-amber-600 text-white'
                  : 'bg-polar-100 dark:bg-polar-800 text-polar-600 dark:text-polar-400 hover:bg-polar-200 dark:hover:bg-polar-700'
              }`}
            >
              Borradores
            </button>
          </div>

          <div className="flex-1 sm:max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-polar-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar..."
                className="input pl-10 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
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
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-polar-500 dark:text-polar-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-polar-500 dark:text-polar-400 uppercase tracking-wider hidden md:table-cell">
                    Categoría
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
                {perfilesFiltrados.map((perfil) => (
                  <tr key={perfil.id} className="hover:bg-polar-50 dark:hover:bg-polar-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-uc-blue">
                        {perfil.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-polar-900 dark:text-polar-100">
                        {perfil.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-polar-600 dark:text-polar-400">
                        {perfil.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublicado(perfil.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          perfil.publicado
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                        }`}
                      >
                        {perfil.publicado ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Publicado
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Borrador
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/perfiles/editar/${perfil.id}`}
                          className="p-2 rounded-lg text-polar-500 dark:text-polar-400 hover:text-uc-blue hover:bg-polar-100 dark:hover:bg-polar-800 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {puedeEliminar && (
                          <button
                            onClick={() => handleEliminar(perfil.id)}
                            className="p-2 rounded-lg text-polar-500 dark:text-polar-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!cargando && perfilesFiltrados.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-polar-300 dark:text-polar-700 mx-auto mb-4" />
            <p className="text-polar-500 dark:text-polar-400">
              No se encontraron perfiles
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PerfilesListPage;
