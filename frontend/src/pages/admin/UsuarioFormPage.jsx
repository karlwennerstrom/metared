import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { Save, ArrowLeft, Shield, User, Crown } from 'lucide-react';

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
          password: '',
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

  const roles = [
    {
      value: 'editor',
      label: 'Editor',
      icon: User,
      description: 'Crear y editar perfiles',
      color: 'emerald'
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: Shield,
      description: 'Eliminar perfiles',
      color: 'blue'
    },
    {
      value: 'superadmin',
      label: 'SuperAdmin',
      icon: Crown,
      description: 'Gestionar usuarios',
      color: 'purple'
    }
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/usuarios')}
          className="flex items-center text-sm text-polar-600 dark:text-polar-400 hover:text-uc-blue transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </button>
        <h1 className="text-2xl font-bold">
          {esEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={esEdicion}
              className="input disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="usuario@uc.cl"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Contraseña {esEdicion && <span className="text-polar-500 dark:text-polar-400 font-normal">(dejar en blanco para no cambiar)</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!esEdicion}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="input"
              placeholder="Nombre del usuario"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Rol *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roles.map(({ value, label, icon: Icon, description, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rol: value }))}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.rol === value
                      ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
                      : 'border-polar-200 dark:border-polar-700 hover:border-polar-300 dark:hover:border-polar-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${
                    formData.rol === value
                      ? `text-${color}-600 dark:text-${color}-400`
                      : 'text-polar-400'
                  }`} />
                  <p className={`font-medium text-sm ${
                    formData.rol === value
                      ? 'text-polar-900 dark:text-polar-100'
                      : 'text-polar-600 dark:text-polar-400'
                  }`}>
                    {label}
                  </p>
                  <p className="text-xs text-polar-500 dark:text-polar-400 mt-1">
                    {description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-polar-200 dark:border-polar-700">
          <button
            type="submit"
            disabled={cargando}
            className="btn-primary disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {cargando ? 'Guardando...' : 'Guardar Usuario'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/usuarios')}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default UsuarioFormPage;
