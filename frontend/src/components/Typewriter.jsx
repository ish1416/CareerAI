import React, { useEffect, useState } from 'react';

export default function Typewriter({ text, speed = 40, startDelay = 0, className = '', onError }) {
  const [display, setDisplay] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplay(text || '');
      return;
    }

    try {
      let i = 0;
      let intervalId = null;
      const timeoutId = setTimeout(() => {
        intervalId = setInterval(() => {
          i++;
          setDisplay(text.slice(0, i));
          if (i >= text.length) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }, speed);
      }, startDelay);

      return () => {
        clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
      };
    } catch (err) {
      console.warn('Typewriter error:', err);
      setError(true);
      setDisplay(text);
      if (onError) onError(err);
    }
  }, [text, speed, startDelay, onError]);

  if (error) {
    return <span className={className}>{text}</span>;
  }

  return <span className={className}>{display}</span>;
}