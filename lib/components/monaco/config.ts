import "@codingame/monaco-vscode-markdown-basics-default-extension"
import "@codingame/monaco-vscode-markdown-language-features-default-extension"
import textEditorWorker from "monaco-editor/esm/vs/editor/editor.worker.js?worker&inline";
import textMateWorker from "@codingame/monaco-vscode-textmate-service-override/worker?worker&inline";
import { WrapperConfig } from "monaco-editor-wrapper";
import { useWorkerFactory } from "monaco-editor-wrapper/workerFactory";
import { LogLevel } from 'vscode/services';

export const createMonacoWrapperConfig = (
  text: string,
  fileExt: string
): WrapperConfig => {
  return {
    $type: "extended",
    logLevel: LogLevel.Debug,
    htmlContainer: document.getElementById("monaco-editor-root") as HTMLElement,
    vscodeApiConfig: {
      enableExtHostWorker: true,
      userConfiguration: {
        json: JSON.stringify({
          "workbench.colorTheme": "Default Light Modern",
          "editor.guides.bracketPairsHorizontal": true,
          "editor.experimental.asyncTokenization": true,
        }),
      },
    },
    editorAppConfig: {
      codeResources: {
        original: {
          text: text,
          fileExt: fileExt,
        },
        modified: {
          text: text,
          fileExt: fileExt,
        },
      },
      useDiffEditor: false,
      monacoWorkerFactory: (logger) => {
        useWorkerFactory({
          workerOverrides: {
            ignoreMapping: true,
            workerLoaders: {
              TextEditorWorker: () => new textEditorWorker(),
              TextMateWorker: () => new textMateWorker(),
            },
          },
          logger,
        });
      },
    },
  };
};
