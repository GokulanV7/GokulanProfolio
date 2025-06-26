import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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

  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  type NavLink = {
    path: string;
    label: string;
  };

  const navLinks: NavLink[] = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'Skills' },
    { path: '/videos', label: 'Videos' },
    { path: '/contact', label: 'Contact' },
    ...(currentUser?.uid === 'YOUR_ADMIN_UID' ? [{ path: '/admin', label: 'Admin' }] : [])
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

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
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative px-2 py-1 text-sm font-medium transition-colors duration-300 ${
                  isActive(link.path) ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                <span 
                  className={`absolute -bottom-1 left-0 h-0.5 bg-purple-400 transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
            
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || 'User'} />
                      <AvatarFallback>
                        {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.displayName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {currentUser.uid === 'YOUR_ADMIN_UID' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                  className="text-white border-white/30 hover:bg-white/10 hover:text-white"
                >
                  Login
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => navigate('/signup')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button and auth */}
          <div className="flex items-center space-x-4 md:hidden">
            {!mobileMenuOpen && !currentUser && (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                  className="text-white hover:bg-white/10"
                >
                  Login
                </Button>
              </div>
            )}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || 'User'} />
                      <AvatarFallback>
                        {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.displayName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {currentUser.uid === 'YOUR_ADMIN_UID' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-purple-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile menu, show/hide based on menu state */}
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'text-white bg-purple-900/50'
                      : 'text-gray-300 hover:bg-purple-800/50 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-purple-800/50 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-purple-800/50 hover:text-white"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
