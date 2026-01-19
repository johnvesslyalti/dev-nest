import { Button } from '../components/Button';
import { Search } from 'lucide-react';
import { Input } from '../components/Input';

export const Explore = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold dark:text-white">Explore</h1>
        <p className="text-gray-500 dark:text-gray-400">Discover developers, projects, and community posts.</p>
        
        <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
             <Input placeholder="Search everything..." className="pl-10 h-12 text-base" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Developers', 'Projects', 'Posts', 'Events'].map((tab) => (
             <Button key={tab} variant="outline" className="rounded-full px-6 whitespace-nowrap">
                 {tab}
             </Button>
        ))}
      </div>

      <div className="grid gap-6">
        {/* Placeholder content */}
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Search or select a category to start exploring.
        </div>
      </div>
    </div>
  );
};
