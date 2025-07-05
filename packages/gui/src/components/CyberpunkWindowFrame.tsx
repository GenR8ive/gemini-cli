import React from 'react';
import { X, Minus, Square } from 'lucide-react';

interface CyberpunkWindowFrameProps {
  children: React.ReactNode;
}

export default function CyberpunkWindowFrame({ children }: CyberpunkWindowFrameProps) {
  const handleMinimize = async () => {
    if (window.electronWindow) {
      await window.electronWindow.minimize();
    }
  };

  const handleMaximize = async () => {
    if (window.electronWindow) {
      await window.electronWindow.maximize();
    }
  };

  const handleClose = async () => {
    if (window.electronWindow) {
      await window.electronWindow.close();
    }
  };

  return (
    <div className="cyberpunk-window-frame">
      <div className="cyberpunk-titlebar">
        <div className="cyberpunk-titlebar-content">
          <div className="cyberpunk-titlebar-title">
            <div className="cyberpunk-logo">
              <div className="cyberpunk-logo-icon">⚡</div>
              <span>GEMINI CLI</span>
            </div>
          </div>
          <div className="cyberpunk-titlebar-controls">
            <button 
              className="cyberpunk-control-button minimize"
              onClick={handleMinimize}
              title="Minimize"
            >
              <Minus size={12} />
            </button>
            <button 
              className="cyberpunk-control-button maximize"
              onClick={handleMaximize}
              title="Maximize"
            >
              <Square size={12} />
            </button>
            <button 
              className="cyberpunk-control-button close"
              onClick={handleClose}
              title="Close"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      </div>
      <div className="cyberpunk-content">
        {children}
      </div>
    </div>
  );
} 