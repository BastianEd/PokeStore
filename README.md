# PokeStore

¡Bienvenido a PokeStore! Este proyecto es una aplicación web construida con React, TypeScript y Vite, diseñada para ser una tienda en línea de Pokémon.

## 📜 Sobre el Proyecto

PokeStore es una aplicación de comercio electrónico simulada donde los usuarios pueden navegar, buscar y "comprar" Pokémon. La aplicación utiliza una arquitectura moderna de front-end, es completamente responsive y está lista para ser desplegada en contenedores Docker.

## ✨ Características

*   **Catálogo de Pokémon:** Explora una amplia lista de Pokémon con detalles como sus habilidades, tipos y estadísticas.
*   **Búsqueda y Filtrado:** Encuentra Pokémon específicos rápidamente usando la barra de búsqueda o aplicando filtros.
*   **Carrito de Compras:** Añade y elimina Pokémon de tu carrito de compras antes de proceder al "pago".
*   **Diseño Responsivo:** Disfruta de una experiencia de usuario consistente en dispositivos de escritorio, tabletas y móviles.

## 🚀 Tecnologías Utilizadas

Este proyecto fue construido utilizando las siguientes tecnologías:

*   **React:** Biblioteca de JavaScript para construir interfaces de usuario.
*   **TypeScript:** Superset de JavaScript que añade tipado estático.
*   **Vite:** Herramienta de desarrollo front-end extremadamente rápida.
*   **React Router:** Para la navegación y el enrutamiento en la aplicación.
*   **Ant Design (antd):** Biblioteca de componentes de UI para React.
*   **Axios:** Cliente HTTP basado en promesas para realizar peticiones a APIs.
*   **Tailwind CSS:** Framework de CSS de bajo nivel para un diseño rápido y personalizado.
*   **Vitest:** Framework de testing para proyectos de Vite.
*   **Docker:** Plataforma para desarrollar, enviar y ejecutar aplicaciones en contenedores.

## ⚙️ Instalación y Uso

Sigue estos pasos para tener una copia del proyecto funcionando en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior) y [npm](https://www.npmjs.com/).

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/PokeStore.git
    cd PokeStore
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

### Configuración del Entorno (.env) 🌐

Para que el frontend pueda comunicarse con la API del backend, debes definir la URL del servicio.

**Crea un archivo llamado `.env` en la raíz del proyecto** con el siguiente contenido:

```bash
VITE_API_URL=http://localhost:3000/
```

### Ejecución

Para iniciar el servidor de desarrollo, ejecuta el siguiente comando:

```bash
npm run dev
```

Abre tu navegador y visita [http://localhost:3000](http://localhost:3000) para ver la aplicación en acción.

##  dostępne Skrypty

En el directorio del proyecto, puedes ejecutar los siguientes scripts:

*   `npm run dev`: Inicia la aplicación en modo de desarrollo.
*   `npm run build`: Compila la aplicación para producción en la carpeta `build`.
*   `npm run start`: Inicia el servidor de producción. Requiere que se haya ejecutado `npm run build` previamente.
*   `npm test`: Ejecuta los tests utilizando Vitest.
*   `npm run test:ui`: Ejecuta los tests en modo UI.
*   `npm run typecheck`: Realiza una comprobación de tipos de TypeScript en el proyecto.

## 🐳 Docker

También puedes construir y ejecutar la aplicación utilizando Docker.

1.  **Construye la imagen de Docker:**
    ```bash
    docker build -t pokestore .
    ```

2.  **Ejecuta el contenedor:**
    ```bash
    docker run -p 3000:3000 pokestore
    ```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

¡Gracias por revisar PokeStore! Si tienes alguna pregunta o sugerencia, no dudes in abrir un *issue* o un *pull request*.
