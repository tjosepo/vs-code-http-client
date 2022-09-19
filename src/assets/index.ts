import * as vscode from "vscode";

export const getIcons = (context: vscode.ExtensionContext) => ({
  get: vscode.Uri.joinPath(context.extensionUri, "src/assets/get.svg"),
  post: vscode.Uri.joinPath(context.extensionUri, "src/assets/post.svg"),
  put: vscode.Uri.joinPath(context.extensionUri, "src/assets/put.svg"),
  del: vscode.Uri.joinPath(context.extensionUri, "src/assets/delete.svg"),
});
