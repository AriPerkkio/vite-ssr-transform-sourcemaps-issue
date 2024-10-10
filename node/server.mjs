import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { createServer } from "vite";
import { toVisualizer } from "./to-visualizer.mjs";

const server = await createServer({
  configFile: false,
  root: fileURLToPath(new URL(".", import.meta.url)),
  server: { port: 1337 },
});

await server.listen();

const transformResult = await server.transformRequest("./math.ts", {
  ssr: true,
});

const code = `${transformResult.code}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(
  transformResult.map.toString()
).toString("base64")}
`;
writeFileSync("./transpiled.js", code, "utf-8");

console.log(toVisualizer(transformResult));

console.log("\nRun command:");
console.log("node --inspect-brk entry.mjs");

server.close();
