import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import extHostIframeWorkaround from "./plugins/extHostIframeWorkaround";
import path from "path";

export default defineConfig({
    base: "./",
    build: {
        minify: "esbuild",
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
    worker: {
        format: "es",
    },
    plugins: [
        react(),
        dts({
            exclude: ["lib/components/**/*.ts"],
            insertTypesEntry: true,
        }),
        extHostIframeWorkaround(),
        viteStaticCopy({
            targets: [
                {
                    src: "node_modules/@codingame/monaco-vscode-extensions-service-override/assets/webWorkerExtensionHostIframe.html",
                    dest: "assets",
                },
            ],
        }),
    ],
});
