# PLAN DE TRABAJO METARED PERFILES - PARTE 2

## Continuación de FASE 5: Frontend - Módulo de Administración

### 5.3. Dashboard Layout (continuación)

**`frontend/src/components/admin/AdminLayout.jsx` (continuación):**
```javascript
            {['admin', 'superadmin'].includes(usuario?.rol) && (
              <Link
                to="/admin/usuarios"
                className="flex items-center px-3 py-4 border-b-2 border-transparent hover:border-uc-blue"
              >
                <Users className="w-4 h-4 mr-2" />
                Usuarios
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
```

#### 5.4. Dashboard Principal

**`frontend/src/pages/admin/DashboardPage.jsx`:**
```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { FileText, Eye, EyeOff, Plus } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    publicados: 0,
    borradores: 0
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const { data } = await adminAPI.listarTodosPerfiles();
      setStats({
        total: data.total,
        publicados: data.data.filter(p => p.publicado).length,
        borradores: data.data.filter(p => !p.publicado).length
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Resumen general del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Perfiles</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {cargando ? '...' : stats.total}
              </p>
            </div>
            <FileText className="w-12 h-12 text-uc-blue opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Publicados</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {cargando ? '...' : stats.publicados}
              </p>
            </div>
            <Eye className="w-12 h-12 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Borradores</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {cargando ? '...' : stats.borradores}
              </p>
            </div>
            <EyeOff className="w-12 h-12 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/perfiles/nuevo"
            className="flex items-center p-4 border border-gray-200 rounded hover:bg-gray-50"
          >
            <Plus className="w-5 h-5 text-uc-blue mr-3" />
            <div>
              <p className="font-medium">Crear Nuevo Perfil</p>
              <p className="text-sm text-gray-600">Agregar un nuevo perfil al catálogo</p>
            </div>
          </Link>

          <Link
            to="/admin/perfiles"
            className="flex items-center p-4 border border-gray-200 rounded hover:bg-gray-50"
          >
            <FileText className="w-5 h-5 text-uc-blue mr-3" />
            <div>
              <p className="font-medium">Gestionar Perfiles</p>
              <p className="text-sm text-gray-600">Ver y editar perfiles existentes</p>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
```

#### 5.5. Lista de Perfiles (Admin)

**`frontend/src/pages/admin/PerfilesListPage.jsx`:**
```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';

const PerfilesListPage = () => {
  const { usuario } = useAuth();
  const [perfiles, setPerfiles] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // todos, publicados, borradores
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

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Perfiles</h2>
          <p className="text-gray-600 mt-1">Administra todos los perfiles del catálogo</p>
        </div>
        <Link
          to="/admin/perfiles/nuevo"
          className="flex items-center px-4 py-2 bg-uc-blue text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Perfil
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded ${
              filtro === 'todos'
                ? 'bg-uc-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({perfiles.length})
          </button>
          <button
            onClick={() => setFiltro('publicados')}
            className={`px-4 py-2 rounded ${
              filtro === 'publicados'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Publicados
          </button>
          <button
            onClick={() => setFiltro('borradores')}
            className={`px-4 py-2 rounded ${
              filtro === 'borradores'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Borradores
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uc-blue mx-auto"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {perfiles.map((perfil) => (
                <tr key={perfil.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {perfil.codigo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {perfil.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {perfil.categoria}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePublicado(perfil.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        perfil.publicado
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/perfiles/editar/${perfil.id}`}
                        className="text-uc-blue hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      {puedeEliminar && (
                        <button
                          onClick={() => handleEliminar(perfil.id)}
                          className="text-red-600 hover:text-red-800"
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
        )}

        {!cargando && perfiles.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron perfiles
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PerfilesListPage;
```

#### 5.6. Formulario de Perfil (Crear/Editar)

**`frontend/src/pages/admin/PerfilFormPage.jsx`:**
```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { Save, ArrowLeft } from 'lucide-react';

const PerfilFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    area_conocimiento: '',
    tipo_cargo: '',
    descripcion: '',
    responsabilidades: '',
    requisitos: '',
    publicado: false
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (esEdicion) {
      cargarPerfil();
    }
  }, [id]);

  const cargarPerfil = async () => {
    try {
      const { data } = await adminAPI.listarTodosPerfiles();
      const perfil = data.data.find(p => p.id === parseInt(id));
      if (perfil) {
        setFormData(perfil);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setError('Error al cargar el perfil');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (esEdicion) {
        await adminAPI.actualizarPerfil(id, formData);
      } else {
        await adminAPI.crearPerfil(formData);
      }
      navigate('/admin/perfiles');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el perfil');
    } finally {
      setCargando(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/perfiles')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {esEdicion ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Código */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Código *
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              disabled={esEdicion}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue disabled:bg-gray-100"
              placeholder="Ej: INF001"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nombre del Perfil *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue"
              placeholder="Ej: Arquitecto TI"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Categoría *
            </label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue"
              placeholder="Ej: 1. Infraestructura Operaciones"
            />
          </div>

          {/* Área de Conocimiento */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Área de Conocimiento *
            </label>
            <input
              type="text"
              name="area_conocimiento"
              value={formData.area_conocimiento}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue"
              placeholder="Ej: Infraestructura y Operaciones"
            />
          </div>

          {/* Tipo de Cargo */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tipo de Cargo *
            </label>
            <select
              name="tipo_cargo"
              value={formData.tipo_cargo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue"
            >
              <option value="">Seleccionar...</option>
              <option value="Líder">Líder</option>
              <option value="Contribución Individual">Contribución Individual</option>
            </select>
          </div>

          {/* Publicado */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="publicado"
                checked={formData.publicado}
                onChange={handleChange}
                className="mr-2 rounded text-uc-blue focus:ring-uc-blue"
              />
              <span className="text-gray-700 font-medium">Publicar perfil</span>
            </label>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Descripción del Cargo
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue"
            placeholder="Descripción general del cargo..."
          />
        </div>

        {/* Responsabilidades */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Responsabilidades
          </label>
          <textarea
            name="responsabilidades"
            value={formData.responsabilidades}
            onChange={handleChange}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue font-mono text-sm"
            placeholder="Separa cada responsabilidad con un salto de línea..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Cada línea se mostrará como un item de lista
          </p>
        </div>

        {/* Requisitos */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Requisitos del Puesto
          </label>
          <textarea
            name="requisitos"
            value={formData.requisitos}
            onChange={handleChange}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue font-mono text-sm"
            placeholder="Separa cada requisito con un salto de línea..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Cada línea se mostrará como un item de lista
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={cargando}
            className="flex items-center px-6 py-2 bg-uc-blue text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {cargando ? 'Guardando...' : 'Guardar Perfil'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/perfiles')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default PerfilFormPage;
```

#### 5.7. Gestión de Usuarios (SuperAdmin)

**`frontend/src/pages/admin/UsuariosListPage.jsx`:**
```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

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

  const getRolBadgeColor = (rol) => {
    switch (rol) {
      case 'superadmin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        <button
          onClick={() => navigate('/admin/usuarios/nuevo')}
          className="flex items-center px-4 py-2 bg-uc-blue text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uc-blue mx-auto"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usuario.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRolBadgeColor(usuario.rol)}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      usuario.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/usuarios/editar/${usuario.id}`)}
                        className="text-uc-blue hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminar(usuario.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsuariosListPage;
```

**`frontend/src/pages/admin/UsuarioFormPage.jsx`:**
```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { Save, ArrowLeft } from 'lucide-react';

const UsuarioFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    rol: 'editor'
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (esEdicion) {
      cargarUsuario();
    }
  }, [id]);

  const cargarUsuario = async () => {
    try {
      const { data } = await adminAPI.listarUsuarios();
      const usuario = data.data.find(u => u.id === parseInt(id));
      if (usuario) {
        setFormData({
          email: usuario.email,
          password: '', // No mostrar password actual
          nombre: usuario.nombre,
          rol: usuario.rol
        });
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const dataToSend = { ...formData };
      // Si es edición y no cambió password, no enviarlo
      if (esEdicion && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (esEdicion) {
        await adminAPI.actualizarUsuario(id, dataToSend);
      } else {
        await adminAPI.crearUsuario(dataToSend);
      }
      navigate('/admin/usuarios');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar usuario');
    } finally {
      setCargando(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/usuarios')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {esEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={esEdicion}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue disabled:bg-gray-100"
              placeholder="usuario@uc.cl"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Contraseña {esEdicion && '(dejar en blanco para no cambiar)'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!esEdicion}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue"
              placeholder="••••••••"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue"
              placeholder="Nombre del usuario"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Rol *
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uc-blue"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="superadmin">SuperAdmin</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Editor: Crear/editar perfiles | Admin: + Eliminar perfiles | SuperAdmin: + Gestionar usuarios
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={cargando}
            className="flex items-center px-6 py-2 bg-uc-blue text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {cargando ? 'Guardando...' : 'Guardar Usuario'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/usuarios')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default UsuarioFormPage;
```

#### 5.8. Router Completo

**`frontend/src/App.jsx` (actualizado):**
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Páginas públicas
import HomePage from './pages/public/HomePage';
import PerfilPage from './pages/public/PerfilPage';

// Páginas admin
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import PerfilesListPage from './pages/admin/PerfilesListPage';
import PerfilFormPage from './pages/admin/PerfilFormPage';
import UsuariosListPage from './pages/admin/UsuariosListPage';
import UsuarioFormPage from './pages/admin/UsuarioFormPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/perfil/:codigo" element={<PerfilPage />} />

          {/* Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Rutas protegidas - Admin */}
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

          {/* Redirect */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### Entregables Fase 5:
- ✅ Sistema de login funcional
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de perfiles con interfaz
- ✅ Gestión de usuarios (superadmin only)
- ✅ Protección de rutas por rol
- ✅ UI responsive con Tailwind

---

## ✅ FASE 6: Integración y Testing Final
**Tiempo estimado: 2-3 horas**

### Objetivos:
1. Docker Compose final con volumen CSV
2. Testing completo end-to-end
3. Documentación final
4. Ajustes finales

### Tareas Detalladas:

#### 6.1. Ajustar Docker Compose para CSV

**Actualizar `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: metared-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: metared_perfiles
      MYSQL_USER: metared_user
      MYSQL_PASSWORD: metared_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - metared-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: metared-backend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      PORT: 5000
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: metared_user
      DB_PASSWORD: metared_pass
      DB_NAME: metared_perfiles
      JWT_SECRET: tu_super_secret_jwt_cambiar_en_produccion
      JWT_EXPIRES_IN: 24h
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - /app/node_modules
      # Montar CSV para seed
      - ./data:/app/data
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - metared-network

  frontend:
    build: ./frontend
    container_name: metared-frontend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      VITE_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - metared-network

volumes:
  mysql_data:

networks:
  metared-network:
    driver: bridge
```

**Crear carpeta data y copiar CSV:**
```bash
mkdir -p data
cp MetaRed_Perfiles_TI__250301_ORIGINAL_UNIFICADO_xlsx_-_TODOS.csv data/
```

#### 6.2. Checklist de Testing

**Testing Backend:**
```bash
# 1. Levantar servicios
docker-compose up -d

# 2. Verificar logs
docker-compose logs -f backend

# 3. Health check
curl http://localhost:5000/health

# 4. Crear superadmin
docker exec -it metared-backend npm run create-admin -- \
  --email=admin@uc.cl \
  --password=Admin123! \
  --nombre="Super Admin"

# 5. Seed CSV
docker exec -it metared-backend npm run seed

# 6. Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uc.cl","password":"Admin123!"}'

# 7. Test búsqueda pública
curl "http://localhost:5000/api/perfiles?search=arquitecto"

# 8. Test facets
curl http://localhost:5000/api/perfiles/facets

# 9. Test PDF
curl http://localhost:5000/api/perfiles/INF001/pdf -o test.pdf
```

**Testing Frontend:**
```bash
# Abrir en navegador
open http://localhost:3000

# Checklist manual:
# ✅ Búsqueda funciona
# ✅ Filtros funcionan
# ✅ Click en card → va a detalle
# ✅ Botón PDF descarga archivo
# ✅ Botón imprimir abre diálogo
# ✅ Login admin funciona
# ✅ Dashboard muestra stats
# ✅ Tabla perfiles carga
# ✅ Crear perfil funciona
# ✅ Editar perfil funciona
# ✅ Toggle publicado funciona
# ✅ Eliminar perfil funciona (admin+)
# ✅ Gestión usuarios funciona (superadmin)
# ✅ Roles se respetan correctamente
```

#### 6.3. README Final

**Actualizar `README.md`:**
```markdown
# 🎓 MetaRed Perfiles - Sistema de Gestión de Perfiles Profesionales

Sistema de búsqueda y administración de **6,454 perfiles profesionales** del área de TI para la Universidad Católica de Chile.

## 🚀 Características

### Módulo Público
- ✅ Búsqueda inteligente con tolerancia a errores tipográficos
- ✅ Filtros dinámicos por Categoría, Área y Tipo de Cargo
- ✅ Vista detallada de cada perfil
- ✅ Exportación a PDF
- ✅ Diseño responsive

### Módulo de Administración
- ✅ Login seguro con JWT
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de perfiles
- ✅ Sistema de roles (Editor, Admin, SuperAdmin)
- ✅ Gestión de usuarios
- ✅ Toggle publicado/borrador

## 🛠️ Stack Tecnológico

- **Backend:** Node.js + Express + MySQL + Sequelize
- **Frontend:** React + Tailwind CSS + React Router
- **Búsqueda:** Fuse.js (fuzzy search)
- **PDFs:** PDFKit
- **Auth:** JWT + bcrypt
- **DevOps:** Docker + Docker Compose

## 📋 Requisitos Previos

- Docker & Docker Compose
- Git
- Node.js 18+ (opcional, para desarrollo sin Docker)

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd metared-perfiles
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus valores si es necesario
```

### 3. Preparar datos iniciales

```bash
# Asegúrate de que el CSV esté en la carpeta data/
mkdir -p data
cp MetaRed_Perfiles_TI__250301_ORIGINAL_UNIFICADO_xlsx_-_TODOS.csv data/
```

### 4. Levantar servicios

```bash
docker-compose up -d
```

Esto iniciará 3 contenedores:
- `metared-mysql`: Base de datos MySQL
- `metared-backend`: API REST (puerto 5000)
- `metared-frontend`: Interfaz web (puerto 3000)

### 5. Esperar a que MySQL esté listo

```bash
# Ver logs para verificar
docker-compose logs -f mysql

# Esperar mensaje: "ready for connections"
```

### 6. Crear usuario Super Admin

```bash
docker exec -it metared-backend npm run create-admin -- \
  --email=admin@uc.cl \
  --password=Admin123! \
  --nombre="Super Admin"
```

### 7. Importar perfiles desde CSV

```bash
docker exec -it metared-backend npm run seed
```

Este proceso puede tomar 1-2 minutos para importar los 6,454 perfiles.

### 8. ¡Listo! Acceder a la aplicación

- **Frontend Público:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **API Backend:** http://localhost:5000/api

**Credenciales iniciales:**
- Email: `admin@uc.cl`
- Password: `Admin123!`

## 📁 Estructura del Proyecto

```
metared-perfiles/
├── backend/                 # API REST Node.js
│   ├── src/
│   │   ├── config/         # DB, JWT
│   │   ├── models/         # Sequelize models
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── routes/         # Endpoints
│   │   ├── middleware/     # Auth, roles
│   │   ├── services/       # Búsqueda, PDF
│   │   └── scripts/        # Seed, create-admin
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                # Interfaz React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas públicas y admin
│   │   ├── context/        # Auth context
│   │   └── services/       # API calls
│   ├── Dockerfile
│   └── package.json
│
├── data/                    # CSV de perfiles
├── docker-compose.yml       # Orquestación
└── README.md
```

## 🔐 Sistema de Roles

| Rol | Permisos |
|-----|----------|
| **Editor** | Ver, crear y editar perfiles. Toggle publicado/borrador. |
| **Admin** | Todo lo de Editor + Eliminar perfiles + Ver usuarios |
| **SuperAdmin** | Todo lo de Admin + Crear/editar/eliminar usuarios |

## 🧪 Testing

### Verificar servicios

```bash
# Estado de contenedores
docker-compose ps

# Logs en tiempo real
docker-compose logs -f

# Health check
curl http://localhost:5000/health
```

### Testing manual

1. **Búsqueda pública**
   - Ir a http://localhost:3000
   - Buscar "arquitecto"
   - Aplicar filtros
   - Click en un perfil
   - Descargar PDF

2. **Administración**
   - Login en http://localhost:3000/admin/login
   - Ver dashboard
   - Crear un perfil de prueba
   - Editar perfil existente
   - Toggle publicado/borrador
   - Gestionar usuarios (si eres SuperAdmin)

## 🐛 Troubleshooting

### MySQL no arranca

```bash
docker-compose down -v
docker-compose up -d
```

### Backend no conecta a MySQL

Verificar que el healthcheck de MySQL esté OK:
```bash
docker-compose ps
# mysql debe estar "healthy"
```

### Permisos de volúmenes

```bash
# Si hay problemas con node_modules
docker-compose down
docker volume rm metared-perfiles_mysql_data
docker-compose up -d --build
```

### Limpiar todo y empezar de cero

```bash
docker-compose down -v
docker system prune -a
rm -rf backend/node_modules frontend/node_modules
docker-compose up -d --build
```

## 📝 Scripts Disponibles

### Backend

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start

# Crear superadmin
npm run create-admin -- --email=x@uc.cl --password=Pass123 --nombre="Admin"

# Importar CSV
npm run seed
```

### Frontend

```bash
# Desarrollo (con HMR)
npm run dev

# Build para producción
npm run build

# Preview build
npm run preview
```

## 🚀 Deployment a Producción

1. **Cambiar variables de entorno en `.env`:**
   - `NODE_ENV=production`
   - `JWT_SECRET=<secret-seguro-aleatorio>`
   - Usar contraseñas fuertes para MySQL

2. **Build de producción:**
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

3. **Configurar nginx como reverse proxy**

4. **SSL/TLS con Let's Encrypt**

## 📊 Datos

El sistema gestiona **6,454 perfiles** organizados en:
- Múltiples categorías
- Áreas de conocimiento
- Tipos de cargo (Líder / Contribución Individual)

Cada perfil incluye:
- Código único
- Nombre
- Descripción
- Responsabilidades (lista)
- Requisitos (lista)
- Estado de publicación

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

© 2025 Universidad Católica de Chile

## 👥 Contacto

Para soporte o consultas:
- Email: soporte-ti@uc.cl
- Sistema: MetaRed Perfiles UC

---

**Desarrollado con ❤️ para la Universidad Católica de Chile**
```

### Entregables Fase 6:
- ✅ Docker Compose completo y funcional
- ✅ Testing end-to-end validado
- ✅ README.md exhaustivo
- ✅ Sistema listo para producción

---

## 📦 FASE 7: Mejoras Futuras (Opcionales)

Estas son funcionalidades que pueden agregarse posteriormente:

### 7.1. Auditoría y Logs
- [ ] Tabla de `auditorias` para registrar cambios
- [ ] Quién editó qué y cuándo
- [ ] Log de accesos al sistema

### 7.2. Versionamiento de Perfiles
- [ ] Guardar historial de cambios
- [ ] Poder revertir a versiones anteriores
- [ ] Comparar versiones

### 7.3. Búsqueda Avanzada
- [ ] Sinónimos y términos relacionados
- [ ] Búsqueda por habilidades específicas
- [ ] Guardar búsquedas favoritas

### 7.4. Exportación Masiva
- [ ] Exportar múltiples perfiles a ZIP
- [ ] Exportar a Excel
- [ ] Exportar filtros aplicados

### 7.5. API Pública
- [ ] Documentación con Swagger
- [ ] Rate limiting
- [ ] API keys para terceros

### 7.6. Analytics
- [ ] Perfiles más visitados
- [ ] Búsquedas más frecuentes
- [ ] Dashboard de métricas

### 7.7. Notificaciones
- [ ] Email cuando se publica un perfil
- [ ] Alertas de cambios importantes
- [ ] Recordatorios de revisión

### 7.8. Mejoras de UX
- [ ] Modo oscuro
- [ ] Comparador de perfiles
- [ ] Guardado de perfiles favoritos (sin login)

---

## 🎯 Resumen Final

### Tiempo Total Estimado
- **Fase 0:** 2-3 horas
- **Fase 1:** 4-5 horas
- **Fase 2:** 3-4 horas
- **Fase 3:** 3-4 horas
- **Fase 4:** 5-6 horas
- **Fase 5:** 6-8 horas
- **Fase 6:** 2-3 horas

**Total: 25-33 horas de desarrollo**

### Entregables Finales

✅ **Backend API REST completo** con:
- Autenticación JWT
- CRUD de perfiles
- Gestión de usuarios
- Búsqueda fuzzy
- Generación de PDFs
- Sistema de roles

✅ **Frontend React** con:
- Buscador público inteligente
- Filtros dinámicos
- Detalle de perfiles con PDF
- Panel de administración
- Gestión de usuarios
- UI responsive

✅ **DevOps**:
- Docker Compose configurado
- Scripts de inicialización
- Documentación completa
- Testing validado

✅ **Datos**:
- 6,454 perfiles importados
- Estructura optimizada
- Búsqueda performante

---

## 📞 Siguiente Paso

**¿Listo para que Claude Code empiece a ejecutar este plan?**

Solo necesitas:
1. Copiar este plan a tu proyecto
2. Abrir Claude Code
3. Pasarle este documento
4. Indicarle que empiece por la **FASE 0**

Claude Code irá fase por fase, creando archivos, configurando servicios y validando que todo funcione antes de avanzar.

¡Éxito con el proyecto! 🚀
