
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';

interface ProfilePhotoProps {
  src: string;
  alt: string;
  className?: string;
  themeAware?: boolean;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ src, alt, className, themeAware = false }) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "relative rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:scale-105",
      "w-48 h-48 md:w-64 md:h-64",
      themeAware ? (
        theme === 'dark' 
          ? "border-4 border-purple-500 shadow-purple-500/20" 
          : "border-4 border-purple-600 shadow-purple-600/20"
      ) : "border-4 border-purple-500 shadow-purple-500/20",
      className
    )}>
      <img 
        src={src} 
        alt={alt} 
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default ProfilePhoto;
