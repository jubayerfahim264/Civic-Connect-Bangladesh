import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "http";

interface CoopMiddleware {
  (req: IncomingMessage, res: ServerResponse, next: () => void): void;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    middlewareMode: false,
    configureServer: (server: ViteDevServer) => {
      const middleware: CoopMiddleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        // Remove COOP header if set
        if (res.hasHeader && res.hasHeader('Cross-Origin-Opener-Policy')) {
          res.setHeader('Cross-Origin-Opener-Policy', '');
        }
        next();
      };
      server.middlewares.use(middleware);
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
