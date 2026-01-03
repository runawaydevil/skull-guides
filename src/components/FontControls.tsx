import { useState, useEffect } from 'react';
import './FontControls.css';

const FONT_SIZE_KEY = 'skull-guides-font-size';
const MIN_SCALE = 0.875; // 14px
const MAX_SCALE = 1.25; // 20px
const DEFAULT_SCALE = 1;

export function FontControls() {
  const [scale, setScale] = useState(DEFAULT_SCALE);

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= MIN_SCALE && parsed <= MAX_SCALE) {
        setScale(parsed);
        document.documentElement.style.setProperty('--font-size-scale', String(parsed));
      }
    }
  }, []);

  const handleDecrease = () => {
    const newScale = Math.max(MIN_SCALE, scale - 0.125);
    updateScale(newScale);
  };

  const handleIncrease = () => {
    const newScale = Math.min(MAX_SCALE, scale + 0.125);
    updateScale(newScale);
  };

  const handleReset = () => {
    updateScale(DEFAULT_SCALE);
  };

  const updateScale = (newScale: number) => {
    setScale(newScale);
    document.documentElement.style.setProperty('--font-size-scale', String(newScale));
    localStorage.setItem(FONT_SIZE_KEY, String(newScale));
  };

  return (
    <div className="font-controls">
      <button
        className="font-control-btn"
        onClick={handleDecrease}
        disabled={scale <= MIN_SCALE}
        aria-label="Decrease font size"
        title="Decrease font size"
      >
        A−
      </button>
      <button
        className="font-control-btn"
        onClick={handleReset}
        aria-label="Reset font size"
        title="Reset font size"
      >
        A
      </button>
      <button
        className="font-control-btn"
        onClick={handleIncrease}
        disabled={scale >= MAX_SCALE}
        aria-label="Increase font size"
        title="Increase font size"
      >
        A+
      </button>
    </div>
  );
}

