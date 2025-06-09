
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/ProjectsSection';
import { useTheme } from '@/components/ThemeProvider';

const Projects = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      <div className="pt-24 pb-8">
        <ProjectsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Projects;
