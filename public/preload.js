const { contextBridge } = require("electron");

/**
 * Preload script for Electron.
 * Exposes APIs to the renderer process in a secure way.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  // Add custom APIs here
});
