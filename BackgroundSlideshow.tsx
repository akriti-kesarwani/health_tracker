import React, { useEffect, useState } from 'react';

const BackgroundSlideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background-slideshow">
      {[...Array(totalSlides)].map((_, index) => (
        <div
          key={index}
          className={`background-slide ${index === currentSlide ? 'active' : ''}`}
          style={{
            backgroundImage: `var(--bg-image-${index + 1})`,
          }}
        />
      ))}
      <div className="background-overlay" />
    </div>
  );
};

export default BackgroundSlideshow; 