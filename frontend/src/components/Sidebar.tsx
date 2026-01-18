import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, LogOut, Bell, Mail, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import { Button } from './Button';

export const Sidebar = () => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
      return (
        <div className="sticky top-0 h-screen flex flex-col w-[280px] p-4 border-r border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl">
             <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full mb-8 animate-pulse" />
             <div className="flex flex-col gap-4">
                 {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="h-10 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                 ))}
             </div>
        </div>
      )
  }

  if (!user) return null;

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Mail, label: 'Messages', path: '/messages' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: User, label: 'Profile', path: `/profile/${user.username}` },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="sticky top-0 h-screen flex flex-col w-[280px] p-4 border-r border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl">
      <div className="flex flex-col gap-6 h-full">
        {/* Logo */}
        <div className="px-4 py-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            DevNest
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-1.5 flex-1">
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link 
                        key={item.path} 
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 font-medium' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'fill-current opacity-100' : 'opacity-70'}`} />
                        <span className="text-base">{item.label}</span>
                    </Link>
                );
            })}
        </nav>

        {/* Post Button */}
        <Link to="/create-post" className="mb-6">
             <Button className="w-full rounded-xl py-6 text-lg font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
                Create Post
             </Button>
        </Link>

        {/* User Mini Profile */}
        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer">
              <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
              <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">{user.name}</span>
                  <span className="text-xs text-gray-500 truncate">@{user.username}</span>
              </div>
              <div className="ml-auto">
                 <Button variant="ghost" size="sm" onClick={() => logout()} className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                    <LogOut className="h-4 w-4" />
                 </Button>
              </div>
        </div>
      </div>
    </div>
  );
};
