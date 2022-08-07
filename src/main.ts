import * as vscode from "vscode";
import * as sidebar from "./sidebar";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "http-client" is now active!');

  sidebar.activate(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
