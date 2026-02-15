
// Simple polyfill for isomorphic-ws in the browser
export const WebSocket = globalThis.WebSocket;
export default globalThis.WebSocket;
