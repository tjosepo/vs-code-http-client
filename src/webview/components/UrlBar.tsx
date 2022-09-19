import {
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
  VSCodeButton,
} from "@vscode/webview-ui-toolkit/react";
import React from "react";
import { RequestData } from "../../shared/types";
import { useVsCode } from "../utils/VsCodeContext";

export const UrlBar = () => {
  const { state, setState, postMessage } = useVsCode<RequestData>();

  const setMethod = (e: any) => {
    setState((request) => ({
      ...request,
      method: (e.target as HTMLInputElement).value,
    }));
  };

  const setURL = (e: any) => {
    setState((request) => ({ ...request, url: (e.target as HTMLInputElement).value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      new URL(state.url);
    } catch {
      postMessage({
        command: "alert",
        text: `"${state.url}" is not a valid URL.`,
      });
      return;
    }

    postMessage({
      command: "request",
      request: state,
    });
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: 6, padding: 20 }}>
      <VSCodeDropdown value={state.method} onChange={setMethod} title="Request HTTP Method">
        <VSCodeOption value="GET">GET</VSCodeOption>
        <VSCodeOption value="POST">POST</VSCodeOption>
        <VSCodeOption value="HEAD">HEAD</VSCodeOption>
        <VSCodeOption value="PATCH">PATCH</VSCodeOption>
        <VSCodeOption value="DELETE">DELETE</VSCodeOption>
        <VSCodeOption value="PUT">PUT</VSCodeOption>
        <VSCodeOption value="OPTION">OPTION</VSCodeOption>
      </VSCodeDropdown>

      <VSCodeTextField
        value={state.url}
        type="text"
        onInput={setURL}
        autofocus={true}
        placeholder="Enter a request URL"
        title="Request URL"
        style={{ flexGrow: 1 }}
      />
      
      <VSCodeButton type="submit" title="Send Request">
        <i className="codicon codicon-play" />
      </VSCodeButton>
    </form>
  );
};
