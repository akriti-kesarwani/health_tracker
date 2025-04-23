import React, { useEffect, useState } from 'react';
import './ThemeTransition.css';

const ThemeTransition: React.FC = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 300);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return isTransitioning ? <div className="theme-transition" /> : null;
};

export default ThemeTransition; 