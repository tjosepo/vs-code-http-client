const esbuild = require("esbuild");

esbuild.build({
  entryPoints: {
    webview: "./src/webview/app.tsx",
    extension: "./src/extension/main.ts",
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker",
  },
  bundle: true,
  outdir: "./out",
  watch: true,
  platform: "node",
  inject: ["./src/shared/react-shims.ts"],
  external: ["vscode"],
  loader: {
    ".ttf": "dataurl",
  },
});
