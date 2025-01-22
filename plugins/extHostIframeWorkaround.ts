import path from "path";
import fs from "fs";
import MagicString from "magic-string";

export default function extHostIframeWorkaround() {
    return {
        name: "ext-host-iframe-workaround",
        writeBundle() {
            const distDir = path.resolve("dist");
            const files = fs.readdirSync(distDir);

            files.forEach((file) => {
                const filePath = path.join(distDir, file);
                if (fs.statSync(filePath).isFile()) {
                    let code = fs.readFileSync(filePath, "utf8");
                    const matches: RegExpMatchArray[] = [
                        ...code.matchAll(
                            /"vs\/workbench\/services\/extensions\/worker\/webWorkerExtensionHostIframe\.html"\s*:\s*\(\)\s*=>\s*(\w+)\(new\s*URL\("([^"]+)",\s*import\.meta\.url\)\.href\)/g
                        ),
                    ];

                    if (matches.length) {
                        const s = new MagicString(code);

                        for (const match of matches) {
                            const [str, variable, url] = match;
                            const replacement = `"vs/workbench/services/extensions/worker/webWorkerExtensionHostIframe.html": () => ${variable}(new URL("./assets/webWorkerExtensionHostIframe.html", import.meta.url).href)`;

                            s.overwrite(
                                match.index as number,
                                (match.index as number) + str.length,
                                replacement
                            );
                        }

                        fs.writeFileSync(filePath, s.toString(), "utf8");
                    }
                }
            });
        },
    };
}