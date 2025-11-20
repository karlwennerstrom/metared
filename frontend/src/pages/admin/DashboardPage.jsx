import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { FileText, Eye, EyeOff, Plus, ArrowRight } from 'lucide-react';

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
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-polar-500 dark:text-polar-400 mt-1">
          Resumen general del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-polar-500 dark:text-polar-400">Total Perfiles</p>
              <p className="text-3xl font-bold mt-2">
                {cargando ? '...' : stats.total}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-uc-blue/10 dark:bg-uc-blue/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-uc-blue" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-polar-500 dark:text-polar-400">Publicados</p>
              <p className="text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
                {cargando ? '...' : stats.publicados}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-polar-500 dark:text-polar-400">Borradores</p>
              <p className="text-3xl font-bold mt-2 text-amber-600 dark:text-amber-400">
                {cargando ? '...' : stats.borradores}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/perfiles/nuevo"
            className="flex items-center justify-between p-4 rounded-lg border border-polar-200 dark:border-polar-700 hover:border-uc-blue dark:hover:border-uc-blue transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-uc-blue/10 dark:bg-uc-blue/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-uc-blue" />
              </div>
              <div>
                <p className="font-medium">Crear Nuevo Perfil</p>
                <p className="text-sm text-polar-500 dark:text-polar-400">
                  Agregar al catálogo
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-polar-400 group-hover:text-uc-blue group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/admin/perfiles"
            className="flex items-center justify-between p-4 rounded-lg border border-polar-200 dark:border-polar-700 hover:border-uc-blue dark:hover:border-uc-blue transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-polar-100 dark:bg-polar-800 flex items-center justify-center">
                <FileText className="w-5 h-5 text-polar-600 dark:text-polar-400" />
              </div>
              <div>
                <p className="font-medium">Gestionar Perfiles</p>
                <p className="text-sm text-polar-500 dark:text-polar-400">
                  Ver y editar existentes
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-polar-400 group-hover:text-uc-blue group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
