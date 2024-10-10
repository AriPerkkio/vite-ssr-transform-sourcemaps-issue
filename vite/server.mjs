import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const server = await createServer({
  configFile: false,
  root: fileURLToPath(new URL(".", import.meta.url)),
  server: { port: 1337 },
});

await server.listen();

debugger;

await server.ssrLoadModule("./entry.mjs");

await server.close();
