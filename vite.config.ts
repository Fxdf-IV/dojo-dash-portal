import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
          // Só inicia o servidor API se NÃO estiver em modo mock
          if (env.VITE_USE_MOCK !== 'true') {
            // Importa e configura o servidor API
            const { setupApiServer } = await import('./server/index.js');
            setupApiServer(server.middlewares as any);
          } else {
            console.log('🔶 Mock Mode ativado: Backend API não será iniciado.');
          }
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
  };
});
