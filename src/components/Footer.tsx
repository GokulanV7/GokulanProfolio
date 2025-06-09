
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, PhoneCall, Download } from 'lucide-react';
import { downloadResume } from '@/utils/downloadUtils';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  
  return (
    <footer className={`relative z-20 py-12 ${theme === 'dark' ? 
      'bg-gray-900 border-t border-gray-800' : 
      'bg-gray-50 border-t border-gray-200'}`}>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gradient' : 'text-gradient-light'}`}>
                Gokulan
              </h2>
            </Link>
            <p className={`max-w-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Flutter Developer & Machine Learning Specialist. Creating beautiful mobile experiences and intelligent systems.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className={`p-2 rounded-full ${theme === 'dark' ? 
                'bg-gray-800 hover:bg-gray-700' : 
                'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                <Github className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
              </a>
              <a href="#" className={`p-2 rounded-full ${theme === 'dark' ? 
                'bg-gray-800 hover:bg-gray-700' : 
                'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                <Linkedin className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
              </a>
              <a href="#" className={`p-2 rounded-full ${theme === 'dark' ? 
                'bg-gray-800 hover:bg-gray-700' : 
                'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
              </a>
              <a href="#" className={`p-2 rounded-full ${theme === 'dark' ? 
                'bg-gray-800 hover:bg-gray-700' : 
                'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                <PhoneCall className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`${theme === 'dark' ? 
                  'text-gray-400 hover:text-white' : 
                  'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className={`${theme === 'dark' ? 
                  'text-gray-400 hover:text-white' : 
                  'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/projects" className={`${theme === 'dark' ? 
                  'text-gray-400 hover:text-white' : 
                  'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/videos" className={`${theme === 'dark' ? 
                  'text-gray-400 hover:text-white' : 
                  'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`${theme === 'dark' ? 
                  'text-gray-400 hover:text-white' : 
                  'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Contact
                </Link>
              </li>
              <li>
                <button 
                  onClick={downloadResume}
                  className={`w-full text-left relative z-30 ${theme === 'dark' ? 
                    'text-gray-400 hover:text-white' : 
                    'text-gray-600 hover:text-gray-900'} transition-colors flex items-center gap-1 hover:z-40`}
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Contact Me
            </h3>
            <address className="not-italic">
              <ul className="space-y-2">
                <li className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Mail className="h-4 w-4" />
                  <a href="mailto:gokulhope97@gmail.com" className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    gokulhope97@gmail.com
                  </a>
                </li>
                <li className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <PhoneCall className="h-4 w-4" />
                  <a href="tel:+919361620860" className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    +91 93616 20860
                  </a>
                </li>
                <li className={`flex items-start gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    Shri Shakthi College,<br />
                    Coimbatore, India
                  </span>
                </li>
              </ul>
            </address>
          </div>
        </div>
        
        <div className={`mt-12 pt-8 ${theme === 'dark' ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}>
          <p className="text-center text-sm text-gray-500">
            © {year} Gokulan. All rights reserved. | Flutter Developer & ML Specialist
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
