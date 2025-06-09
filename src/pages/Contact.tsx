
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { useTheme } from '@/components/ThemeProvider';

const Contact = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      <Navbar />
      <div className="pt-24 pb-8">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
