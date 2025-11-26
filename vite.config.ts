import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const isTest = !!process.env.VITEST;

const plugins = [tailwindcss(), tsconfigPaths()];
// El plugin de react-router inyecta un preámbulo que puede romper la transformación
// en el entorno de tests (Vitest). Omitimos el plugin durante los tests.
if (!isTest) {
  // Insertar reactRouter después de tailwindcss para mantener el orden previo
  plugins.splice(1, 0, reactRouter());
}

export default defineConfig({
  plugins,
  // Configuración de tests
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
  },
});
