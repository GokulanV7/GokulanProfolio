
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
  reverse?: boolean;
  intensity?: 'light' | 'medium' | 'strong';
  easing?: boolean;
  themeAware?: boolean;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  children, 
  speed = 0.1,
  direction = 'vertical',
  className,
  reverse = false,
  intensity = 'medium',
  easing = true,
  themeAware = false
}) => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [translateValue, setTranslateValue] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate speed factor based on intensity
  const getSpeedFactor = () => {
    switch(intensity) {
      case 'light': return speed * 0.5;
      case 'strong': return speed * 2;
      default: return speed;
    }
  };

  const speedFactor = getSpeedFactor() * (reverse ? -1 : 1);
  
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(section);
    
    const initialOffset = window.scrollY + section.getBoundingClientRect().top;
    
    const handleScroll = () => {
      if (!section || !isVisible) return;
      
      const scrollPosition = window.scrollY;
      const offset = (scrollPosition - initialOffset) * speedFactor;
        
      const newX = direction === 'horizontal' ? offset : 0;
      const newY = direction === 'vertical' ? offset : 0;
        
      setTranslateValue({ x: newX, y: newY });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initialize position
    handleScroll();
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    }
  }, [speedFactor, direction, isVisible]);
  
  const transformStyle = {
    transform: `translate3d(${translateValue.x}px, ${translateValue.y}px, 0)`,
    transition: easing ? 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)' : 'none',
  };
  
  return (
    <div 
      ref={sectionRef} 
      className={cn(
        "will-change-transform opacity-100",
        {
          "bg-white/5 dark:bg-black/5": themeAware
        },
        className
      )}
      style={transformStyle}
      data-theme={theme}
    >
      {children}
    </div>
  );
};

export default ParallaxSection;
