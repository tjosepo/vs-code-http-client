import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const vscode = acquireVsCodeApi();

interface VsCode<T> {
  state: T;
  setState(value: SetStateAction<T>): void;
  postMessage(message: unknown): void;
}

const VsCodeContext = createContext<VsCode<unknown>>({
  state: undefined,
  setState: () => undefined,
  postMessage: () => undefined,
});

interface VsCodeProviderProps<T> {
  defaultValue: T;
  children: ReactNode;
}
export function VsCodeProvider<T>({
  defaultValue,
  children,
}: VsCodeProviderProps<T>) {
  const [state, setState] = useState(
    (JSON.stringify(vscode.getState()) as T | undefined) ?? defaultValue
  );

  // Sync React's state with VS Code's state
  useEffect(() => {
    vscode.setState(JSON.stringify(state));
    vscode.postMessage({ command: "stateChange", state: JSON.stringify(state) });
  }, [state]);

  return (
    <VsCodeContext.Provider
      value={{
        state,
        setState,
        postMessage: vscode.postMessage,
      }}
    >
      {children}
    </VsCodeContext.Provider>
  );
}

export function useVsCode<T>() {
  return useContext(VsCodeContext) as VsCode<T>;
}
