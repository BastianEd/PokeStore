Pastelería Mil Sabores (Proyecto PasteleriaEv3)
Bienvenido al proyecto "Pastelería Mil Sabores" (pasteleriaev3). Esta es una aplicación web full-stack moderna que simula un sitio de e-commerce para una pastelería ficticia. La aplicación celebra los 50 años de tradición de la pastelería, ofreciendo a los usuarios una plataforma para explorar productos, gestionar un carrito de compras y aprender más sobre la empresa.

El proyecto está construido utilizando React Router con renderizado del lado del servidor (SSR), Vite como herramienta de desarrollo y TypeScript.

📜 Descripción
La "Pastelería Mil Sabores" es una tienda online que permite a los clientes ver un catálogo de tortas, postres y productos de pastelería, filtrar por categorías (como "Sin Gluten", "Vegana", "Tortas Especiales"), añadirlos a un carrito de compras y registrarse como usuarios.

El sitio también incluye secciones informativas como un blog y una página de contacto.

✨ Características Principales
Catálogo de Productos: Visualización de productos en cuadrícula con detalles, precios e imágenes.

Filtros y Búsqueda: Funcionalidad para filtrar productos por categoría y buscar por término.

Carrito de Compras: Gestión del estado del carrito mediante React Context, con persistencia en LocalStorage.

Sección de Blog: Muestra artículos que pueden ser filtrados por categorías (recetas, tips, historia).

Autenticación (Mock): Formularios para Iniciar Sesión, Registro y Recuperación de Contraseña.

Panel de Usuarios: Una vista simple (probablemente para administradores) que lista los usuarios registrados usando Ant Design.

SSR: La aplicación está configurada para Renderizado del Lado del Servidor (SSR).

Diseño Responsivo: Incluye media queries para adaptarse a dispositivos móviles.

🛠️ Stack Tecnológico
El proyecto utiliza las siguientes tecnologías principales:

Framework: React Router (v7+)

Bundler y Servidor de Desarrollo: Vite

Lenguaje: TypeScript

Librería de UI: Ant Design (AntD)

Estilos: TailwindCSS (para utilidades) y CSS personalizado (app.css) para el skinning principal.

Contenerización: Docker.

🚀 Cómo Empezar
Sigue estos pasos para levantar el proyecto en tu entorno local.

Prerrequisitos
Node.js (v20 o superior, según Dockerfile)

npm (v10 o superior)

Instalación y Ejecución
Clonar el repositorio (si estuviera en uno):

Bash

git clone [URL_DEL_REPOSITORIO]
cd pasteleria-ev3
Instalar dependencias:

Bash

npm install
Iniciar el servidor de desarrollo: El proyecto usa el CLI de React Router, que a su vez utiliza Vite.

Bash

npm run dev
Abrir la aplicación: La aplicación estará disponible en http://localhost:5173.

📦 Scripts Disponibles
Estos son los scripts principales definidos en package.json:

npm run dev Inicia el servidor de desarrollo con HMR (Hot Module Replacement).

npm run build Compila la aplicación para producción. Genera los assets del cliente y el bundle del servidor en la carpeta build/.

npm run start Inicia el servidor de producción (react-router-serve). Requiere haber ejecutado npm run build previamente.

npm run typecheck Ejecuta el compilador de TypeScript (tsc) para verificar errores de tipado en el proyecto.

🐳 Despliegue con Docker
El proyecto incluye un Dockerfile optimizado para construir una imagen de producción multi-etapa.

Construir la imagen de Docker:

Bash

docker build -t pasteleria-ev3 .
Ejecutar el contenedor: (El README.md original sugiere el puerto 3000, que es el puerto por defecto de react-router-serve).

Bash

docker run -p 3000:3000 pasteleria-ev3
La aplicación estará accesible en http://localhost:3000.