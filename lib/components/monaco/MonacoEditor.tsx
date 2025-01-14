import { useMemo } from "react";
import { useEffect, useRef, CSSProperties } from "react";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { createMonacoWrapperConfig } from "./config";
import { MonacoEditorLanguageClientWrapper, TextChanges } from "monaco-editor-wrapper";
import { emitter } from '../../utils/eventEmitter';

interface MonacoEditorProps {
  content?: { text: string; fileExt: string };
  style?: CSSProperties;
  onTextChanged?: (newText: string) => void;
}

export const MonacoEditor = ({
  content = { text: "", fileExt: "" },
  style = { height: "50vh" },
  onTextChanged,
}: MonacoEditorProps) => {
  const monacoEditorRef = useRef<MonacoEditorLanguageClientWrapper | null>(null);
  const memoizedWrapperConfig = useMemo(() => createMonacoWrapperConfig(content.text, content.fileExt), []);

  useEffect(() => {
    let isMounted = true;

    const waitForEditorInitialization = async (interval = 100) => {
      while (!monacoEditorRef.current?.isStarted()) {
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
      if (isMounted) {
        const codeResources = { text: content.text, fileExt: content.fileExt };
        monacoEditorRef.current?.updateCodeResources({
          modified: codeResources,
          original: codeResources,
        });
      }
    };

    waitForEditorInitialization();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    emitter.on("readOnlyModeChanged", handleReadOnlyModeChange);
    emitter.on("actionBarMounted", handleActionBarMount);
    emitter.on("undoRequested", handleUndoRequest);
    emitter.on("textUpdated", (text) => {
      console.log("Text updated event received:", text);
    });
  
    return () => {
      emitter.off("readOnlyModeChanged", handleReadOnlyModeChange);
      emitter.off("actionBarMounted", handleActionBarMount);
      emitter.off("undoRequested", handleUndoRequest);
      emitter.off("textUpdated", (text) => {
        console.log("Text updated event received:", text);
      });
    };
  }, []);

  const handleEditorLoad = (wrapper: MonacoEditorLanguageClientWrapper) => {
    monacoEditorRef.current = wrapper;
  };

  const handleTextChanged = (textChanges: TextChanges) => {
    emitter.emit("textUpdated", textChanges.modified as string);
    onTextChanged?.(textChanges.modified as string);
  };

  const handleReadOnlyModeChange = (newIsReadOnly: boolean) => {
    monacoEditorRef.current
      ?.getEditor()
      ?.updateOptions({ readOnly: newIsReadOnly });
  };

  const handleActionBarMount = () => {
    monacoEditorRef.current
      ?.getEditor()
      ?.updateOptions({ readOnly: true });
    emitter.emit(
      "textUpdated",
      monacoEditorRef.current?.getTextContents()?.modified
    );
  };

  const handleUndoRequest = (text: string) => {
    monacoEditorRef.current?.getMonacoEditorApp()?.updateCodeResources({
      modified: { text: text, fileExt: content.fileExt },
    });
  };

  return (
    <MonacoEditorReactComp
      wrapperConfig={memoizedWrapperConfig}
      style={style}
      onLoad={handleEditorLoad}
      onTextChanged={handleTextChanged}
    />
  );
};
