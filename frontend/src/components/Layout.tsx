import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { RightSidebar } from './RightSidebar';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { user } = useAuth();
  // Only show Right Sidebar if user is logged in
  const showRightSidebar = !!user;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-midnight text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
      <Navbar />
      
      <div className="flex justify-center w-full max-w-[1240px] mx-auto pt-4 sm:pt-6">
        {/* Main Content */}
        <main className={`flex-1 w-full max-w-[700px] ${showRightSidebar ? 'lg:mr-8' : ''} px-4 mb-20 md:mb-8`}>
          <Outlet />
        </main>
        
        {/* Right Sidebar (Desktop only) */}
        {showRightSidebar && (
            <aside className="hidden lg:block w-[320px] shrink-0 sticky top-24 h-[calc(100vh-6rem)]">
                <RightSidebar />
            </aside>
        )}
      </div>

      <MobileNav />
    </div>
  );
};
