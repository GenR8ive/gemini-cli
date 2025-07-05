# Gemini CLI - Cyberpunk GUI

A futuristic, cyberpunk-themed Electron GUI for the Gemini CLI, featuring neon colors, glitch effects, and sci-fi styling.

## Features

### 🎨 Cyberpunk Design
- **Neon Color Scheme**: Electric green, cyan, pink, and yellow accents
- **Glitch Effects**: Text glitch animations and scanline effects
- **Futuristic Typography**: Orbitron and Share Tech Mono fonts
- **Animated Elements**: Pulsing status indicators and loading animations

### 🤖 Gemini CLI Integration
- **Real-time Chat**: Direct integration with Gemini CLI commands
- **File System Access**: Browse and manipulate files through the GUI
- **Code Editor**: Built-in code editing capabilities
- **System Monitoring**: Real-time system statistics display
- **Shell Commands**: Execute terminal commands through the interface

### 🖥️ User Interface
- **Custom Window Frame**: Cyberpunk-styled titlebar with window controls
- **Sidebar Navigation**: Quick access to different system modules
- **Terminal-like Chat**: Command-line style interaction with Gemini AI
- **Status Indicators**: Real-time connection and system status
- **Responsive Design**: Adapts to different screen sizes

## Installation

1. Navigate to the GUI package:
```bash
cd packages/gui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Usage

### Starting the Application
The cyberpunk GUI will automatically launch with the Electron app. The interface includes:

- **Neural Chat**: Main chat interface with Gemini AI
- **File System**: Browse and manage files
- **Code Editor**: Edit code files with syntax highlighting
- **Data Analysis**: Analyze data with AI assistance
- **AI Tools**: Access various AI-powered tools

### Connecting to Gemini CLI
The GUI automatically attempts to connect to the Gemini CLI. If successful, you'll see:
- Green "ONLINE" status indicator
- Full access to all CLI features

If the CLI is not available, the app runs in simulation mode:
- Pink "SIMULATION" status indicator
- Mock responses for demonstration

### Customization
The cyberpunk theme can be customized by modifying:
- `src/styles/cyberpunk.css` - Main theme styles
- `src/components/GeminiInterface.tsx` - Main interface component
- `src/components/CyberpunkWindowFrame.tsx` - Window frame styling

## Technical Details

### Architecture
- **Frontend**: React with TypeScript
- **Styling**: Custom CSS with cyberpunk theme
- **IPC Communication**: Electron IPC for CLI integration
- **State Management**: React hooks for local state

### Key Components
- `GeminiInterface`: Main chat and interaction interface
- `CyberpunkWindowFrame`: Custom window frame with controls
- `GeminiCLIService`: Service layer for CLI communication

### IPC Handlers
The main process includes handlers for:
- `gemini-execute`: Execute CLI commands
- `gemini-chat`: Chat with Gemini AI
- `gemini-read-file`: Read file contents
- `gemini-write-file`: Write file contents
- `gemini-list-directory`: List directory contents
- `gemini-shell-command`: Execute shell commands
- `gemini-system-info`: Get system information

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

### Packaging
```bash
npm run package
```

## Screenshots

The interface features:
- Dark cyberpunk background with neon accents
- Glowing borders and text effects
- Animated status indicators
- Terminal-style chat interface
- Sidebar with system menu and stats

## Contributing

When contributing to the cyberpunk GUI:

1. Maintain the cyberpunk aesthetic
2. Follow the existing color scheme
3. Add appropriate animations and effects
4. Ensure accessibility is maintained
5. Test on different screen sizes

## License

This project is part of the Gemini CLI and follows the same license terms. 