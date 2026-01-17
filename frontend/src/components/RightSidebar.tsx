import { Search, MoreHorizontal } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Avatar } from './Avatar';

export const RightSidebar = () => {
  return (
    <div className="hidden lg:flex flex-col gap-4 w-[350px] py-2 pl-4 h-full">
      {/* Search Bar */}
      <div className="sticky top-0 bg-black py-2 z-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-primary" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 bg-[#202327] border-none rounded-full text-[#e7e9ea] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-black"
            placeholder="Search"
          />
        </div>
      </div>

      {/* What's Happening (Trends) */}
      <div className="bg-[#16181c] rounded-2xl flex flex-col pt-3">
        <h2 className="text-xl font-extrabold px-4 mb-3 text-[#e7e9ea]">What's happening</h2>
        
        {[
          { category: 'Development • Trending', topic: '#DevNest', posts: '25.4K posts' },
          { category: 'Technology • Trending', topic: 'TypeScript', posts: '152K posts' },
          { category: 'Programming • Trending', topic: 'React', posts: '85K posts' },
          { category: 'Technology • Trending', topic: 'AI & LLMs', posts: '42K posts' },
        ].map((trend, i) => (
          <div key={i} className="px-4 py-3 hover:bg-[#1d1f23] cursor-pointer transition-colors relative">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{trend.category}</span>
              <MoreHorizontal className="h-4 w-4 hover:text-primary" />
            </div>
            <div className="font-bold text-[#e7e9ea] mt-0.5">{trend.topic}</div>
            <div className="text-xs text-gray-500 mt-0.5">{trend.posts}</div>
          </div>
        ))}
        
        <div className="p-4 text-primary text-sm hover:bg-[#1d1f23] rounded-b-2xl cursor-pointer transition-colors">
          Show more
        </div>
      </div>

      {/* Who to follow */}
      <div className="bg-[#16181c] rounded-2xl flex flex-col pt-3">
        <h2 className="text-xl font-extrabold px-4 mb-3 text-[#e7e9ea]">Who to follow</h2>
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 py-3 hover:bg-[#1d1f23] cursor-pointer transition-colors flex items-center justify-between">
             <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-gray-700" />
                 <div className="flex flex-col">
                     <span className="font-bold text-[#e7e9ea] hover:underline">User {i}</span>
                     <span className="text-gray-500 text-sm">@user{i}</span>
                 </div>
             </div>
             <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-gray-200 font-bold px-4 h-8">
                 Follow
             </Button>
          </div>
        ))}

        <div className="p-4 text-primary text-sm hover:bg-[#1d1f23] rounded-b-2xl cursor-pointer transition-colors">
          Show more
        </div>
      </div>

      <div className="text-[13px] text-gray-500 px-4 flex flex-wrap gap-x-3 gap-y-1">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
          <span>Cookie Policy</span>
          <span>Accessibility</span>
          <span>Ads info</span>
          <span>More ...</span>
          <span>© 2026 DevNest, Inc.</span>
      </div>
    </div>
  );
};
