import { useEffect, useState } from 'react';
import { postApi } from '../api/modules/posts';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { MessageSquare, Heart, Repeat, Share, Image, Smile, Calendar } from 'lucide-react';
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
        <div className="flex flex-col min-h-screen max-w-[680px] w-full mx-auto pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 mb-6">
                <div className="flex px-2">
                    <button 
                        onClick={() => setActiveTab('foryou')}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'foryou' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                    >
                        For you
                        {activeTab === 'foryou' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-primary-600 rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('following')}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'following' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                    >
                        Following
                        {activeTab === 'following' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-primary-600 rounded-t-full"></div>}
                    </button>
                </div>
            </header>

            {/* Create Post Card */}
            <div className="px-4 mb-8">
                <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex gap-4">
                        <Avatar src={user.avatarUrl || undefined} alt={user.name || user.username} />
                        <div className="flex-1">
                             <textarea 
                                className="w-full bg-transparent text-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 border-none focus:ring-0 resize-none min-h-[60px]"
                                placeholder="What's happening?"
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"><Image className="h-5 w-5" /></Button>
                                    <Button variant="ghost" size="sm" className="text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"><Smile className="h-5 w-5" /></Button>
                                    <Button variant="ghost" size="sm" className="text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"><Calendar className="h-5 w-5" /></Button>
                                </div>
                                <Button 
                                    className="px-6 rounded-lg font-semibold"
                                    disabled={!newPostContent.trim() || isPosting}
                                    onClick={handleCreatePost}
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Feed */}
            {isLoading ? (
                 <div className="space-y-6 px-4">
                     {[1, 2, 3].map(i => (
                         <Card key={i} className="h-64 animate-pulse bg-gray-100 dark:bg-gray-900">
                             <div className="h-full w-full" />
                         </Card>
                     ))}
                 </div>
            ) : (
                <div className="flex flex-col gap-6 px-4">
                    {posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Link to={`/profile/${post.author.username}`}>
                                        <Avatar src={post.author.avatarUrl} alt={post.author.name} />
                                    </Link>
                                    <div>
                                        <Link to={`/profile/${post.author.username}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                                            {post.author.name}
                                        </Link>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            @{post.author.username} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                
                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed mb-4">
                                    {post.content}
                                </p>

                                <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                     <button 
                                        onClick={() => handleLike(post.id, post.isLiked || false)}
                                        className={`flex items-center gap-2 transition-colors group ${post.isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'}`}
                                    >
                                        <Heart className={`h-5 w-5 transition-transform group-active:scale-95 ${post.isLiked ? 'fill-current' : ''}`} />
                                        <span className="text-sm font-medium">{post._count?.likes || 0}</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => toggleComments(post.id)}
                                        className={`flex items-center gap-2 transition-colors group ${expandedPostId === post.id ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'}`}
                                    >
                                        <MessageSquare className="h-5 w-5 transition-transform group-active:scale-95" />
                                        <span className="text-sm font-medium">{post._count?.comments || 0}</span>
                                    </button>

                                    <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors group">
                                         <Repeat className="h-5 w-5 transition-transform group-active:scale-95" />
                                         <span className="text-sm font-medium">0</span>
                                    </button>

                                    <button className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors ml-auto">
                                         <Share className="h-5 w-5" />
                                    </button>
                                </div>

                                {expandedPostId === post.id && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <Comments postId={post.id} />
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                    {posts.length === 0 && (
                        <div className="p-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                            No posts to show
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
