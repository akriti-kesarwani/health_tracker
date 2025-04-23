import React, { useState, useEffect } from 'react';

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Strength does not come from the body. It comes from the will.",
  "The harder you work, the better you get.",
  "Make yourself stronger than your excuses.",
  "Your health is an investment, not an expense.",
  "The only limit is the one you set yourself.",
  "Success starts with self-discipline.",
  "Your body achieves what your mind believes.",
  "Don't wish for it, work for it."
];

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="motivational-quote">
      <p>"{quote}"</p>
    </div>
  );
};

export default MotivationalQuote; 