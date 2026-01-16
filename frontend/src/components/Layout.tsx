import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};
