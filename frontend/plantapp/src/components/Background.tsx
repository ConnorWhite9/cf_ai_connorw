import React, { useEffect } from 'react';

// Load custom fonts
export const usePlantPalFonts = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Quicksand:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
};

interface PlantPalBackgroundProps {
  children: React.ReactNode;
}

export const Background: React.FC<PlantPalBackgroundProps> = ({ children }) => {
  usePlantPalFonts();
  
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-emerald-950" 
      style={{ fontFamily: "'Quicksand', sans-serif" }}
    >
      {children}
    </div>
  );
};
