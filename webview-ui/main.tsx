import { createRoot } from "react-dom/client";
import React, { StrictMode } from "react";
import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";

const vscode = acquireVsCodeApi();

// Usage
const App = () => {
  console.log("Hi there");
  const onClick = () => {
    console.log("hello");

    console.log(vscode);

    vscode.postMessage({
      command: "alert",
      text: "🐛  on line 2",
    });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
        <VSCodeDropdown style={{ height: 27 }}>
          <VSCodeOption>GET</VSCodeOption>
          <VSCodeOption>POST</VSCodeOption>
          <VSCodeOption>PUT</VSCodeOption>
        </VSCodeDropdown>
        <VSCodeTextField
          placeholder="URL"
          style={{ width: "100%", height: 27 }}
        />
        <VSCodeButton>Send</VSCodeButton>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
