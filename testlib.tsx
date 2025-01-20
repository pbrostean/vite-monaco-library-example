import React from "react";
import ReactDOM from "react-dom/client";
// Option 1: use the lib
import { MonacoEditor } from "./dist/index.js";
// Optioin: 2: use vite to perform the transforms
//import { MonacoEditor } from "./lib/components/monaco/MonacoEditor";

export const run = async () => {
    const root = ReactDOM.createRoot(document.getElementById("react-root")!);
    try {
        const App = () => {
            return (
                <div style={{ height: "80vh", padding: "5px" }}>
                    <MonacoEditor
                        content={{ text: "# Header", fileExt: "md" }}
                    />
                </div>
            );
        };
        root.render(<App />);
    } catch (e) {
        console.error(e);
    }
};
