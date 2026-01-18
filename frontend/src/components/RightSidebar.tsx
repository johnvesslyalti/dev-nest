import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../api/modules/users';
import { Avatar } from './Avatar';

export const RightSidebar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Simple debounce logic inside effect for now to avoid creating new file if possible
  useEffect(() => {
    const timer = setTimeout(async () => {
        if (query.trim().length >= 2) {
            setIsSearching(true);
            try {
                const res = await userApi.search(query);
                setResults(res.data);
                setShowResults(true);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setResults([]);
            setShowResults(false);
        }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
              setShowResults(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hidden lg:flex flex-col gap-6 w-[350px] py-6 pl-6 h-full sticky top-0">
      {/* Search Bar */}
      <div className="relative group" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors ${isSearching ? 'text-primary-500' : 'text-gray-400 group-focus-within:text-primary-500'}`} />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowResults(true)}
            />
            {query && (
                <button 
                    onClick={() => { setQuery(''); setResults([]); }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
                  {results.length > 0 ? (
                      <div className="py-2">
                          {results.map((user) => (
                              <Link 
                                key={user.id} 
                                to={`/profile/${user.username}`}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => setShowResults(false)}
                              >
                                  <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                                  <div className="flex flex-col overflow-hidden">
                                      <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{user.name}</span>
                                      <span className="text-xs text-gray-500 truncate">@{user.username}</span>
                                  </div>
                              </Link>
                          ))}
                      </div>
                  ) : (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          {isSearching ? 'Searching...' : `No results for "${query}"`}
                      </div>
                  )}
              </div>
          )}
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
