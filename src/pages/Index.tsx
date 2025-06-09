
import { useEffect, useRef } from 'react';
import HeroSection from '@/components/HeroSection';
import TechStack from '@/components/TechStack';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import { applyParallaxToElements } from '@/utils/parallaxUtils';
import { useTheme } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParallaxSection from '@/components/ParallaxSection';
import { Button } from '@/components/ui/button';
import Chat from '@/components/Chat';
import { Link } from 'react-router-dom';

const Index = () => {
  const cleanupRef = useRef<() => void>();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Initialize enhanced parallax effects after component mounts
    const initParallax = async () => {
      cleanupRef.current = await applyParallaxToElements();
    };
    
    initParallax();
    
    return () => {
      // Clean up parallax effects
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return (
    <div className={`min-h-screen overflow-x-hidden ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />
      
      <HeroSection />
      
      <section id="about" className={`py-20 ${theme === 'dark' ? 
        'bg-gradient-to-b from-gray-950 to-gray-900' : 
        'bg-gradient-to-b from-white to-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParallaxSection speed={0.05}>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-12 text-center ${theme === 'dark' ? 'text-gradient' : 'text-gradient-light'}`}>
              About Me
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <p className={`text-lg mb-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  I'm Gokulan, a passionate Flutter developer and Computer Science student at Shri Shakthi College. I build elegant cross-platform apps and AI-driven systems using Flutter, Python, FastAPI, and ML.
                </p>
                
                <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  I've worked on projects like FALO AI (Top 12 Finalist) and a real-time face recognition system. My expertise spans from front-end mobile development to backend engineering and machine learning integration.
                </p>
                
                <Link to="/about">
                  <Button className={theme === 'dark' ? 
                    'bg-purple-600 hover:bg-purple-700 text-white' : 
                    'bg-purple-500 hover:bg-purple-600 text-white'}>
                    Learn More About Me
                  </Button>
                </Link>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <ParallaxSection speed={0.1} reverse>
                  <div className={`w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 ${theme === 'dark' ? 
                    'border-purple-500 shadow-lg shadow-purple-500/20' : 
                    'border-purple-400 shadow-lg shadow-purple-400/10'}`}>
                    <img 
                      src="/IMG_5145.jpg" 
                      alt="Gokulan" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </ParallaxSection>
              </div>
            </div>
          </ParallaxSection>
        </div>
      </section>
      
      <section className={`py-20 ${theme === 'dark' ? 
        'bg-gray-900' : 
        'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TechStack />
        </div>
      </section>
      
      <ProjectsSection />
      
      <section className={`py-20 ${theme === 'dark' ? 
        'bg-gray-950' : 
        'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParallaxSection speed={0.05}>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-gradient' : 'text-gradient-light'}`}>
              Video Gallery
            </h2>
            <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Check out videos of my projects and demos showcasing my Flutter applications and AI/ML implementations.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <ParallaxSection speed={0.1}>
                <div className={`group relative overflow-hidden rounded-xl hover-scale ${theme === 'dark' ? 
                  'bg-gray-800' : 
                  'bg-gray-100'}`}>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-700">
                    <img 
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                      alt="Flutter App Demo" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`rounded-full p-4 ${theme === 'dark' ? 
                        'bg-black/50' : 
                        'bg-white/50'} group-hover:scale-110 transition-transform`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Flutter App Demo
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      A walkthrough of my e-commerce app built with Flutter
                    </p>
                  </div>
                </div>
              </ParallaxSection>
              
              <ParallaxSection speed={0.15}>
                <div className={`group relative overflow-hidden rounded-xl hover-scale ${theme === 'dark' ? 
                  'bg-gray-800' : 
                  'bg-gray-100'}`}>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-700">
                    <img 
                      src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                      alt="AI Demo" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`rounded-full p-4 ${theme === 'dark' ? 
                        'bg-black/50' : 
                        'bg-white/50'} group-hover:scale-110 transition-transform`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      FALO AI Demo
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Demonstrating our fake news detection algorithm in action
                    </p>
                  </div>
                </div>
              </ParallaxSection>
            </div>
            
            <div className="flex justify-center mt-10">
              <Link to="/videos">
                <Button className={theme === 'dark' ? 
                  'bg-gray-800 hover:bg-gray-700 text-white' : 
                  'bg-gray-200 hover:bg-gray-300 text-gray-900'}>
                  View All Videos
                </Button>
              </Link>
            </div>
          </ParallaxSection>
        </div>
      </section>
      
      <ContactSection />
      
      <Footer />
      
      {/* Chat component */}
      <Chat />
    </div>
  );
};

export default Index;
