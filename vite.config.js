import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "node",
    rollupOptions: {
      input: {
        main: fileURLToPath(
          new URL("./src/extension/main.ts", import.meta.url)
        ),
      },
      external: ["vscode"],
    },
  },
});
