import Editor, { Monaco } from '@monaco-editor/react';
import { VSCodePanelTab, VSCodePanelView, VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import React from 'react';
import { ResponseData } from "../../shared/types";
import { monacoStyles } from '../components/editor';

export default function PreviewTab({ response }: { response?: ResponseData }) {

  const onMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("myTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: monacoStyles(),
    });
    monaco.editor.setTheme("myTheme");
    monaco.editor.onDidCreateEditor(listener => listener.getAction('editor.action.formatDocument').run());
  };

  const contentType = response?.headers?.find((header) => header.name === "content-type")?.value ?? "text/plain";

  let language: string | undefined = undefined;
  if (contentType.includes("application/json")) {language = "json";}
  else if (contentType.includes("application/html")) {language = "html";}
  else if (contentType.includes("application/javascript")) {language = "javascript";}
  else if (contentType.includes("application/css")) {language = "css";}

  return (
    <>
      <VSCodePanelTab id="tab-response">PREVIEW</VSCodePanelTab>
      <VSCodePanelView
        id="view-response"
        style={{ height: "100%", margin: "0 -20px", padding: "10px 0 0" }}
      >
        {Boolean(response) && contentType.includes("text/html")
          ? <iframe style={{ width: "100%", border: "none", background: "white"}} src={response?.url} />
          : (
            <Editor
              height="100%"
              theme="myTheme"
              beforeMount={onMount}
              loading={<VSCodeProgressRing />}
              language={language}
              options={{
                readOnly: true,
                minimap: { enabled: false },
              }}
              value={response?.body}
            />
          )}
      </VSCodePanelView>
    </>
  );
}