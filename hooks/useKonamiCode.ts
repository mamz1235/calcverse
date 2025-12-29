import { useEffect, useState } from 'react';

export const useKonamiCode = (callback: () => void) => {
  const [input, setInput] = useState<string[]>([]);
  const sequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const newInput = [...input, key].slice(-sequence.length);
      setInput(newInput);

      if (JSON.stringify(newInput) === JSON.stringify(sequence)) {
        callback();
        setInput([]); // Reset after activation
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, callback, sequence]);
};
