import { exposeThemeContext } from "./theme/theme-context";
import { exposeWindowContext } from "./window/window-context";
import { contextBridge, ipcRenderer } from "electron";

export default function exposeContexts() {
  exposeWindowContext();
  exposeThemeContext();
  
  // Expose electronAPI for Gemini CLI service
  contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel: string, data?: unknown) => ipcRenderer.invoke(channel, data),
  });
}
