import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { LogOut, Bell, Menu, X } from 'lucide-react';
import { UserSearch } from './UserSearch';
import { Avatar } from './Avatar';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Projects', path: '/projects' },
    { name: 'Community', path: '/community' },
    { name: 'Learn', path: '/learn' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-charcoal/80 dark:border-gray-800 transition-colors duration-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-[1200px]">
        {/* Logo */}
        <Link to="/feed" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-accent-blue to-blue-600 shadow-lg group-hover:shadow-accent-blue/30 transition-all duration-200">
             <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">D</div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            DevNest
          </span>
        </Link>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-sm font-medium ${location.pathname === link.path ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
              >
                {link.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {/* Search - Visible on larger screens */}
              <div className="hidden lg:block w-64">
                 <UserSearch />
              </div>

              {/* Icons */}
              <div className="flex items-center gap-1 dark:text-gray-400">
                 <Link to="/notifications">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                      <Bell className="h-5 w-5" />
                    </Button>
                 </Link>
              </div>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <Link to={`/profile/${user.username}`}>
                  <Avatar src={user.avatarUrl} alt={user.name} size="sm" className="h-8 w-8 ring-2 ring-gray-100 dark:ring-gray-800 cursor-pointer hover:ring-accent-blue transition-all" />
                </Link>
                <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{user.name}</span>
                    <span className="text-[10px] text-gray-500">@{user.username}</span>
                </div>
                
                <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 ml-1">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-semibold">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="shadow-lg shadow-accent-blue/20">Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown (Simple implementation) */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-charcoal px-4 py-4 space-y-2">
           {navLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)}>
              <div className="block py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                {link.name}
              </div>
            </Link>
          ))}
           {!user && (
             <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Get Started</Button>
                </Link>
             </div>
           )}
        </div>
      )}
    </nav>
  );
};
