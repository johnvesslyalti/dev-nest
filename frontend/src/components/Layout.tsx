import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';
import { Toaster } from 'react-hot-toast';

export const Layout = () => {
  return (
    <div className="flex justify-center min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="flex w-full max-w-[1300px]">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Feed Content */}
        <main className="flex-1 max-w-[600px] border-r border-border min-h-screen">
          <Outlet />
        </main>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      <Toaster 
        position="bottom-center"
        toastOptions={{
          className: 'bg-primary text-white',
          style: {
            background: '#1d9bf0',
            color: '#fff',
            borderRadius: '9999px',
          },
        }}
      />
    </div>
  );
};
