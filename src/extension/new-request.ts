import * as vscode from "vscode";
import { getUri } from "./utils";
import fetch from "node-fetch";
import fs from "fs";
import { getIcons } from "../assets";
import { RequestData } from "../shared/types";
import { objectifyResponse } from "../shared/utils";

export function activate(context: vscode.ExtensionContext) {
  const icons = getIcons(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("http-client.newRequest", () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        "newRequest",
        "New Request",
        vscode.ViewColumn.One,
        { enableScripts: true, retainContextWhenHidden: true }
      );

      // And set its HTML content
      panel.webview.html = getWebviewContent(
        panel.webview,
        context.extensionUri
      );

      panel.iconPath = icons.get;

      let state: RequestData = { method: "GET", url: "", headers: [] };

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        async (message) => {
          switch (message.command) {
            case "stateChange": {
              state = JSON.parse(message.state);
              panel.title = state.url || "New Request";

              switch (state.method) {
                case "GET":
                  panel.iconPath = icons.get;
                  break;
                case "POST":
                  panel.iconPath = icons.post;
                  break;
                case "PUT":
                  panel.iconPath = icons.put;
                  break;
                case "DELETE":
                  panel.iconPath = icons.del;
                  break;
              }
            }
            case "alert":
              vscode.window.showErrorMessage(message.text);
              return;
            case "request":
              const { url, method, body, headers } = state;
              try {
                const response = await fetch(url, {
                  method,
                  headers: headers?.reduce((accum, header) => ({...accum, [header.name]: header.value}), {}),
                  body: method !== "GET" ? body : undefined,
                });

                panel.webview.postMessage({
                  command: "response",
                  response: await objectifyResponse(response)
                });
              } catch (e) {
                vscode.window.showErrorMessage(String(e));
              } finally {
                return;
              }
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
  const newRequestCssUri = getUri(webview, extensionUri, [
    "out",
    "webview.css",
  ]);

  const newRequestScriptUri = getUri(webview, extensionUri, [
    "out",
    "webview.js",
  ]);

  const codiconsUri = getUri(webview, extensionUri, [
    "node_modules",
    "@vscode/codicons",
    "dist",
    "codicon.css",
  ]);

  const tsWorkerScriptSource = fs.readFileSync(
    extensionUri.fsPath + "/out/ts.worker.js",
    "utf-8"
  );
  const editorWorkerScriptSource = fs.readFileSync(
    extensionUri.fsPath + "/out/editor.worker.js"
  );

  const monacoEditorVs = getUri(webview, extensionUri, [
    "/node_modules/monaco-editor/min/vs",
  ]);

  const monacoEditorLoader = getUri(webview, extensionUri, [
    "node_modules/monaco-editor/min/vs/loader.js",
  ]);

  const monacoEditorMainNls = getUri(webview, extensionUri, [
    "/node_modules/monaco-editor/min/vs/editor/editor.main.nls.js",
  ]);

  const monacoEditorMain = getUri(webview, extensionUri, [
    "/node_modules/monaco-editor/min/vs/editor/editor.main.js",
  ]);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Request</title>
    <script defer type="module" src="${newRequestScriptUri}"></script>
    <link href="${codiconsUri}" rel="stylesheet" />
    <link href="${newRequestCssUri}" rel="stylesheet" />
  </head>
  <body tabindex="0">
    <div id="root"></div>
  </body>
</html>`;
}
