// Use window.electronAPI instead of direct electron import
declare global {
  interface Window {
    electronAPI: {
      invoke: (channel: string, data?: unknown) => Promise<unknown>;
    };
  }
}

export interface GeminiResponse {
  success: boolean;
  data?: string;
  error?: string;
  type: 'text' | 'code' | 'file' | 'command';
}

export interface GeminiRequest {
  command: string;
  args?: string[];
  options?: Record<string, unknown>;
}

class GeminiCLIService {
  private isConnected = false;

  async initialize(): Promise<boolean> {
    try {
      // Check if Gemini CLI is available
      const result = await this.executeCommand('gemini', ['--version']);
      this.isConnected = result.success;
      return result.success;
    } catch (error) {
      console.error('Failed to initialize Gemini CLI:', error);
      this.isConnected = false;
      return false;
    }
  }

  async executeCommand(command: string, args: string[] = []): Promise<GeminiResponse> {
    try {
      const response = await window.electronAPI.invoke('gemini-execute', {
        command,
        args,
        options: {
          cwd: process.cwd(),
          env: process.env
        }
      }) as GeminiResponse;
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'text'
      };
    }
  }

  async chat(message: string): Promise<GeminiResponse> {
    try {
      const response = await window.electronAPI.invoke('gemini-chat', {
        message,
        options: {
          model: 'gemini-pro',
          temperature: 0.7,
          maxTokens: 1000
        }
      }) as GeminiResponse;
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Chat failed',
        type: 'text'
      };
    }
  }

  async readFile(path: string): Promise<GeminiResponse> {
    try {
      const response = await window.electronAPI.invoke('gemini-read-file', { path }) as GeminiResponse;
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read file',
        type: 'file'
      };
    }
  }

  async writeFile(path: string, content: string): Promise<GeminiResponse> {
    try {
      const response = await window.electronAPI.invoke('gemini-write-file', { path, content }) as GeminiResponse;
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to write file',
        type: 'file'
      };
    }
  }

  async listDirectory(path: string = '.'): Promise<GeminiResponse> {
    try {
      const response = await window.electronAPI.invoke('gemini-list-directory', { path }) as GeminiResponse;
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list directory',
        type: 'file'
      };
    }
  }

  async runShellCommand(command: string): Promise<GeminiResponse> {
    try {
      const response = await window.electronAPI.invoke('gemini-shell-command', { command }) as GeminiResponse;
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Shell command failed',
        type: 'command'
      };
    }
  }

  async getSystemInfo(): Promise<GeminiResponse> {
    try {
      const response = await window.electronAPI.invoke('gemini-system-info') as GeminiResponse;
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get system info',
        type: 'text'
      };
    }
  }

  isReady(): boolean {
    return this.isConnected;
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.executeCommand('echo', ['test']);
      return result.success;
    } catch {
      return false;
    }
  }
}

export const geminiCLIService = new GeminiCLIService(); 