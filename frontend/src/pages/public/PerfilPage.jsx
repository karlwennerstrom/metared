import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, FileText, Sun, Moon } from 'lucide-react';
import { publicAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const PerfilPage = () => {
  const { codigo } = useParams();
  const { theme, toggleTheme } = useTheme();
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPerfil();
  }, [codigo]);

  const cargarPerfil = async () => {
    setCargando(true);
    try {
      const { data } = await publicAPI.obtenerPerfil(codigo);
      setPerfil(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Perfil no encontrado');
      } else {
        setError('Error al cargar el perfil');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleDescargarPDF = async () => {
    try {
      const response = await publicAPI.descargarPDF(codigo);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfil-${codigo}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error al descargar el PDF');
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const renderLista = (texto) => {
    if (!texto) return null;
    const items = texto.split('\n').filter(item => item.trim());
    return (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-uc-blue mt-2 flex-shrink-0" />
            <span className="text-polar-700 dark:text-polar-300">{item.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-uc-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FileText className="w-16 h-16 text-polar-300 dark:text-polar-700 mb-4" />
        <h2 className="text-xl font-semibold mb-2">{error}</h2>
        <Link to="/" className="text-uc-blue hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-polar-200 dark:border-polar-800 bg-white/80 dark:bg-polar-950/80 backdrop-blur-lg print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-polar-600 dark:text-polar-400 hover:text-uc-blue transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al catálogo
            </Link>

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
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="animate-fade-in">
          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge-primary font-mono">{perfil.codigo}</span>
              <span className="text-sm px-2.5 py-1 rounded-md bg-polar-100 dark:bg-polar-800 text-polar-600 dark:text-polar-400">
                {perfil.tipo_cargo}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{perfil.nombre}</h1>

            {/* Actions */}
            <div className="flex gap-3 print:hidden">
              <button onClick={handleDescargarPDF} className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </button>
              <button onClick={handleImprimir} className="btn-secondary">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card p-4">
              <p className="text-xs text-polar-500 dark:text-polar-400 mb-1">Categoría</p>
              <p className="font-medium text-sm">{perfil.categoria}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-polar-500 dark:text-polar-400 mb-1">Área de Conocimiento</p>
              <p className="font-medium text-sm">{perfil.area_conocimiento}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-polar-500 dark:text-polar-400 mb-1">Tipo de Cargo</p>
              <p className="font-medium text-sm">{perfil.tipo_cargo}</p>
            </div>
          </div>

          {/* Description */}
          {perfil.descripcion && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-uc-blue rounded-full" />
                Descripción del Cargo
              </h2>
              <div className="card p-6">
                <p className="text-polar-700 dark:text-polar-300 leading-relaxed">
                  {perfil.descripcion}
                </p>
              </div>
            </section>
          )}

          {/* Responsibilities */}
          {perfil.responsabilidades && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-uc-blue rounded-full" />
                Responsabilidades
              </h2>
              <div className="card p-6">
                {renderLista(perfil.responsabilidades)}
              </div>
            </section>
          )}

          {/* Requirements */}
          {perfil.requisitos && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-uc-blue rounded-full" />
                Requisitos del Puesto
              </h2>
              <div className="card p-6">
                {renderLista(perfil.requisitos)}
              </div>
            </section>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-polar-200 dark:border-polar-800 mt-16 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-polar-500 dark:text-polar-400 text-center">
            © {new Date().getFullYear()} Universidad Católica de Chile - MetaRed Perfiles
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PerfilPage;
