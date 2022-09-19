import { VSCodePanelTab, VSCodePanelView, VSCodeBadge } from "@vscode/webview-ui-toolkit/react";
import React from "react";
import { Header } from "../../shared/types";

interface ResponseHeadersTabProps {
  headers?: Header[];
}

export default function ResponseHeadersTab({ headers = [] }: ResponseHeadersTabProps) {
  return <>
    <VSCodePanelTab id="tab-headers">
      HEADERS
      {headers.length > 0 && <VSCodeBadge>{headers.length}</VSCodeBadge>}
    </VSCodePanelTab>
    
    <VSCodePanelView id="view-headers" style={{ height: "100%", margin: "-36px -20px 0", padding: "46px 0 0", position: "relative", zIndex: -1 }}>
      <div style={{overflowY: "auto"}}>
        {headers.map(({name, value}) => (
          <p key={name} style={{ fontSize: "12px", padding: "0 20px" }}>
            <span style={{ fontWeight: 700 }}>{name}: </span>
            <span className="code">{value}</span>
          </p>
        ))}
      </div>
    </VSCodePanelView>
  </>;
}