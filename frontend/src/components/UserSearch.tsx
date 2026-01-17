import { useState, useEffect, useRef } from 'react';
import { userApi } from '../api/modules/users';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from './Input';

interface SearchResult {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
}

export const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
            if (!query.trim() || query.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const res = await userApi.search(query);
                setResults(res.data);
                setIsOpen(true);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="relative w-full max-w-sm ml-4" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    placeholder="Search users..."
                    className="pl-10 h-9"
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-600"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                )}
            </div>

            {isOpen && (results.length > 0 || (query.length >= 2 && results.length === 0 && !isLoading)) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 py-2 z-50">
                    {isLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
                    ) : results.length > 0 ? (
                        results.map((user) => (
                            <Link
                                key={user.id}
                                to={`/profile/${user.username}`}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 overflow-hidden">
                                     {user.avatarUrl ? (
                                         <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
                                     ) : (
                                         user.username.charAt(0).toUpperCase()
                                     )}
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{user.name || user.username}</div>
                                    <div className="text-xs text-gray-500">@{user.username}</div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No users found</div>
                    )}
                </div>
            )}
        </div>
    );
};
