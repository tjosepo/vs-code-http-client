import * as vscode from "vscode";
import { getUri } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("http-client.newRequest", () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        "catCoding",
        "New Request",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      // And set its HTML content
      panel.webview.html = getWebviewContent(
        panel.webview,
        context.extensionUri
      );

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "alert":
              vscode.window.showErrorMessage(message.text);
              return;
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
  const mainUri = getUri(webview, extensionUri, [
    "out",
    "webview-ui",
    "main.js",
  ]);

  const iconUri = getUri(webview, extensionUri, ["src", "icons", "get.svg"]);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="${iconUri}" type="image/svg+xml">
    <title>New Request</title>
    <script type="module" src="${mainUri}"></script>
    </head>
<body>
<div id="root"></div>
</body>
</html>`;
}
