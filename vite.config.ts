import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import vsixPlugin from "@codingame/monaco-vscode-rollup-vsix-plugin";
import importMetaUrlPlugin from "@codingame/esbuild-import-meta-url-plugin";
import path from "path";

export default defineConfig({
    plugins: [
        react(),
        dts({
            rollupTypes: true,
        }),
        vsixPlugin(),
    ],
    base: "./",
    build: {
        lib: {
            entry: path.resolve(__dirname, "lib/index.ts"),
            name: "@test/lib-ui",
            fileName: (format) =>
                format === "es"
                    ? "index.js"
                    : format === "umd"
                    ? "browser.js"
                    : `lib-ui.${format}.js`,
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [importMetaUrlPlugin],
        },
        include: ["vscode-textmate", "vscode-oniguruma"],
    },
    worker: {
        format: "es",
    },
});
