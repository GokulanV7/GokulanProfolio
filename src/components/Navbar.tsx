import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'Skills' },
    { path: '/videos', label: 'Videos' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-md py-2 shadow-lg' : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white hover:text-purple-200 transition-colors">
            Gokulan
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative px-2 py-1 text-sm font-medium transition-colors duration-300 ${
                  isActive(link.path) ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                {/* Active indicator */}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 transition-opacity duration-300 ${
                  isActive(link.path) ? 'opacity-100' : 'opacity-0'
                }`} />
                {/* Hover indicator */}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-200 hover:bg-purple-800/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">
                {mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Side Panel */}
        <div
          className={`fixed top-0 left-0 z-50 w-full h-screen bg-gradient-to-br from-purple-400/30 to-purple-600/30 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/"
                className="text-xl font-bold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gokulan
              </Link>
              <button
                type="button"
                className="p-2 rounded-md text-white hover:text-purple-200 hover:bg-purple-800/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col space-y-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium transition-colors duration-200 border-l-4 pl-4 ${
                    isActive(link.path)
                      ? 'text-white border-purple-400'
                      : 'text-gray-300 border-transparent hover:text-white hover:border-purple-400'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
