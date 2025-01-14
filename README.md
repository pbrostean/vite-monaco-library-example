# Vite Monaco Library Example

## Getting Started

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Build the project:

   ```sh
   pnpm run build
   ```

3. Link the library:

    ```sh
    npm link
    ```

4. In another project, link the library:

    ```sh
    npm link @test/lib-ui
    ```

5. Import the library in a React project:
    ```javascript
    import { MonacoEditor } from "@test/lib-ui";
    ```
