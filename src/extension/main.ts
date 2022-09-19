import * as vscode from "vscode";
import * as newRequest from "./new-request";

export function activate(context: vscode.ExtensionContext) {
  newRequest.activate(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
