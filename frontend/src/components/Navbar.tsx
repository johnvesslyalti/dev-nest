import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { LogOut, Home, PlusSquare } from 'lucide-react';
import { UserSearch } from './UserSearch';
import { Avatar } from './Avatar';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
             <img src="/logo.png" alt="DevNest" className="h-full w-full object-cover opacity-90" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            DevNest
          </span>
        </Link>
        
        {user ? (
          <>
            <div className="hidden md:block flex-1 max-w-md mx-6">
               <UserSearch />
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-gray-600 dark:text-gray-400">
                  <Home className="mr-2 h-4 w-4" />
                  Feed
                </Button>
                <Button variant="ghost" size="sm" className="sm:hidden h-10 w-10 p-0 rounded-full">
                  <Home className="h-5 w-5 py-0" />
                </Button>
              </Link>
              
              <Link to="/create-post">
                 <Button variant="primary" size="sm" className="hidden sm:inline-flex shadow-primary-500/20">
                  <PlusSquare className="mr-2 h-4 w-4" />
                  Post
                </Button>
                 <Button variant="primary" size="sm" className="sm:hidden h-10 w-10 p-0 rounded-full shadow-primary-500/20">
                  <PlusSquare className="h-5 w-5" />
                </Button>
              </Link>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

              <Link to={`/profile/${user.username}`}>
                <Avatar src={user.avatarUrl} alt={user.name} size="sm" className="h-9 w-9 ring-2 ring-gray-100 dark:ring-gray-800 cursor-pointer hover:ring-primary-500 transition-all" />
              </Link>
              
              <Button variant="ghost" size="sm" onClick={logout} className="h-9 w-9 p-0 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
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
              <Button variant="primary" size="sm" className="shadow-lg shadow-primary-500/20">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
