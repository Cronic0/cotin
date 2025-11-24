# 🍀 El Trébol - Interactive Restaurant Menu App

Una aplicación móvil moderna para restaurantes construida con React Native y Expo, que ofrece un menú interactivo, gestión de alergenos, y un completo panel de administración.

## ✨ Características Principales

### Para Clientes
- 📱 **Menú Interactivo**: Navegación fluida por categorías con imágenes de alta calidad
- 🔍 **Filtro de Alérgenos**: Sistema inteligente para filtrar platos según alergias
- ⭐ **Favoritos**: Guardar platos preferidos para acceso rápido
- 🌐 **Multi-idioma**: Soporte completo para Español e Inglés
- 🕒 **Horarios en Tiempo Real**: Consulta los horarios de apertura actualizados
- 📰 **Newsletter**: Suscripción para recibir novedades
- 🎨 **Diseño Moderno**: UI/UX premium con animaciones fluidas

### Para Administradores
- 🔐 **Panel de Administración**: Acceso seguro con autenticación
- 📝 **Gestión de Productos**: Crear, editar y eliminar platos del menú
- 🖼️ **Gestión de Imágenes**: Subir y actualizar fotos de productos
- ⏰ **Editor de Horarios**: Configurar horarios de apertura por día
- 🎯 **Secciones Dinámicas**: Activar/desactivar secciones del menú
- 📊 **Estadísticas**: Ver productos más favoritos y analytics
- 🎪 **Gestión de Banners**: Configurar campañas especiales

## 🚀 Instalación

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn
- Expo CLI
- Expo Go app (para pruebas en dispositivos físicos)

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Cronic0/El_TREBOL_APP.git

# Ir al directorio del proyecto
cd El_TREBOL_APP

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

## 📱 Uso

### Para Desarrollo
```bash
# Iniciar en modo desarrollo
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Iniciar en Web
npm run web
```

### Acceso al Panel Admin
1. Navega a la sección "Admin" desde el menú
2. Contraseña por defecto: `1234`
3. Accede a:
   - **Estadísticas**: Ver analytics de la app
   - **Editar Menú**: Gestionar productos
   - **Editar App**: Configurar horarios y secciones

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **AsyncStorage** - Almacenamiento local
- **Expo Router** - Navegación
- **Expo Linear Gradient** - Gradientes
- **React Native Reanimated** - Animaciones
- **Expo Image Picker** - Selección de imágenes

## 📁 Estructura del Proyecto

```
El_TREBOL_APP/
├── app/                    # Pantallas de la aplicación
│   ├── admin/             # Panel de administración
│   ├── menu/              # Menú y detalles de productos
│   ├── allergens.tsx      # Filtro de alérgenos
│   ├── favorites.tsx      # Productos favoritos
│   └── index.tsx          # Pantalla principal
├── components/            # Componentes reutilizables
├── constants/             # Constantes y configuraciones
│   ├── Theme.ts          # Colores y estilos
│   └── Translations.ts   # Traducciones
├── context/              # Context API
│   ├── AdminContext.tsx  # Estado de administración
│   ├── LanguageContext.tsx # Idiomas
│   ├── FavoritesContext.tsx # Favoritos
│   └── AnalyticsContext.tsx # Estadísticas
├── data/                 # Datos estáticos
│   └── menuData.ts       # Productos del menú
└── assets/               # Recursos (imágenes, fuentes)
```

## ⚙️ Configuración

### Horarios
Los horarios se pueden configurar desde el panel de administración:
- Navega a **Admin → Editar App → Editar Horarios**
- Configura cada día de la semana
- Los cambios se reflejan inmediatamente en el menú

### Productos
Para gestionar productos:
- Navega a **Admin → Editar Menú**
- Crea nuevos productos o edita existentes
- Sube imágenes desde la galería
- Configura precio, categoría, alérgenos y maridajes

### Secciones
Activa/desactiva secciones desde **Admin → Editar App**:
- Recomendaciones del Chef
- Menú Fuera de Carta
- Banner de Semana del Atún

## 🔒 Seguridad

- Autenticación simple para panel admin
- Almacenamiento local seguro con AsyncStorage
- Validación de datos en formularios

## 📧 Contacto

- **Email**: info@eltrebol.com
- **Repositorio**: [GitHub](https://github.com/Cronic0/El_TREBOL_APP)

## 📄 Licencia

Este proyecto es privado y pertenece a El Trébol Restaurant.

---

**Desarrollado con ❤️ para El Trébol**
