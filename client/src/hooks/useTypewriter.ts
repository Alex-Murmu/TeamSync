import { useState, useEffect, useRef } from 'react';

export function useTypewriter(initialText = "", speed = 50) {
  const [displayText, setDisplayText] = useState(initialText);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const startTyping = (text: string) => {
    setIsTyping(true);
    setDisplayText("");
    let index = 0;

    const type = () => {
      if (index < text.length) {
        setDisplayText(prev => prev + text[index]);
        index++;
        timeoutRef.current = window.setTimeout(type, speed);
      } else {
        setIsTyping(false);
      }
    };

    type();
  };

  const stopTyping = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTyping(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    displayText,
    isTyping,
    startTyping,
    stopTyping,
  };
}