globalThis.__vite_ssr_exports__ = {};
debugger;

await import("./transpiled.js");
const { add, multiply } = globalThis.__vite_ssr_exports__;

// Incorrect position when "step into"
globalThis.__vite_ssr_exports__.add(1, 2);

// Correct position when "stepinto"
add(1, 2);

// Same here
globalThis.__vite_ssr_exports__.multiply(1, 2);
multiply(1, 2);
