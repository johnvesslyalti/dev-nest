import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, LogOut, Bell, Mail, Bookmark, MoreHorizontal, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import { Button } from './Button';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

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
    <div className="fixed top-0 bottom-0 flex flex-col justify-between w-[275px] px-2 py-4 border-r border-border overflow-y-auto">
      <div className="flex flex-col gap-2">
        {/* Logo */}
        <div className="p-3 mb-2 w-fit rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-white">
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link 
                        key={item.path} 
                        to={item.path}
                        className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-800 transition-colors w-fit pr-8"
                    >
                        <item.icon className={`h-7 w-7 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                        <span className={`text-xl ${isActive ? 'font-bold' : 'font-normal'}`}>{item.label}</span>
                    </Link>
                );
            })}
             <button className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-800 transition-colors w-fit pr-8">
                <MoreHorizontal className="h-7 w-7" />
                <span className="text-xl">More</span>
            </button>
        </nav>

        {/* Post Button */}
        <Link to="/compose/post" className="mt-4 w-[90%]">
             <Button className="w-full rounded-full h-[52px] text-lg font-bold shadow-none hover:bg-primary-hover">
                Post
             </Button>
        </Link>
      </div>

      {/* User Mini Profile */}
      <div className="p-3 rounded-full hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
              <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
              <div className="flex flex-col">
                  <span className="font-bold text-[15px]">{user.name}</span>
                  <span className="text-[15px] text-gray-500">@{user.username}</span>
              </div>
          </div>
          <MoreHorizontal className="h-4 w-4" />
      </div>
    </div>
  );
};
