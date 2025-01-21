import path from "path";
import fs from "fs";

export default function replacePatternPlugin(filePath: string, pattern: RegExp, replacement: string) {
    return {
        name: "replace-pattern-plugin",
        closeBundle() {
            const resolvedFilePath = path.resolve(__dirname, filePath);

            fs.readFile(resolvedFilePath, 'utf8', (err, data) => {
                if (err) return console.error('Error reading file:', err);

                const match = data.match(pattern);
                if (!match) return console.error('Error: Could not find the pattern.');

                const partToReplace = match[1];
                const result = data.replace(partToReplace, replacement);

                fs.writeFile(resolvedFilePath, result, 'utf8', (err) => {
                    if (err) console.error('Error writing file:', err);
                    else console.log('Pattern replaced successfully.');
                });
            });
        },
    };
}