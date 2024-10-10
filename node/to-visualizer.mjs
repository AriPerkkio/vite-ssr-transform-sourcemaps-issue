// Original code: https://github.com/antfu-collective/vite-plugin-inspect/blob/6c5b6b2c8bdb20883ae3d5d8d94a189300d3daa6/src/client/logic/utils.ts#L59
export function toVisualizer(transformResult) {
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
