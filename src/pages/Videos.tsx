
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParallaxSection from '@/components/ParallaxSection';
import { useTheme } from '@/components/ThemeProvider';

const Videos = () => {
  const { theme } = useTheme();
  
  const videos = [
    {
      title: "Flutter App Demo",
      description: "A walkthrough of my e-commerce app built with Flutter",
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "FALO AI Demo",
      description: "Demonstrating our fake news detection algorithm in action",
      thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Flutter UI Tutorial",
      description: "How to build beautiful user interfaces with Flutter",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Machine Learning Pipeline",
      description: "Building an end-to-end ML pipeline for real-world applications",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ];
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'} px-4 sm:px-8 lg:px-12`}>
      <Navbar />
      
      <div className="pt-24 pb-24 space-y-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParallaxSection speed={0.05}>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-gradient' : 'text-gradient-light'}`}>
              Video Gallery
            </h1>
            <p className={`text-center mb-12 max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Watch demos and tutorials showcasing my Flutter applications and AI/ML implementations.
            </p>
          </ParallaxSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {videos.map((video, index) => (
              <ParallaxSection key={index} speed={0.05 + (index * 0.02)}>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group block overflow-hidden rounded-xl ${theme === 'dark' ? 
                    'bg-gray-800 hover:bg-gray-700/80' : 
                    'bg-gray-100 hover:bg-gray-200/80'} transition-colors`}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`rounded-full p-6 transform group-hover:scale-110 transition-transform ${theme === 'dark' ? 
                        'bg-black/50' : 
                        'bg-white/50'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {video.title}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {video.description}
                    </p>
                  </div>
                </a>
              </ParallaxSection>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Videos;
