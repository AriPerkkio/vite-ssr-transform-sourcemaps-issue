import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { createServer } from "vite";

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

function toVisualizer(transformResult) {
  const { code, map } = transformResult;
  const encoder = new TextEncoder();

  // Convert the strings to Uint8Array
  const codeArray = encoder.encode(code);
  const mapArray = encoder.encode(map);

  // Create Uint8Array for the lengths
  const codeLengthArray = encoder.encode(codeArray.length.toString());
  const mapLengthArray = encoder.encode(mapArray.length.toString());

  // Combine the lengths and the data
  const combinedArray = new Uint8Array(
    codeLengthArray.length +
      1 +
      codeArray.length +
      mapLengthArray.length +
      1 +
      mapArray.length
  );

  combinedArray.set(codeLengthArray);
  combinedArray.set([0], codeLengthArray.length);
  combinedArray.set(codeArray, codeLengthArray.length + 1);
  combinedArray.set(
    mapLengthArray,
    codeLengthArray.length + 1 + codeArray.length
  );
  combinedArray.set(
    [0],
    codeLengthArray.length + 1 + codeArray.length + mapLengthArray.length
  );
  combinedArray.set(
    mapArray,
    codeLengthArray.length + 1 + codeArray.length + mapLengthArray.length + 1
  );

  // Convert the Uint8Array to a binary string
  let binary = "";
  const len = combinedArray.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(combinedArray[i]);

  // Convert the binary string to a base64 string and return it
  return `https://evanw.github.io/source-map-visualization#${btoa(binary)}`;
}
