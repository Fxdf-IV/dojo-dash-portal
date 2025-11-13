import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Plugin para adicionar Express API
    {
      name: 'configure-server',
      configureServer: async (server: any) => {
        // Importa e configura o servidor API
        const { setupApiServer } = await import('./server/index.js');
        setupApiServer(server.middlewares as any);
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Avoid failing on broken third-party source maps in dev
      sourcemap: false,
    },
  },
}));
