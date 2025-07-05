import { app, BrowserWindow, ipcMain } from "electron";
import registerListeners from "./helpers/ipc/listeners-register";
// "electron-squirrel-startup" seems broken when packaging with vite
//import started from "electron-squirrel-startup";
import path from "path";
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';

const inDevelopment = process.env.NODE_ENV === "development";
const execAsync = promisify(exec);

function createWindow() {
  // Use proper path resolution for Vite builds
  const preload = path.join(__dirname, "preload.js");
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Gemini CLI",
    frame: false, // Remove native window frame completely
    webPreferences: {
      devTools: true, // Always enable dev tools for debugging
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: false,
      preload: preload,
    },
  });
  registerListeners(mainWindow);
  
  // Open dev tools automatically in development
  if (inDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

async function installExtensions() {
  try {
    const result = await installExtension(REACT_DEVELOPER_TOOLS);
    console.log(`Extensions installed successfully: ${result.name}`);
  } catch {
    console.error("Failed to install extensions");
  }
}

app.whenReady().then(createWindow).then(installExtensions);

//osX only
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//osX only ends

// Gemini CLI IPC Handlers
ipcMain.handle('gemini-execute', async (event, { command, args, options }) => {
  try {
    const { stdout, stderr } = await execAsync(`${command} ${args.join(' ')}`, options);
    return {
      success: true,
      data: stdout,
      error: stderr,
      type: 'command'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Command execution failed',
      type: 'command'
    };
  }
});

ipcMain.handle('gemini-chat', async (event, { message }) => {
  try {
    // Execute Gemini CLI with the message
    const { stdout, stderr } = await execAsync(`gemini "${message}"`, {
      cwd: process.cwd(),
      env: process.env
    });
    
    return {
      success: true,
      data: stdout,
      error: stderr,
      type: 'text'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Chat failed',
      type: 'text'
    };
  }
});

ipcMain.handle('gemini-read-file', async (event, { path: filePath }) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return {
      success: true,
      data: content,
      type: 'file'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to read file',
      type: 'file'
    };
  }
});

ipcMain.handle('gemini-write-file', async (event, { path: filePath, content }) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return {
      success: true,
      data: 'File written successfully',
      type: 'file'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to write file',
      type: 'file'
    };
  }
});

ipcMain.handle('gemini-list-directory', async (event, { path: dirPath }) => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const fileList = files.map(file => ({
      name: file.name,
      isDirectory: file.isDirectory(),
      path: path.join(dirPath, file.name)
    }));
    
    return {
      success: true,
      data: JSON.stringify(fileList),
      type: 'file'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list directory',
      type: 'file'
    };
  }
});

ipcMain.handle('gemini-shell-command', async (event, { command }) => {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      env: process.env
    });
    
    return {
      success: true,
      data: stdout,
      error: stderr,
      type: 'command'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Shell command failed',
      type: 'command'
    };
  }
});

ipcMain.handle('gemini-system-info', async () => {
  try {
    const platform = process.platform;
    const arch = process.arch;
    const nodeVersion = process.version;
    const electronVersion = process.versions.electron;
    
    // Get system memory info
    const memUsage = process.memoryUsage();
    
    // Get CPU info
    const { stdout: cpuInfo } = await execAsync('nproc');
    
    const systemInfo = {
      platform,
      arch,
      nodeVersion,
      electronVersion,
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      cpuCores: parseInt(cpuInfo.trim())
    };
    
    return {
      success: true,
      data: JSON.stringify(systemInfo),
      type: 'text'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get system info',
      type: 'text'
    };
  }
});
