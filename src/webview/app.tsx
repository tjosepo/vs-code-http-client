import { createRoot } from "react-dom/client";
import React, { StrictMode, useEffect, useState } from "react";
import {
  VSCodeDivider,
  VSCodePanels,
  VSCodePanelTab,
  VSCodePanelView,
  VSCodeProgressRing,
} from "@vscode/webview-ui-toolkit/react";
import "./styles.css";
import { useVsCode, VsCodeProvider } from "./utils/VsCodeContext";
import { UrlBar } from "./components/UrlBar";

import Editor, { Monaco } from "@monaco-editor/react";
import { monacoStyles } from "./components/editor";
import { RequestData, ResponseData } from "../shared/types";
import ResponseHeadersTab from "./response/HeadersTab";
import PreviewTab from "./response/PreviewTab";

const App = () => {
  const { state, setState } = useVsCode<RequestData>();
  const [response, setResponse] = useState<ResponseData>();

  const onMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("myTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: monacoStyles(),
    });
    monaco.editor.setTheme("myTheme");
  };

  useEffect(() => {
    const handleMessage = ({ data }: any) => {
      switch (data.command) {
        case "response": {
          setResponse(data.response);
          return;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);


  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <UrlBar />
      <VSCodeDivider style={{ margin: 0 }} />
      <div
        style={{
          display: "grid",
          height: "100%",
          maxHeight: "100%",
          gridTemplateColumns: "1fr 1fr",
          flexGrow: 1,
        }}
      >
        <VSCodePanels
          style={{
            padding: "0 20px",
            gap: 2,
            borderRight: "1px solid var(--divider-background)",
          }}
        >
          <VSCodePanelTab id="tab-plain-text">PLAIN TEXT</VSCodePanelTab>
          <VSCodePanelView
            id="view-plain-text"
            style={{ height: "100%", margin: "0 -20px", padding: "10px 0 0" }}
          >
            <Editor
              height="100%"
              theme="myTheme"
              beforeMount={onMount}
              loading={<VSCodeProgressRing />}
              options={{
                minimap: { enabled: false },
              }}
              value={JSON.stringify(state)}
            />
          </VSCodePanelView>

          <VSCodePanelTab id="tab-params">JSON</VSCodePanelTab>
          <VSCodePanelView
            id="view-params"
            style={{ height: "100%", margin: "0 -20px", padding: "10px 0 0" }}
          >
            <Editor
              height="100%"
              theme="myTheme"
              beforeMount={onMount}
              loading={<VSCodeProgressRing />}
              language="json"
              options={{
                minimap: { enabled: false },
              }}
              onChange={(value) =>
                setState((state) => ({ ...state, body: value }))
              }
              defaultValue={'{ \n "foo": "bar"\n}\n'}
            />
          </VSCodePanelView>
        </VSCodePanels>


        {/* RESPONSE */}
        <VSCodePanels style={{
          padding: "0 20px",
          overflow: "auto",
          gap: 2,
        }}
        >
          <PreviewTab response={response} />
          <ResponseHeadersTab headers={response?.headers} />
        </VSCodePanels>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <VsCodeProvider defaultValue={{ url: "", method: "GET", headers: [] }}>
      <App />
    </VsCodeProvider>
  </StrictMode>
);
