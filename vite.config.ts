import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id) return
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react"
            if (id.includes("@radix-ui")) return "vendor-radix"
            if (id.includes("lucide-react")) return "vendor-lucide"
            if (id.includes("sonner")) return "vendor-sonner"
            if (id.includes("tailwind-merge") || id.includes("tailwindcss"))
              return "vendor-tailwind"
            if (id.includes("cmdk")) return "vendor-cmdk"
            if (id.includes("clsx")) return "vendor-clsx"
            if (id.includes("vaul")) return "vendor-vaul"
            if (id.includes("zod")) return "vendor-zod"
            // fallback: group remaining node_modules into vendor
            return "vendor"
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
