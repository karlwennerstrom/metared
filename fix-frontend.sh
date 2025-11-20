#!/bin/bash

echo "🔧 Arreglando permisos del frontend..."

cd /home/karl/uc_proyectos/metared/frontend

# Limpiar caché de Vite con sudo
echo "Limpiando caché de Vite..."
sudo rm -rf node_modules/.vite

# Cambiar owner de node_modules
echo "Cambiando permisos de node_modules..."
sudo chown -R $USER:$USER node_modules

echo "✅ Permisos arreglados!"
echo ""
echo "Ahora ejecuta:"
echo "  cd /home/karl/uc_proyectos/metared/frontend"
echo "  npm run dev"
