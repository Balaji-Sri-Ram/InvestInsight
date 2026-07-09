import React, { useState, useEffect } from 'react';

export const AnimatedNumber = ({ value = 0, duration = 1500, className = '', disableAnimation = false }) => {
  const [currentValue, setCurrentValue] = useState(disableAnimation ? value : 0);

  useEffect(() => {
    if (disableAnimation || value === 0) {
      setCurrentValue(value);
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smoother animation (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setCurrentValue(Math.floor(easeProgress * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrentValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span className={className}>{currentValue}</span>;
};
