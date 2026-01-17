import { useEffect, useState } from 'react';
import { postApi } from '../api/modules/posts';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { MessageSquare, Heart, Repeat, Share, Image, Smile, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Comments } from '../components/Comments';

interface Post {
  id: string;
  content: string;
  author: {
    username: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

export const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await postApi.getAll();
            setPosts(res.data.items || []); 
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPosts();
        }
    }, [user]);

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        setIsPosting(true);
        try {
            await postApi.create({ content: newPostContent });
            setNewPostContent('');
            fetchPosts(); // Refresh feed
        } catch (error) {
            console.error("Failed to create post", error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleLike = async (postId: string, currentIsLiked: boolean) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !currentIsLiked,
                    _count: {
                        ...post._count,
                        likes: currentIsLiked ? post._count.likes - 1 : post._count.likes + 1
                    }
                };
            }
            return post;
        }));

        try {
            if (currentIsLiked) {
                await postApi.unlike(postId);
            } else {
                await postApi.like(postId);
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const toggleComments = (postId: string) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    if (!user) return null; // Or generic welcome screen

    return (
        <div className="flex flex-col min-h-screen border-x border-border max-w-[600px] w-full mx-auto">
            {/* Sticky Header */}
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-border">
                <h1 className="hidden">Home</h1>
                <div className="flex">
                    <button 
                        onClick={() => setActiveTab('foryou')}
                        className="flex-1 hover:bg-gray-900 transition-colors cursor-pointer h-[53px] flex items-center justify-center relative"
                    >
                        <span className={`font-bold text-[15px] ${activeTab === 'foryou' ? 'text-[#e7e9ea]' : 'text-gray-500'}`}>
                            For you
                            {activeTab === 'foryou' && <div className="absolute bottom-0 h-1 w-14 bg-primary rounded-full"></div>}
                        </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('following')}
                        className="flex-1 hover:bg-gray-900 transition-colors cursor-pointer h-[53px] flex items-center justify-center relative"
                    >
                        <span className={`font-bold text-[15px] ${activeTab === 'following' ? 'text-[#e7e9ea]' : 'text-gray-500'}`}>
                            Following
                            {activeTab === 'following' && <div className="absolute bottom-0 h-1 w-16 bg-primary rounded-full"></div>}
                        </span>
                    </button>
                </div>
            </header>

            {/* What is happening?! */}
            <div className="px-4 py-3 border-b border-border flex gap-4">
                <Avatar src={user.avatarUrl} alt={user.name} />
                <div className="flex-1 pt-2">
                    <textarea 
                        className="w-full bg-transparent text-xl text-[#e7e9ea] placeholder-gray-500 border-none focus:ring-0 resize-none min-h-[50px]"
                        placeholder="What is happening?!"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-3 border-t border-border pt-3">
                        <div className="flex gap-1 text-primary">
                            <Button variant="ghost" size="sm" className="p-2 text-primary hover:bg-primary-100/10 rounded-full"><Image className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="sm" className="p-2 text-primary hover:bg-primary-100/10 rounded-full"><Smile className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="sm" className="p-2 text-primary hover:bg-primary-100/10 rounded-full"><Calendar className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="sm" className="p-2 text-primary hover:bg-primary-100/10 rounded-full"><MapPin className="h-5 w-5" /></Button>
                        </div>
                        <Button 
                            className="rounded-full px-4 font-bold" 
                            disabled={!newPostContent.trim() || isPosting}
                            onClick={handleCreatePost}
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </div>

            {/* Feed */}
            {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading posts...</div>
            ) : (
                <div className="flex flex-col">
                    {posts.map((post) => (
                        <div key={post.id} className="p-4 border-b border-border hover:bg-gray-900/30 transition-colors cursor-pointer">
                            <div className="flex gap-3">
                                <Link to={`/profile/${post.author.username}`} className="flex-shrink-0">
                                    <Avatar src={post.author.avatarUrl} alt={post.author.name} />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 text-[15px] mb-0.5">
                                        <Link to={`/profile/${post.author.username}`} className="font-bold text-[#e7e9ea] hover:underline truncate">
                                            {post.author.name}
                                        </Link>
                                        <span className="text-gray-500 truncate">@{post.author.username}</span>
                                        <span className="text-gray-500">·</span>
                                        <span className="text-gray-500 hover:underline text-sm">
                                            {formatDistanceToNow(new Date(post.createdAt))}
                                        </span>
                                    </div>
                                    
                                    <p className="text-[#e7e9ea] text-[15px] whitespace-pre-wrap mb-3 leading-normal">
                                        {post.content}
                                    </p>

                                    <div className="flex justify-between max-w-md text-gray-500">
                                        <div 
                                            className={`flex items-center gap-2 group cursor-pointer transition-colors ${expandedPostId === post.id ? 'text-primary' : 'hover:text-primary'}`}
                                            onClick={(e) => { e.stopPropagation(); toggleComments(post.id); }}
                                        >
                                            <div className="p-2 group-hover:bg-primary/10 rounded-full transition-colors">
                                                <MessageSquare className="h-[18px] w-[18px]" />
                                            </div>
                                            <span className="text-sm">{post._count?.comments || 0}</span>
                                        </div>

                                        <div className="flex items-center gap-2 group cursor-pointer hover:text-green-500 transition-colors">
                                            <div className="p-2 group-hover:bg-green-500/10 rounded-full transition-colors">
                                                <Repeat className="h-[18px] w-[18px]" />
                                            </div>
                                            <span className="text-sm">0</span>
                                        </div>

                                        <div 
                                            className={`flex items-center gap-2 group cursor-pointer transition-colors ${post.isLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                                            onClick={(e) => { e.stopPropagation(); handleLike(post.id, post.isLiked || false); }}
                                        >
                                            <div className="p-2 group-hover:bg-pink-600/10 rounded-full transition-colors">
                                                <Heart className={`h-[18px] w-[18px] ${post.isLiked ? 'fill-current' : ''}`} />
                                            </div>
                                            <span className="text-sm">{post._count?.likes || 0}</span>
                                        </div>

                                        <div className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
                                            <div className="p-2 group-hover:bg-primary/10 rounded-full transition-colors">
                                                <Share className="h-[18px] w-[18px]" />
                                            </div>
                                        </div>
                                    </div>

                                    {expandedPostId === post.id && (
                                        <div className="mt-4" onClick={e => e.stopPropagation()}>
                                            <Comments postId={post.id} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No posts to show
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
