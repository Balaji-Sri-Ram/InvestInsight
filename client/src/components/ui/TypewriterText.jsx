import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const TypewriterText = ({ text = '', speed = 5, className = '', onComplete, disableAnimation = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(!disableAnimation);

  useEffect(() => {
    if (disableAnimation) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }
    // Reset when text changes
    setDisplayedText('');
    setIsTyping(true);
    
    if (!text) {
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < text.length - 1) {
        // Advance by a few characters for very fast "ChatGPT-like" typing speed
        // If speed is 5, it means add 5 characters per interval
        const chunk = text.substring(currentIndex, currentIndex + speed);
        setDisplayedText((prev) => prev + chunk);
        currentIndex += speed;
      } else {
        // Ensure the full text is set at the end in case of remaining characters
        setDisplayedText(text);
        setIsTyping(false);
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15); // Update every 15ms

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  const markdownText = isTyping ? displayedText + ' ▍' : displayedText;

  return (
    <div className={`typewriter-markdown ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownText}
      </ReactMarkdown>
    </div>
  );
};
