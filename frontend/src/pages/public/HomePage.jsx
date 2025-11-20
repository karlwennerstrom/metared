import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, ChevronLeft, ChevronRight, Sun, Moon, X, ArrowRight } from 'lucide-react';
import { publicAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const HomePage = () => {
  const { theme, toggleTheme } = useTheme();
  const [perfiles, setPerfiles] = useState([]);
  const [facets, setFacets] = useState({ categorias: [], areas_conocimiento: [], tipos_cargo: [] });
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({
    categoria: '',
    area_conocimiento: '',
    tipo_cargo: ''
  });
  const [paginacion, setPaginacion] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarFacets();
  }, []);

  useEffect(() => {
    buscarPerfiles();
  }, [busqueda, filtros, paginacion.page]);

  const cargarFacets = async () => {
    try {
      const { data } = await publicAPI.obtenerFacets();
      setFacets(data);
    } catch (error) {
      console.error('Error cargando facets:', error);
    }
  };

  const buscarPerfiles = async () => {
    setCargando(true);
    try {
      const params = {
        page: paginacion.page,
        limit: 12
      };

      if (busqueda.trim()) params.search = busqueda;
      if (filtros.categoria) params.categoria = filtros.categoria;
      if (filtros.area_conocimiento) params.area_conocimiento = filtros.area_conocimiento;
      if (filtros.tipo_cargo) params.tipo_cargo = filtros.tipo_cargo;

      const { data } = await publicAPI.buscarPerfiles(params);
      setPerfiles(data.data);
      setPaginacion(prev => ({
        ...prev,
        totalPages: data.totalPages,
        total: data.total
      }));
    } catch (error) {
      console.error('Error buscando perfiles:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleBusqueda = (e) => {
    e.preventDefault();
    setPaginacion(prev => ({ ...prev, page: 1 }));
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginacion(prev => ({ ...prev, page: 1 }));
  };

  const limpiarFiltros = () => {
    setFiltros({ categoria: '', area_conocimiento: '', tipo_cargo: '' });
    setBusqueda('');
    setPaginacion(prev => ({ ...prev, page: 1 }));
  };

  const filtrosActivos = Object.values(filtros).filter(Boolean).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-polar-200 dark:border-polar-800 bg-white/80 dark:bg-polar-950/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="MetaRed" className="h-8" />
              <span className="font-semibold text-lg">MetaRed</span>
            </div>

            <div className="flex items-center gap-2">
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
              <Link to="/admin/login" className="btn-secondary text-sm">
                Acceso Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-uc-blue/5 to-transparent dark:from-uc-blue/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Catálogo de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-uc-blue to-uc-dark-blue">
                Perfiles Profesionales
              </span>
            </h1>
            <p className="text-lg text-polar-600 dark:text-polar-400 mb-8">
              Explora nuestra colección de perfiles de TI. Encuentra roles, responsabilidades y requisitos para cada posición.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleBusqueda} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-polar-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre, código o descripción..."
                  className="input pl-12 pr-32 py-4 text-base"
                />
                <button
                  type="button"
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 btn-ghost py-2 ${
                    filtrosActivos > 0 ? 'text-uc-blue' : ''
                  }`}
                >
                  <Filter className="w-4 h-4 mr-1.5" />
                  Filtros
                  {filtrosActivos > 0 && (
                    <span className="ml-1.5 w-5 h-5 rounded-full bg-uc-blue text-white text-xs flex items-center justify-center">
                      {filtrosActivos}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {mostrarFiltros && (
        <div className="border-b border-polar-200 dark:border-polar-800 bg-polar-50 dark:bg-polar-900/50 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-polar-700 dark:text-polar-300">
                  Categoría
                </label>
                <select
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                  className="input"
                >
                  <option value="">Todas las categorías</option>
                  {facets.categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-polar-700 dark:text-polar-300">
                  Área de Conocimiento
                </label>
                <select
                  value={filtros.area_conocimiento}
                  onChange={(e) => handleFiltroChange('area_conocimiento', e.target.value)}
                  className="input"
                >
                  <option value="">Todas las áreas</option>
                  {facets.areas_conocimiento.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-polar-700 dark:text-polar-300">
                  Tipo de Cargo
                </label>
                <select
                  value={filtros.tipo_cargo}
                  onChange={(e) => handleFiltroChange('tipo_cargo', e.target.value)}
                  className="input"
                >
                  <option value="">Todos los tipos</option>
                  {facets.tipos_cargo.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
            </div>

            {filtrosActivos > 0 && (
              <button
                onClick={limpiarFiltros}
                className="mt-4 text-sm text-uc-blue hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-polar-600 dark:text-polar-400">
            {paginacion.total} perfiles encontrados
          </p>
        </div>

        {/* Cards Grid */}
        {cargando ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-uc-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : perfiles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {perfiles.map((perfil) => (
                <Link
                  key={perfil.id}
                  to={`/perfil/${perfil.codigo}`}
                  className="card-hover p-5 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="badge-primary font-mono text-xs">
                      {perfil.codigo}
                    </span>
                    <ArrowRight className="w-4 h-4 text-polar-400 group-hover:text-uc-blue group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <h3 className="font-semibold text-polar-900 dark:text-polar-100 mb-2 line-clamp-2 group-hover:text-uc-blue transition-colors">
                    {perfil.nombre}
                  </h3>

                  <p className="text-sm text-polar-500 dark:text-polar-400 mb-4 line-clamp-2">
                    {perfil.descripcion || 'Sin descripción disponible'}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-md bg-polar-100 dark:bg-polar-800 text-polar-600 dark:text-polar-400">
                      {perfil.tipo_cargo}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {paginacion.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPaginacion(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={paginacion.page === 1}
                  className="btn-secondary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </button>

                <span className="px-4 text-sm text-polar-600 dark:text-polar-400">
                  {paginacion.page} / {paginacion.totalPages}
                </span>

                <button
                  onClick={() => setPaginacion(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={paginacion.page === paginacion.totalPages}
                  className="btn-secondary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-polar-300 dark:text-polar-700 mx-auto mb-4" />
            <p className="text-polar-500 dark:text-polar-400">
              No se encontraron perfiles con los criterios de búsqueda
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-polar-200 dark:border-polar-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-polar-500 dark:text-polar-400">
              © {new Date().getFullYear()} Universidad Católica de Chile
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/admin/login"
                className="text-sm text-polar-500 dark:text-polar-400 hover:text-uc-blue transition-colors"
              >
                Panel de Administración
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
