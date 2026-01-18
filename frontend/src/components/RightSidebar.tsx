import { Search } from 'lucide-react';

export const RightSidebar = () => {
  return (
    <div className="hidden lg:flex flex-col gap-6 w-[350px] py-6 pl-6 h-full sticky top-0">
      {/* Search Bar */}
      <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
            placeholder="Search DevNest..."
          />
      </div>

      {/* Suggested Follows Placeholder (Empty for now as requested) */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
              Suggestions will appear here based on your network.
          </p>
      </div>

      <div className="text-xs text-gray-400 flex flex-wrap gap-x-3 gap-y-1 px-2">
          <span>© 2026 DevNest</span>
          <span>Privacy</span>
          <span>Terms</span>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
);
